# Catálogo Filinto — banco de dados (Supabase)

## Intenção
Hoje o catálogo e as edições do `/admin` ficam no `localStorage` de cada navegador. Uma edição do cliente só aparece para ele. O catálogo passa a morar no Supabase, para que o que o cliente salvar valha para todos que abrirem o site.

O visual do site é o forte do projeto. O cliente deve conseguir manter o catálogo em dia sem conseguir mudar o aspecto visual.

## Objetivos
- Site público lê categorias e produtos do banco.
- O cliente, pelo `/admin`, consegue: marcar produto como disponível/indisponível, editar o nome do produto e ocultar/mostrar categorias. O cliente não troca fotos.
- Mudanças valem para todos ao recarregar a página.
- Senha única do admin continua (`ADMIN_PASSWORD`).

## Fora de escopo (Fase 1)
- Login por e-mail ou vários usuários.
- Edição em tempo real (ver a mudança sem recarregar).
- Pedidos e carrinho.
- Cliente criar ou excluir produtos e categorias.
- Cliente reordenar categorias ou produtos, ou renomear categorias. *(Decisão minha: mexem no layout. Fica só com o Lucca, direto no banco.)*

## Anti-objetivos
- O cliente conseguir alterar o aspecto do site (adicionar produto, trocar foto sem controle, bagunçar a ordem).
- Qualquer pessoa sem a senha conseguir gravar no banco.

## Decisões do Lucca
- Supabase como banco.
- Senha única compartilhada, sem login por e-mail.
- Cliente só marca produto disponível/indisponível; não cria nem apaga produtos.
- Cliente pode ocultar categorias, não excluí-las. A exclusão fica com o Lucca.

## Decisões minhas (a conferir)
- **Escrita só pelo servidor:** o admin envia a senha, o servidor confere e só então grava usando a `SUPABASE_SERVICE_ROLE_KEY`. A chave `anon` só lê. O RLS fica ligado nas tabelas, com leitura pública e sem escrita pública.
- **Tabelas:** `categorias` (id, nome, ordem, oculta) e `produtos` (id, categoria_id, nome, imagem_url, esgotado, ordem). Os ids atuais do código são mantidos.
- **Carga inicial:** o catálogo hoje em `lib/catalogo-store.ts` vira o seed do banco, com as fotos que já estão em `public/produtos`.
- **Categoria oculta:** some do site público e do PDF; no admin continua visível, marcada como oculta.
- **PDF:** continua gerado no navegador, a partir dos dados do banco.
- **Variáveis:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (nunca exposta ao navegador), repetidas na Vercel.
- **Aposentar o `localStorage`:** `useCatalogStore` deixa de ler e gravar nele.

## Decidido: foto
O cliente não troca fotos. As fotos ficam só com o Lucca, em `public/produtos`, e o Storage do Supabase não entra na Fase 1.

## Fica para quem constrói
- Forma exata do cliente de dados (server actions, rotas ou leitura no servidor).
- Estratégia de cache e revalidação da página pública.
- Tratamento de erro quando o banco não responde (mostrar a última versão ou uma mensagem).
- Atualizar `AdminCategoriaCard`, `AdminPanel` e `AdminProdutoModal` para o conjunto reduzido de ações.

## Observação
O `docs/mapa-funcionalidades.md` do workflow não existe neste projeto. Não bloqueia esta fase, mas as ações do admin (marcar disponível, editar nome, ocultar categoria) devem entrar nele quando for criado.
