import path from "node:path";
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

const FONT_DIR = path.join(process.cwd(), "public", "fonts");

Font.register({
  family: "DM Sans",
  fonts: [
    { src: path.join(FONT_DIR, "DMSans-Regular.ttf"), fontWeight: 400 },
    { src: path.join(FONT_DIR, "DMSans-Medium.ttf"), fontWeight: 500 },
    { src: path.join(FONT_DIR, "DMSans-Bold.ttf"), fontWeight: 700 },
  ],
});

Font.register({
  family: "Instrument Serif",
  src: path.join(FONT_DIR, "InstrumentSerif-Regular.ttf"),
});

const COLORS = {
  bg: "#FFFFFF",
  text: "#211D17",
  textMid: "#5A554C",
  textSoft: "#8B857B",
  border: "#E5E1D8",
  borderSoft: "#EFECE5",
} as const;

const styles = StyleSheet.create({
  page: {
    paddingTop: 56,
    paddingBottom: 48,
    paddingHorizontal: 56,
    fontFamily: "DM Sans",
    fontSize: 10,
    color: COLORS.text,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 0.75,
    borderBottomColor: COLORS.border,
    paddingBottom: 22,
  },
  title: {
    fontFamily: "Instrument Serif",
    fontSize: 32,
    color: COLORS.text,
    letterSpacing: -0.4,
  },
  titleSub: {
    marginTop: 6,
    fontSize: 9.5,
    color: COLORS.textSoft,
  },
  amount: {
    fontFamily: "Instrument Serif",
    fontSize: 32,
    color: COLORS.text,
    letterSpacing: -0.4,
    textAlign: "right",
  },
  amountSub: {
    marginTop: 6,
    fontSize: 8,
    color: COLORS.textSoft,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontWeight: 700,
    textAlign: "right",
  },
  partiesRow: {
    flexDirection: "row",
    gap: 32,
    paddingVertical: 20,
    borderBottomWidth: 0.75,
    borderBottomColor: COLORS.border,
  },
  partyColumn: {
    flex: 1,
  },
  partyLabel: {
    fontSize: 8,
    color: COLORS.textSoft,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontWeight: 700,
  },
  partyName: {
    marginTop: 6,
    fontSize: 10.5,
    fontWeight: 500,
    color: COLORS.text,
  },
  partyMeta: {
    marginTop: 2,
    fontSize: 9.5,
    color: COLORS.textMid,
  },
  datesRow: {
    flexDirection: "row",
    gap: 32,
    paddingVertical: 16,
    borderBottomWidth: 0.75,
    borderBottomColor: COLORS.border,
  },
  dateCell: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 8,
    color: COLORS.textSoft,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontWeight: 700,
  },
  dateValue: {
    marginTop: 6,
    fontSize: 10.5,
    fontWeight: 500,
    color: COLORS.text,
  },
  itemsHeader: {
    flexDirection: "row",
    paddingTop: 22,
    paddingBottom: 10,
  },
  itemsHeaderCell: {
    fontSize: 8,
    color: COLORS.textSoft,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontWeight: 700,
  },
  itemRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.borderSoft,
  },
  itemTitle: {
    fontSize: 10.5,
    fontWeight: 500,
    color: COLORS.text,
  },
  itemDescription: {
    marginTop: 3,
    fontSize: 9,
    color: COLORS.textSoft,
    lineHeight: 1.45,
  },
  itemColMain: {
    flex: 1,
    paddingRight: 16,
  },
  itemColAmount: {
    width: 90,
    textAlign: "right",
    fontSize: 10.5,
    fontWeight: 500,
    color: COLORS.text,
  },
  totalsBlock: {
    marginTop: 18,
    alignSelf: "flex-end",
    width: 220,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderSoft,
  },
  totalsLabel: {
    fontSize: 9.5,
    color: COLORS.textMid,
  },
  totalsValue: {
    fontSize: 9.5,
    fontWeight: 500,
    color: COLORS.text,
  },
  totalsGrandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: 14,
  },
  totalsGrandLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.text,
  },
  totalsGrandValue: {
    fontFamily: "Instrument Serif",
    fontSize: 22,
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 56,
    right: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: COLORS.textSoft,
  },
});

