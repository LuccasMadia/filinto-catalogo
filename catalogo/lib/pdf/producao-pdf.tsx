import { Document, Page, View, Text, StyleSheet, pdf } from "@react-pdf/renderer";
import type { LinhaProducao } from "@/lib/pedidos-store";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: "Helvetica" },
  titulo: { fontSize: 20, fontWeight: "bold", color: "#AC1214" },
  subtitulo: { fontSize: 10, color: "#666666", marginTop: 4, marginBottom: 20 },
  linha: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    paddingVertical: 8,
  },
  quantidade: { width: 60, fontSize: 18, fontWeight: "bold", color: "#AC1214" },
  nome: { flex: 1, fontSize: 13, color: "#1A1A1A" },
  pedidos: { fontSize: 9, color: "#666666" },
});

export function ProducaoPdf({ linhas, geradoEm }: { linhas: LinhaProducao[]; geradoEm: Date }) {
  const totalUnidades = linhas.reduce((soma, l) => soma + l.quantidade, 0);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.titulo}>Lista de produção — Filinto Sorvetes</Text>
        <Text style={styles.subtitulo}>
          {geradoEm.toLocaleString("pt-BR")} · {totalUnidades} unidade(s) · pedidos novos e em preparo
        </Text>
        {linhas.map((l) => (
          <View key={l.produtoId} style={styles.linha} wrap={false}>
            <Text style={styles.quantidade}>{l.quantidade}×</Text>
            <Text style={styles.nome}>{l.nome}</Text>
            <Text style={styles.pedidos}>{l.pedidos} pedido(s)</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}

export async function buildProducaoPdfBlob(linhas: LinhaProducao[]): Promise<Blob> {
  return pdf(<ProducaoPdf linhas={linhas} geradoEm={new Date()} />).toBlob();
}
