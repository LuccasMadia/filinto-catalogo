import { Document, Page, View, Text, Font, StyleSheet, pdf } from "@react-pdf/renderer";
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
  produtoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  produtoNome: { flex: 1 },
  produtoDescricao: { fontSize: 9, color: "#666666" },
  produtoPreco: { fontWeight: "bold", color: "#AC1214" },
});

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
              {produtosDaCategoria.map((produto) => (
                <View key={produto.id} style={styles.produtoRow}>
                  <View style={styles.produtoNome}>
                    <Text>{produto.nome}</Text>
                    {produto.descricao ? (
                      <Text style={styles.produtoDescricao}>{produto.descricao}</Text>
                    ) : null}
                  </View>
                  <Text style={styles.produtoPreco}>{formatPrice(produto.preco)}</Text>
                </View>
              ))}
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