function fmtMoney(n: number) {
  return (
    "$" +
    n.toLocaleString("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })
  );
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export type InvoicePdfItem = {
  id: string;
  title: string;
  description: string | null;
  price: number;
};

export type InvoiceDocumentProps = {
  approvedItems: InvoicePdfItem[];
  clientEmail: string;
  clientName: string;
  dueDate: Date;
  freelancerEmail: string;
  freelancerName: string;
  invoiceNumber: string;
  issuedAt: Date;
  projectTitle: string;
  total: number;
};

export function InvoiceDocument({
  approvedItems,
  clientEmail,
  clientName,
  dueDate,
  freelancerEmail,
  freelancerName,
  invoiceNumber,
  issuedAt,
  projectTitle,
  total,
}: InvoiceDocumentProps) {
  return (
    <Document
      title={`Invoice ${invoiceNumber}`}
      author={freelancerName}
      subject={projectTitle}
      creator="Worklit"
      producer="Worklit"
    >
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Invoice</Text>
            <Text style={styles.titleSub}>{invoiceNumber}</Text>
          </View>
          <View>
            <Text style={styles.amount}>{fmtMoney(total)}</Text>
            <Text style={styles.amountSub}>Total due</Text>
          </View>
        </View>

        <View style={styles.partiesRow}>
          <View style={styles.partyColumn}>
            <Text style={styles.partyLabel}>From</Text>
            <Text style={styles.partyName}>{freelancerName}</Text>
            <Text style={styles.partyMeta}>{freelancerEmail}</Text>
          </View>
          <View style={styles.partyColumn}>
            <Text style={styles.partyLabel}>Bill to</Text>
            <Text style={styles.partyName}>{clientName}</Text>
            <Text style={styles.partyMeta}>{clientEmail}</Text>
          </View>
        </View>

        <View style={styles.datesRow}>
          <View style={styles.dateCell}>
            <Text style={styles.dateLabel}>Issued</Text>
            <Text style={styles.dateValue}>{fmtDate(issuedAt)}</Text>
          </View>
          <View style={styles.dateCell}>
            <Text style={styles.dateLabel}>Due</Text>
            <Text style={styles.dateValue}>{fmtDate(dueDate)}</Text>
          </View>
          <View style={styles.dateCell}>
            <Text style={styles.dateLabel}>Project</Text>
            <Text style={styles.dateValue}>{projectTitle}</Text>
          </View>
        </View>

        <View style={styles.itemsHeader}>
          <View style={styles.itemColMain}>
            <Text style={styles.itemsHeaderCell}>Approved scope</Text>
          </View>
          <View style={{ width: 90 }}>
            <Text style={[styles.itemsHeaderCell, { textAlign: "right" }]}>
              Amount
            </Text>
          </View>
        </View>

        {approvedItems.map((item) => (
          <View key={item.id} style={styles.itemRow} wrap={false}>
            <View style={styles.itemColMain}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              {item.description ? (
                <Text style={styles.itemDescription}>{item.description}</Text>
              ) : null}
            </View>
            <Text style={styles.itemColAmount}>{fmtMoney(item.price)}</Text>
          </View>
        ))}

        <View style={styles.totalsBlock}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal</Text>
            <Text style={styles.totalsValue}>{fmtMoney(total)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Tax</Text>
            <Text style={styles.totalsValue}>{fmtMoney(0)}</Text>
          </View>
          <View style={styles.totalsGrandRow}>
            <Text style={styles.totalsGrandLabel}>Total</Text>
            <Text style={styles.totalsGrandValue}>{fmtMoney(total)}</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>{invoiceNumber}</Text>
          <Text>Generated with Worklit</Text>
        </View>
      </Page>
    </Document>
  );
}
