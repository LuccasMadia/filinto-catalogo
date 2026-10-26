import { Document, Page, View, Text, Image, Link, Svg, Path, Circle, Font, StyleSheet, pdf } from "@react-pdf/renderer";
import type { Categoria, Produto } from "@/lib/catalogo-store";

Font.register({
  family: "Dancing Script",
  src: "https://fonts.gstatic.com/s/dancingscript/v29/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7B1i0HTQ.ttf",
});

Font.register({
  family: "Lilita One",
  src: "https://fonts.gstatic.com/s/lilitaone/v17/i7dPIFZ9Zz-WBtRtedDbYEF8QA.ttf",
});

// Sem hifenização automática: ela quebrava nomes como "Tr-ufado".
Font.registerHyphenationCallback((palavra) => [palavra]);

// Mesmo número usado antes nos botões do site (55 67 8131-6194).
const WHATSAPP = { link: "https://wa.me/556781316194", texto: "(67) 8131-6194" };

const VERMELHO = "#AC1214";
const CREME = "#FFF8F0";

// A4 = 595pt. Conteúdo: 595 - 2*36 = 523 -> 3 colunas de 163 com 17 de vão.
const COLUNA = 163;
const VAO = 17;
const FOTO = 150;

const styles = StyleSheet.create({
  // Tudo no topo: o WhatsApp mostra só a faixa de cima da 1ª página como prévia do arquivo.
  capa: { backgroundColor: VERMELHO, color: "#FFFFFF" },
  capaLogo: { position: "absolute", left: 237.5, top: 24, width: 120, height: 101 },
  capaTexto: { position: "absolute", left: 0, right: 0, top: 124, alignItems: "center" },
  capaTitulo: { fontFamily: "Dancing Script", fontSize: 40 },
  capaCirculo: { position: "absolute", left: 82.5, top: 237, width: 430, height: 430 },
  capaPote: { position: "absolute", left: 107, top: 290, width: 380, height: 325 },
  capaWhats: {
    position: "absolute",
    left: 117.5,
    top: 676,
    width: 360,
    height: 70,
    borderRadius: 35,
    textDecoration: "none",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  capaWhatsTitulo: { fontFamily: "Helvetica-Bold", fontSize: 18, color: VERMELHO, textDecoration: "none" },
  capaWhatsNumero: { textDecoration: "none", fontFamily: "Helvetica-Bold", fontSize: 18, color: VERMELHO },
  capaData: { fontSize: 11, marginTop: 6, letterSpacing: 2, textTransform: "uppercase" },
  page: { backgroundColor: CREME, paddingTop: 40, paddingBottom: 56, paddingHorizontal: 36, justifyContent: "center" },
  fundo: { position: "absolute", top: 0, left: 0, width: 595, height: 842 },
  // absoluto: não entra no fluxo, então a grade se centraliza sozinha na folha
  titulo: {
    position: "absolute",
    top: 28,
    left: 0,
    right: 0,
    textAlign: "center",
    fontFamily: "Dancing Script",
    fontSize: 48,
    color: VERMELHO,
  },
  linha: { flexDirection: "row", paddingTop: 10 },
  card: { width: COLUNA, marginRight: VAO },
  // 3ª coluna sem vão à direita, para a linha fechar na margem.
  cardUltimo: { marginRight: 0 },
  cardImagem: { width: COLUNA, height: FOTO, marginBottom: 6, alignItems: "center", justifyContent: "center" },
  cardFoto: { width: "100%", height: "100%", objectFit: "contain" },
  faixa: {
    position: "absolute",
    top: FOTO / 2 - 11,
    left: 0,
    right: 0,
    backgroundColor: "#000000",
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 2,
    textAlign: "center",
    paddingVertical: 5,
  },
  cardNome: { fontFamily: "Lilita One", fontSize: 16, letterSpacing: 0.4, lineHeight: 1.25, textAlign: "center", color: "#FFFFFF" },
  cardNomeContorno: { position: "absolute", left: 0, right: 0, top: 0, color: "#000000" },
  rodape: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    color: "#8A6F62",
  },
});

// Fundo: public/fundos/1.jpg nas páginas ímpares e 2.jpg nas pares (número impresso no rodapé).
function Fundo() {
  return (
    <View
      fixed
      style={styles.fundo}
      render={({ pageNumber }) => (
        <Image src={absoluta(`/fundos/${pageNumber % 2 === 0 ? 1 : 2}.jpg`)} style={styles.fundo} />
      )}
    />
  );
}

