# Mapa de funcionalidades — Catálogo Filinto

Cada ação que se repete tem um nome oficial, um componente único e regras fixas. Antes de mexer numa ação, altere o componente único; atualize este mapa quando algo entrar ou mudar de lugar.

## Carrinho e pedidos (Fase 1)

### Adicionar ao carrinho
- **Telas:** catálogo público (card de cada produto, `ProductCard`).
- **Componente único:** `components/AddToCartButton.tsx` (estado em `lib/useCart.ts`, regras em `lib/pedidos-store.ts`).
- **Regras fixas:**
  - Quantidade 0: botão "Adicionar". Quantidade >= 1: seletor com "−", quantidade e "+".
  - Rótulos de acessibilidade: "Diminuir quantidade de {nome}" / "Aumentar quantidade de {nome}".
  - Máximo 99 por produto ("+" desabilitado no limite). Chegar a 0 remove o item.
  - Produto sob consulta (preço 0) pode ser adicionado normalmente.

### Ver/editar carrinho
- **Telas:** gaveta do carrinho (etapa 1), aberta pela barra "Ver carrinho" (`CartBar`) no catálogo.
- **Componente único:** `components/CartDrawer.tsx` (etapa 1); a barra é `components/CartBar.tsx`.
- **Regras fixas:**
  - Barra: "Ver carrinho ({quantidade} · {total})"; mostra "Sob consulta" no lugar do total quando todos os itens têm preço 0. Some com carrinho vazio ou gaveta aberta.
  - Gaveta: título "Seu carrinho"; cada item com nome, subtotal e o mesmo seletor "−" / "+" (máx. 99); linha "Total"; botão "Finalizar pedido".
  - Total soma só itens com preço; se tudo é sob consulta, mostra "Sob consulta".
  - Carrinho esvaziado na etapa 1 fecha a gaveta. Esc ou clique fora fecha.

### Finalizar pedido
- **Telas:** gaveta do carrinho (etapa 2, título "Seus dados").
- **Componente único:** `components/CartDrawer.tsx`; validação em `validarCliente` (`lib/pedidos-store.ts`); criação via `usePedidos().criar`.
- **Regras fixas:**
  - Campos, nesta ordem: "Nome", "Telefone", "Observação (opcional)".
  - Nome obrigatório: erro inline "Informe seu nome".
  - Telefone: só dígitos contam, 10 ou 11 (com DDD): erro inline "Informe um telefone com DDD".
  - Botões: "Enviar pedido" (vira "Enviando..." e fica desabilitado) e "Voltar" (volta à etapa 1).
  - Falha ao salvar: "Não foi possível enviar o pedido. Tente novamente."
  - Ao enviar: pedido criado com status "Novo", carrinho limpo, vai para a etapa 3.
  - Numeração dos pedidos começa em 1001 e segue o maior id + 1.

### Acompanhar pelo WhatsApp
- **Telas:** gaveta do carrinho (etapa 3, confirmação).
- **Componente único:** `components/CartDrawer.tsx`; mensagem em `buildPedidoMessage` (`lib/whatsapp.ts`).
- **Regras fixas:**
  - Título "Pedido #{id} enviado"; texto "Recebemos seu pedido. Acompanhe pelo WhatsApp."
  - Link "Acompanhar pelo WhatsApp" abre o WhatsApp da loja (nova aba) com mensagem curta contendo só o número do pedido.
  - Botão "Fechar". A confirmação sobrevive ao carrinho ter sido esvaziado.

### Mudar status / cancelar pedido
- **Telas:** `/admin`, aba "Pedidos".
- **Componente único:** `components/AdminPedidos.tsx` (lista e ações), `AdminPanel.tsx` (abas "Catálogo" / "Pedidos"); regras em `atualizarStatus` (`lib/pedidos-store.ts`).
- **Regras fixas:**
  - Lista vazia: "Nenhum pedido ainda. Os pedidos feitos neste navegador aparecem aqui."
  - Cada pedido mostra: "Pedido #{id}", data/hora (pt-BR), nome · telefone, itens ("{qtd}× {nome}"), "Obs.: ..." se houver, "Total: ..." ("Sob consulta" quando total 0).
  - Status possíveis: Novo, Em preparo, Pronto, Entregue, Cancelado (seletor por pedido).
  - Botão "Cancelar pedido" só aparece se o status não é Cancelado nem Entregue; pede confirmação "Cancelar o pedido #{id}?".

## Ações do catálogo existentes (conferidas no código)

### Exportar PDF
- **Tela:** `/admin` (`AdminPanel.tsx`). Botão "Exportar PDF" (vira "Gerando..."); erro: "Não foi possível gerar o PDF. Tente novamente."

## Limitações conhecidas
- Carrinho e pedidos ficam só no `localStorage` do navegador em que foram feitos. O admin só vê pedidos criados no mesmo navegador/aparelho; não há sincronização entre aparelhos nem servidor.
- Limpar dados do navegador apaga os pedidos.
- Notificação do pedido depende do cliente tocar em "Acompanhar pelo WhatsApp"; o pedido em si não chega à loja automaticamente.
- Pedido guarda nome e preço do produto no momento da compra (não acompanha edições posteriores do catálogo).
