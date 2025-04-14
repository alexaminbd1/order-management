"use client"

// components/Invoice.js
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer"

Font.register({
  family: "NotoSansBengali",
  fonts: [
    {
      src: "/fonts/NotoSansBengali-Regular.ttf",
    },
  ],
})

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSansBengali",
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    lineHeight: 1.5,
    flexDirection: "column",
  },
  logo: {
    width: 60,
    height: 60,
    marginLeft: "auto",
    marginRight: "auto",
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  customer: {
    width: "40%",
  },
  details: {
    width: "40%",
    textAlign: "right",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderBottomStyle: "solid",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  description: {
    width: "40%",
  },
  qty: {
    width: "15%",
    textAlign: "right",
  },
  rate: {
    width: "20%",
    textAlign: "right",
  },
  amount: {
    width: "25%",
    textAlign: "right",
  },
  summary: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  total: {
    width: "25%",
  },
  notes: {
    marginTop: 30,
    fontSize: 10,
    color: "#666",
  },
})

// Create Document Component
const Invoice = ({
  invoice_no,
  createdAt,
  customer,
  items,
}: {
  invoice_no: string
  createdAt: string
  customer: {
    name: string
    address: string
    phone: string
  }
  items: {
    title: string
    quantity: number
    rate: number
  }[]
}) => {
  const total = items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
  console.log(items[0].title, "items")
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* You can add a logo here */}
        <Image style={styles.logo} src="/shikder-seeds-logo.jpg" />
        <Text style={styles.title}>INVOICE</Text>
        <View style={styles.header}>
          <View style={styles.customer}>
            <Text style={{ fontWeight: "bold" }}>গ্রহণকারী :</Text>
            <Text>{customer.name}</Text>
            <Text>{customer.address}</Text>
            <Text>{customer.phone}</Text>
          </View>

          <View style={styles.details}>
            <Text>ইনভয়েস #: {invoice_no}</Text>
            <Text>অর্ডারের তারিখ: {createdAt}</Text>
            <Text>
              ডেলিভারি তারিখ: {new Date(Date.now()).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={{ fontWeight: "bold" }}>থেকে :</Text>
          <Text>শিকদার সীডস</Text>
          <Text>shikderseeds@gmail.com</Text>
        </View>

        {/* Items Table */}
        <View style={styles.tableHeader}>
          <Text style={styles.description}>বিবরণ</Text>
          <Text style={styles.qty}>পরিমাণ</Text>
          <Text style={styles.amount}>দাম</Text>
        </View>

        {items.map((item, i) => (
          <div key={i}>
            <View style={styles.tableRow}>
              <Text style={styles.description}>{item.quantity}</Text>
              <Text style={styles.qty}>{item.quantity}</Text>
              <Text style={styles.amount}>
                {(item.quantity * item.rate).toFixed(2)} টাকা
              </Text>
            </View>
          </div>
        ))}

{/* style={styles.description} */}

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.total}>
            <Text style={{ fontWeight: "bold" }}>মোট: {total} টাকা</Text>
          </View>
        </View>

        <View style={styles.notes}>
          <Text>শিকদার সীডস থেকে পণ্য কেনার জন্য আপনাকে জানাই ধন্যবাদ।</Text>
        </View>
      </Page>
    </Document>
  )
}

export default Invoice