function PlaceholderIcone() {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: 28, height: 28 }}>
      <Path
        d="M8 10a4 4 0 1 1 8 0c1.5 0 2.5 1 2.5 2.3 0 1.2-.9 2.2-2.1 2.3L12 21l-4.4-6.4C6.4 14.5 5.5 13.5 5.5 12.3 5.5 11 6.5 10 8 10Z"
        stroke="#A3A3A3"
        strokeWidth={1.5}
        fill="none"
      />
    </Svg>
  );
}

export type CatalogoPdfProps = {
  categorias: Categoria[];
  produtos: Produto[];
};

// react-pdf busca imagens por fora do app: precisa de URL absoluta.
const absoluta = (src: string) => new URL(src, window.location.origin).href;

// react-pdf não tem contorno de texto: 16 cópias pretas deslocadas em círculo atrás do texto branco.
const CONTORNO = 1.8;
const DESLOCAMENTOS = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * 2 * Math.PI;
  return { left: Math.cos(a) * CONTORNO, right: -Math.cos(a) * CONTORNO, top: Math.sin(a) * CONTORNO };
});

function NomeProduto({ nome }: { nome: string }) {
  return (
    <View style={{ width: COLUNA, marginTop: 2 }}>
      {DESLOCAMENTOS.map((d, i) => (
        <Text key={i} style={[styles.cardNome, styles.cardNomeContorno, d]}>
          {nome}
        </Text>
      ))}
      <Text style={styles.cardNome}>{nome}</Text>
    </View>
  );
}

function card(produto: Produto, index: number) {
  return (
    <View
      key={produto.id}
      style={index % 3 === 2 ? [styles.card, styles.cardUltimo] : styles.card}
      wrap={false}
    >
      <View style={styles.cardImagem}>
        {produto.imagem ? (
          <Image src={absoluta(produto.imagem)} style={styles.cardFoto} />
        ) : (
          <PlaceholderIcone />
        )}
        {produto.esgotado ? <Text style={styles.faixa}>ESGOTADO</Text> : null}
      </View>
      <NomeProduto nome={produto.nome} />
    </View>
  );
}

export function CatalogoPdf({ categorias, produtos }: CatalogoPdfProps) {
  const data = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <Document title="Catálogo Filinto Sorvetes">
      <Page size="A4" style={styles.capa}>
        <Image src={absoluta("/logo-filinto-capa.png")} style={styles.capaLogo} />
        <View style={styles.capaTexto}>
          <Text style={styles.capaTitulo}>Catálogo de produtos</Text>
          <Text style={styles.capaData}>{data}</Text>
        </View>
        <Svg viewBox="0 0 430 430" style={styles.capaCirculo}>
          <Circle cx={215} cy={215} r={215} fill="#C42224" />
        </Svg>
        <Image src={absoluta("/produtos/pote.png")} style={styles.capaPote} />
        <Link src={WHATSAPP.link} style={styles.capaWhats}>
          <Text style={styles.capaWhatsTitulo}>Peça pelo WhatsApp</Text>
          <Text style={styles.capaWhatsNumero}>{WHATSAPP.texto}</Text>
        </Link>
      </Page>
      {/* Uma página (ou mais) por categoria; o título aparece só na 1ª. */}
      {categorias.map((categoria) => {
        const produtosDaCategoria = produtos.filter((p) => p.categoriaId === categoria.id);
        if (produtosDaCategoria.length === 0) return null;
        const linhas = Array.from({ length: Math.ceil(produtosDaCategoria.length / 3) }, (_, i) =>
          produtosDaCategoria.slice(i * 3, i * 3 + 3)
        );
        return (
          <Page key={categoria.id} size="A4" style={styles.page}>
            <Fundo />
            <Text style={styles.titulo}>{categoria.nome}</Text>
            {linhas.map((linha) => (
              <View key={linha[0].id} style={styles.linha} wrap={false}>
                {linha.map((p, i) => card(p, i))}
              </View>
            ))}
            <View style={styles.rodape} fixed>
              <Text>Filinto Sorvetes</Text>
              <Text render={({ pageNumber }) => `${pageNumber - 1}`} />
            </View>
          </Page>
        );
      })}
    </Document>
  );
}

export async function buildCatalogoPdfBlob(dados: CatalogoPdfProps): Promise<Blob> {
  return pdf(<CatalogoPdf {...dados} />).toBlob();
}
