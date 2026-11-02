/**
 * Franchi Pedidos · administração de empresas
 * Supabase Edge Function. Requer JWT de usuário em public.platform_admins.
 * A chave service_role existe SOMENTE no ambiente seguro da Edge Function.
 */
import { createClient } from 'npm:@supabase/supabase-js@2.117.2';

const json = (data: unknown, status=200, origin='') => new Response(JSON.stringify(data), {
  status,
  headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...cors(origin)},
});
function cors(origin:string){const ok = /^https:\/\/(?:[\w-]+--)?franchi-pedidos\.netlify\.app$/.test(origin)||/^http:\/\/localhost(?::\d+)?$/.test(origin);return {'Access-Control-Allow-Origin':ok?origin:'https://franchi-pedidos.netlify.app','Vary':'Origin','Access-Control-Allow-Methods':'POST,OPTIONS','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type'};}
function slugify(v:string){return v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70);}
const str=(v:unknown,max:number)=>typeof v==='string'?v.trim().slice(0,max):'';
const digits=(v:unknown)=>String(v||'').replace(/\D/g,'');
Deno.serve(async (req:Request) => {
  const origin=req.headers.get('origin')||'';
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors(origin)});
  if(req.method!=='POST')return json({error:'Método não permitido.'},405,origin);
  const bearer=req.headers.get('authorization')||'';
  if(!bearer.startsWith('Bearer '))return json({error:'Acesso não autorizado.'},401,origin);
  const token=bearer.slice(7).trim();
  const supabaseUrl=Deno.env.get('SUPABASE_URL');
  const serviceKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if(!supabaseUrl||!serviceKey)return json({error:'Serviço administrativo não configurado.'},503,origin);
  const db=createClient(supabaseUrl,serviceKey,{auth:{autoRefreshToken:false,persistSession:false}});
  try{
    const {data:{user},error:authError}=await db.auth.getUser(token);
    if(authError||!user||user.is_anonymous)return json({error:'Sessão inválida. Faça login novamente.'},401,origin);
    const {data:admin,error:adminError}=await db.from('platform_admins').select('user_id').eq('user_id',user.id).maybeSingle();
    if(adminError||!admin)return json({error:'Somente o administrador da plataforma pode cadastrar empresas.'},403,origin);
    let b:Record<string,unknown>;
    try { b=await req.json(); } catch {return json({error:'Envie os dados no formato JSON.'},400,origin);}
    if(b.action==='create'){
      const name=str(b.name,110),type=str(b.type,40)||'Catálogo', email=str(b.email,255).toLowerCase(),password=String(b.password||''),address=str(b.pickup_address,300),whatsapp=digits(b.whatsapp),slug=slugify(str(b.slug,70)||name);
      if(name.length<2||!email.includes('@')||email.length<6||password.length<8||password.length>72||address.length<6||whatsapp.length<10||whatsapp.length>13||!slug||slug.length<3)return json({error:'Confira nome, e-mail, senha (mínimo 8 caracteres), endereço e WhatsApp.'},400,origin);
      const {data:existing,error:searchError}=await db.from('stores').select('id').eq('slug',slug).maybeSingle();
      if(searchError)return json({error:'Não foi possível verificar o link da empresa.'},500,origin);
      if(existing)return json({error:'Este endereço de loja já está em uso. Escolha outro link.'},409,origin);
      const {data:authData,error:signupErr}=await db.auth.admin.createUser({email,password,email_confirm:true,app_metadata:{franchi_role:'store_manager'}});
      if(signupErr||!authData.user)return json({error:signupErr?.message||'Não foi possível criar o login.'},400,origin);
      const id=authData.user.id;
      const {data:store,error:storeErr}=await db.from('stores').insert({owner_id:id,name,type,slug,whatsapp:whatsapp.startsWith('55')?whatsapp:'55'+whatsapp,pickup_address:address,is_open:true,is_published:true}).select('id,name,slug').single();
      if(storeErr){await db.auth.admin.deleteUser(id);return json({error:storeErr.code==='23505'?'O link já está em uso.':'Não foi possível cadastrar a loja.'},400,origin);}
      return json({success:true,...store},201,origin);
    }
    if(b.action==='update'){
      const id=str(b.id,36),name=str(b.name,110),address=str(b.pickup_address,300),whatsapp=digits(b.whatsapp);
      if(!/^[0-9a-f-]{36}$/i.test(id)||name.length<2||whatsapp.length<10||whatsapp.length>13)return json({error:'Dados inválidos.'},400,origin);
      const payload={name,whatsapp:whatsapp.startsWith('55')?whatsapp:'55'+whatsapp,pickup_address:address,is_published:b.is_published===true};
      const {data:store,error}=await db.from('stores').update(payload).eq('id',id).select('id,name,slug').single();
      if(error)return json({error:'Não foi possível atualizar esta empresa.'},400,origin);
      return json({success:true,store},200,origin);
    }
    return json({error:'Ação desconhecida.'},400,origin);
  }catch(error){console.error('admin-lojas',error);return json({error:'Erro interno no cadastro da empresa.'},500,origin);}
});
