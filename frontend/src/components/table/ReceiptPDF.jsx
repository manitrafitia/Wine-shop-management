import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { margin: 10, padding: 10, flexGrow: 1 },
  header: { fontSize: 20, marginBottom: 20 },
  item: { marginBottom: 10 },
  total: { marginTop: 20, fontSize: 16, fontWeight: 'bold' }
});

const ReceiptPDF = ({ vente }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Reçu de caisse</Text>
        <Text style={styles.item}>Date : {new Date(vente.date).toLocaleDateString('fr-FR')}</Text>
        <Text style={styles.item}>Numéro de vente : {vente.num_vente}</Text>
        <Text style={styles.header}>Vins</Text>
        {vente.vins.map((vinItem, index) => (
          <Text style={styles.item} key={index}>{vinItem.vin.nom} - Quantité : {vinItem.quantite}</Text>
        ))}
        <Text style={styles.total}>Montant Total : {vente.montant_total} €</Text>
      </View>
    </Page>
  </Document>
);

export default ReceiptPDF;
