import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface InvoicePDFProps {
  invoice: {
    invoiceNumber: string;
    date: string;
    clientName: string;
    clientEmail?: string;
    clientPhone?: string;
    clientAddress?: string;
    itemDescription: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
  };
  business: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    vatNumber?: string;
    bankName?: string;
    accountNumber?: string;
    branchCode?: string;
    paymentTerms?: string;
  };
}

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
  },
  businessInfo: {
    marginBottom: 20,
  },
  businessName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 10,
    marginBottom: 3,
    color: '#4b5563',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  column: {
    width: '48%',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 8,
    fontWeight: 'bold',
    borderBottom: '2 solid #d1d5db',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1 solid #e5e7eb',
  },
  tableCol1: {
    width: '50%',
  },
  tableCol2: {
    width: '15%',
    textAlign: 'right',
  },
  tableCol3: {
    width: '20%',
    textAlign: 'right',
  },
  tableCol4: {
    width: '15%',
    textAlign: 'right',
  },
  totals: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
    width: '40%',
  },
  totalLabel: {
    width: '60%',
    textAlign: 'right',
    paddingRight: 10,
  },
  totalValue: {
    width: '40%',
    textAlign: 'right',
  },
  grandTotal: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTop: '1 solid #e5e7eb',
  },
  footerTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

const InvoicePDF = ({ invoice, business }: InvoicePDFProps) => {
  const formatCurrency = (amount: number) => {
    return `R ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const calculateVAT = (amount: number) => {
    return business.vatNumber ? amount * 0.15 : 0;
  };

  const subtotal = invoice.totalAmount;
  const vat = calculateVAT(subtotal);
  const grandTotal = subtotal + vat;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>TAX INVOICE</Text>
        </View>

        {/* Business and Client Info */}
        <View style={styles.row}>
          {/* Business Info */}
          <View style={styles.column}>
            <View style={styles.businessInfo}>
              <Text style={styles.businessName}>{business.name}</Text>
              {business.address && <Text style={styles.text}>{business.address}</Text>}
              {business.phone && <Text style={styles.text}>Tel: {business.phone}</Text>}
              {business.email && <Text style={styles.text}>Email: {business.email}</Text>}
              {business.vatNumber && <Text style={styles.text}>VAT No: {business.vatNumber}</Text>}
            </View>
          </View>

          {/* Invoice Details */}
          <View style={styles.column}>
            <Text style={styles.text}>Invoice No: {invoice.invoiceNumber}</Text>
            <Text style={styles.text}>Date: {invoice.date}</Text>
          </View>
        </View>

        {/* Bill To */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>BILL TO:</Text>
          <Text style={styles.businessName}>{invoice.clientName}</Text>
          {invoice.clientAddress && <Text style={styles.text}>{invoice.clientAddress}</Text>}
          {invoice.clientPhone && <Text style={styles.text}>Tel: {invoice.clientPhone}</Text>}
          {invoice.clientEmail && <Text style={styles.text}>Email: {invoice.clientEmail}</Text>}
        </View>

        {/* Line Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableCol1}>Description</Text>
            <Text style={styles.tableCol2}>Qty</Text>
            <Text style={styles.tableCol3}>Unit Price</Text>
            <Text style={styles.tableCol4}>Total</Text>
          </View>

          {/* Table Row */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCol1}>{invoice.itemDescription}</Text>
            <Text style={styles.tableCol2}>{invoice.quantity}</Text>
            <Text style={styles.tableCol3}>{formatCurrency(invoice.unitPrice)}</Text>
            <Text style={styles.tableCol4}>{formatCurrency(invoice.totalAmount)}</Text>
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
          </View>

          {business.vatNumber && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>VAT (15%):</Text>
              <Text style={styles.totalValue}>{formatCurrency(vat)}</Text>
            </View>
          )}

          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{formatCurrency(grandTotal)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {business.paymentTerms && (
            <View style={{ marginBottom: 15 }}>
              <Text style={styles.footerTitle}>Payment Terms:</Text>
              <Text style={styles.text}>{business.paymentTerms}</Text>
            </View>
          )}

          {business.bankName && (
            <View>
              <Text style={styles.footerTitle}>Banking Details:</Text>
              <Text style={styles.text}>Bank: {business.bankName}</Text>
              {business.accountNumber && (
                <Text style={styles.text}>Account: {business.accountNumber}</Text>
              )}
              {business.branchCode && <Text style={styles.text}>Branch: {business.branchCode}</Text>}
            </View>
          )}
        </View>

        {/* Page Number */}
        <Text
          style={{
            position: 'absolute',
            bottom: 20,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: 8,
            color: '#9ca3af',
          }}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
};

export default InvoicePDF;
