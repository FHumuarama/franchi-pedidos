# Franchi Pedidos — Demonstração pública

**Franchi Creative — Protótipo 1.0**

Este repositório contém **uma demonstração interativa**, NÃO é um sistema comercial de gestão de pedidos. O arquivo `index.html` tem HTML, CSS, JavaScript e logo incorporados e é suficiente para publicar a interface. Não exige Supabase ou compilação.

## Áreas para testar

- Visão geral da plataforma
- Administrador geral: empresas fictícias e planos
- Painel de empresa: pedidos demonstrativos, status e produtos
- Catálogo: pedidos sem cadastro (simulados neste navegador)
- Assinaturas: planos e trocas fictícias

**Aviso:** não há login real, backend, banco de dados compartilhado, cobrança ou notificações automáticas pelo WhatsApp. A funcionalidade de pedidos é local ao navegador. NÃO usar com clientes reais nem inserir dados pessoais verdadeiros.

## Publicar com GitHub e Netlify pelo celular

1. No GitHub, entre em `FHumuarama/franchi-pedidos` e envie os arquivos desta pasta para a **raiz do repositório na branch `main`**. Em `Add file > Upload files`, selecione `index.html`, `netlify.toml`, `robots.txt` e `README.md` (o `.gitignore` é opcional se o navegador ocultar arquivos com ponto).
2. Entre no projeto **franchi-pedidos** já existente no Netlify.
3. Acesse **Project configuration > Developer settings > Continuous deployment > Repository** e toque em **Link repository**, se ainda não estiver vinculado.
4. Selecione o GitHub e o repositório `FHumuarama/franchi-pedidos`, branch **main**.
5. Configure o campo **Build command** como vazio, **Publish directory** como `.` (raiz), e conclua a conexão.
6. Confira o deploy na aba **Deploys**. Quando estiver como **Published/Ready**, abra `https://franchi-pedidos.netlify.app`.
7. Daí em diante, alterações salvas (commits) na branch `main` acionam publicações automáticas no Netlify, quando o vínculo Git estiver ativo.

Se aparecer opção **Manage repository**, o site pode já estar vinculado a um repositório. Confirme qual está ligado, evitando troca involuntária.

## Abrir localmente

Basta abrir `index.html` pelo navegador; se o Android não executar JavaScript em arquivos locais, publique pelo Netlify para testar via HTTPS.

## Organização dos arquivos

- `index.html`: demo interativa completa (CSS, JS e logo embutidos)
- `netlify.toml`: publicação estática e cabeçalhos de segurança
- `robots.txt`: não indexar esta demonstração nos mecanismos de busca
- `README.md`: estas instruções
- `.gitignore`: impede enviar credenciais e pasta local do Netlify

A configuração de não indexação apenas pede aos mecanismos de busca que não indexem o site; **não restringe acesso público**. Se precisar manter esta demo privada, configure controle de acesso no Netlify.
