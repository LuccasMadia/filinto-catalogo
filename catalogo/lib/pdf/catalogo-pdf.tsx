import { Document, Page, View, Text, Svg, Path, Font, StyleSheet, pdf } from "@react-pdf/renderer";
import type { Categoria, Produto } from "@/lib/catalogo-store";
import { formatPrice } from "@/lib/format";

Font.register({
  family: "Dancing Script",
  src: "https://fonts.gstatic.com/s/dancingscript/v29/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7B1i0HTQ.ttf",
});

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 11, fontFamily: "Helvetica" },
  header: {
    backgroundColor: "#AC1214",
    padding: 16,
    marginBottom: 20,
    borderRadius: 8,
  },
  headerTitle: {
    fontFamily: "Dancing Script",
    fontSize: 32,
    color: "#FFFFFF",
    textAlign: "center",
  },
  categoria: { marginBottom: 16 },
  categoriaTitulo: {
    fontFamily: "Dancing Script",
    fontSize: 20,
    color: "#AC1214",
    marginBottom: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: 160,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  cardImagem: {
    height: 90,
    backgroundColor: "#E5E5E5",
    borderRadius: 6,
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  cardNome: { fontSize: 10, fontWeight: "bold", color: "#1A1A1A", marginBottom: 2 },
  cardDescricao: { fontSize: 8, color: "#666666", marginBottom: 2 },
  cardPreco: { fontSize: 11, fontWeight: "bold", color: "#AC1214" },
});

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

export function CatalogoPdf({ categorias, produtos }: CatalogoPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filinto Sorvetes</Text>
        </View>
        {categorias.map((categoria) => {
          const produtosDaCategoria = produtos.filter((p) => p.categoriaId === categoria.id);
          if (produtosDaCategoria.length === 0) return null;
          return (
            <View key={categoria.id} style={styles.categoria}>
              <Text style={styles.categoriaTitulo}>{categoria.nome}</Text>
              <View style={styles.grid}>
                {produtosDaCategoria.map((produto) => (
                  <View key={produto.id} style={styles.card} wrap={false}>
                    <View style={styles.cardImagem}>
                      <PlaceholderIcone />
                    </View>
                    <Text style={styles.cardNome}>{produto.nome}</Text>
                    {produto.descricao ? (
                      <Text style={styles.cardDescricao}>{produto.descricao}</Text>
                    ) : null}
                    <Text style={styles.cardPreco}>{formatPrice(produto.preco)}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </Page>
    </Document>
  );
}

export async function buildCatalogoPdfBlob(dados: CatalogoPdfProps): Promise<Blob> {
  return pdf(<CatalogoPdf {...dados} />).toBlob();
}
