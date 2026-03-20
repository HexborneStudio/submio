import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { AuthorshipReceipt, ReceiptSection, Document as PrismaDocument } from "@authorship-receipt/db";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 20,
    borderBottom: "1 solid #e5e7eb",
    paddingBottom: 15,
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    color: "#6b7280",
  },
  confidenceBadge: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: "flex-start",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  summaryBox: {
    backgroundColor: "#eff6ff",
    border: "1 solid #bfdbfe",
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1e40af",
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 9,
    color: "#1e3a8a",
    lineHeight: 1.4,
  },
  section: {
    marginBottom: 14,
    border: "1 solid #e5e7eb",
    borderRadius: 4,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    color: "#111827",
  },
  sectionSummary: {
    fontSize: 9,
    color: "#4b5563",
    marginBottom: 8,
    lineHeight: 1.4,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    borderBottom: "0.5 solid #f3f4f6",
  },
  itemLabel: {
    fontSize: 9,
    color: "#6b7280",
  },
  itemValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  warningBox: {
    backgroundColor: "#fef3c7",
    border: "1 solid #fde68a",
    borderRadius: 4,
    padding: 8,
    marginTop: 8,
  },
  warningText: {
    fontSize: 8,
    color: "#92400e",
  },
  noteText: {
    fontSize: 8,
    color: "#9ca3af",
    fontStyle: "italic",
    marginTop: 4,
  },
  cautionBox: {
    backgroundColor: "#fef9c3",
    border: "1 solid #fde047",
    borderRadius: 4,
    padding: 10,
    marginTop: 16,
    marginBottom: 16,
  },
  cautionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#854d0e",
    marginBottom: 4,
  },
  cautionText: {
    fontSize: 8,
    color: "#713f12",
    lineHeight: 1.4,
  },
  disclaimerBox: {
    marginTop: 20,
    paddingTop: 12,
    borderTop: "0.5 solid #d1d5db",
  },
  disclaimerText: {
    fontSize: 7,
    color: "#6b7280",
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 7,
    color: "#9ca3af",
    textAlign: "center",
  },
  metaText: {
    fontSize: 7,
    color: "#9ca3af",
    marginTop: 4,
  },
});

const confidenceColors: Record<string, { bg: string; text: string }> = {
  low: { bg: "#fee2e2", text: "#991b1b" },
  medium: { bg: "#fef3c7", text: "#92400e" },
  high: { bg: "#dcfce7", text: "#166534" },
};

export interface PdfReceiptData {
  receipt: AuthorshipReceipt & {
    receiptSections: ReceiptSection[];
    document: PrismaDocument;
  };
  exportedAt: string;
}

export function PdfReceiptDocument({ receipt, exportedAt }: PdfReceiptData) {
  const receiptData = receipt.receiptData as {
    summary: {
      overallConfidence: string;
      summaryText: string;
      processingWarnings: string[];
    };
    disclaimer: string;
  };

  const confidence = receiptData?.summary?.overallConfidence || "low";
  const colors = confidenceColors[confidence] || confidenceColors.low;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Authorship Receipt</Text>
          <Text style={styles.subtitle}>{receipt.document.title}</Text>
          <View
            style={[
              styles.confidenceBadge,
              { backgroundColor: colors.bg },
            ]}
          >
            <Text style={{ color: colors.text, fontSize: 8 }}>
              {confidence.toUpperCase()} CONFIDENCE
            </Text>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <Text style={styles.summaryText}>
            {receiptData?.summary?.summaryText || "Analysis completed."}
          </Text>
          {receiptData?.summary?.processingWarnings?.length > 0 && (
            <Text style={{ ...styles.warningText, marginTop: 6 }}>
              ⚠ {receiptData.summary.processingWarnings.join(" ")}
            </Text>
          )}
        </View>

        {/* Caution */}
        <View style={styles.cautionBox}>
          <Text style={styles.cautionTitle}>⚠ Important Caution</Text>
          <Text style={styles.cautionText}>
            This receipt provides EVIDENCE-BASED INDICATORS only. It does NOT constitute
            a definitive judgment on authorship, originality, or academic integrity.
            All findings should be reviewed in appropriate academic context.
          </Text>
        </View>

        {/* Sections */}
        {receipt.receiptSections.map((section) => {
          const data = section.content as {
            key: string;
            title: string;
            summary: string;
            items: Array<{ label: string; value: string | number | boolean }>;
            warnings: string[];
            notes: string[];
          };

          return (
            <View key={section.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{data.title}</Text>

              {data.key !== "confidence" && (
                <Text style={styles.sectionSummary}>{data.summary}</Text>
              )}

              {data.items.map((item, i) => (
                <View key={i} style={styles.itemRow}>
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  <Text style={styles.itemValue}>
                    {typeof item.value === "boolean"
                      ? item.value ? "Yes" : "No"
                      : String(item.value)}
                  </Text>
                </View>
              ))}

              {data.warnings.map((w, i) => (
                <View key={i} style={styles.warningBox}>
                  <Text style={styles.warningText}>⚠ {w}</Text>
                </View>
              ))}

              {data.notes.length > 0 && data.key !== "confidence" && (
                <View>
                  {data.notes.map((n, i) => (
                    <Text key={i} style={styles.noteText}>{n}</Text>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {/* Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            {receiptData?.disclaimer}
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Receipt ID: {receipt.id} · Exported: {exportedAt}
        </Text>
        <Text style={styles.metaText}>
          Generated: {new Date(receipt.createdAt).toLocaleString()} · Version: {receipt.versionId}
        </Text>
      </Page>
    </Document>
  );
}
