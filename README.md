# FRANCHI PEDIDOS · VERSÃO 2

Site HTML/CSS/JS com banco Supabase real para catálogo, checkout, painel de loja e administração. Adaptado para publicação via Netlify e edição no celular.

## Publicação

1. Faça um backup dos arquivos atuais do site.
2. Extraia este ZIP e envie os arquivos da **raiz desta pasta** no repositório GitHub `FHumuarama/franchi-pedidos` ou publique manualmente no Netlify. Se usar deploy manual no Netlify, escolha a pasta que contém `public/index.html`, `public/app.js`, `public/style.css`, `netlify.toml`.
3. Se o Netlify usa GitHub, confirme que o projeto está vinculado ao repositório e à branch principal. Publish directory: `public`; build command: vazio.
4. Não é necessário reexecutar a migração SQL se o Supabase já tiver sido atualizado nesta conversa. A função administrativa `admin-lojas` também já foi implantada no projeto Supabase `weaddoldbgxoxljkjaty`.

## Endereços

- `/`: seleção de lojas públicas.
- `/loja/slug-da-empresa`: catálogo exclusivo, sem cadastro.
- `/gestor`: login com e-mail e senha (acesso via link discreto no rodapé).
- `/administracao`: caminho alternativo para login administrativo. O mesmo login identifica o perfil.

## Perfis

- Cliente: escolhe loja, produtos, quantidades, entrega/retirada, pagamento e confirma. O pedido é persistido na tabela `orders` pela função segura `create_customer_order`. Depois de confirmar, o cliente pode clicar para abrir o WhatsApp da loja com uma cópia da compra. O navegador **não pode enviar mensagens de WhatsApp automaticamente** sem uma API oficial e suas credenciais; a pessoa deve apertar Enviar no WhatsApp.
- Gestor: autenticação Supabase, pedidos da própria loja e atualização de status, categorias, cadastro/edição/exclusão de produtos, upload de foto (máximo 5 MB), descrição, preço e disponibilidade, WhatsApp, endereço, taxa de entrega, loja aberta/fechada.
- Administrador geral: autenticado, autorizado via tabela `platform_admins`, cadastra empresas, logins e senhas por função Edge segura `admin-lojas`, gera o link único da loja e edita nome/endereço/WhatsApp/publicação.

## Limitações desta versão

- O link de WhatsApp abre a conversa com mensagem preenchida, mas não faz envio automático invisível.
- O catálogo permite itens simples; para produtos que exigem grupos de adicionais obrigatórios, a seleção de opções ainda precisa ser implementada na interface.
- Não há recuperação automática de senha no painel; o administrador configura a senha inicial da empresa.
- Os pedidos usam atualização automática de 20 em 20 segundos enquanto a aba Pedidos está aberta.
- Nenhuma assinatura ou cobrança real foi ativada.
- O cadastro inicial do administrador deve existir previamente no Supabase Auth e na tabela `platform_admins`; não existe senha padrão no código.

## Segurança

- Chave de frontend Supabase é publicável. Nenhuma chave `service_role` está no HTML.
- O cadastro de usuários ocorre exclusivamente em função Edge com autenticação administrativa.
- Leitura e escrita nas tabelas são controladas por RLS no Supabase.
- Senhas reais são geridas pelo Supabase Auth, não são armazenadas no navegador nem em `localStorage`.

## Arquivos

- `public/index.html`: estrutura de páginas.
- `public/style.css`: identidade visual responsiva.
- `public/app.js`: navegação e operações com Supabase.
- `netlify.toml`: configuração de publicação e URLs.
- `supabase/functions/admin-lojas/index.ts`: código-fonte da função de administração já implantada.
- `supabase/migrations/...sql`: migração de armazenamento e permissões já aplicada neste projeto.

Antes de abrir a operação comercial, teste login administrativo, criação de empresa, acesso com login da loja, upload de imagem e pedido real de ponta a ponta com um aparelho de cliente e outro de gestor.
