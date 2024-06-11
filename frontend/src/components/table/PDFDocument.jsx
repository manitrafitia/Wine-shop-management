import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { margin: 10, padding: 10 },
  heading: { fontSize: 18, marginBottom: 10 },
  text: { fontSize: 12 }
});

const PDFDocument = ({ vente }) => {
  // Check if vente and vente.vins are defined
  if (!vente || !vente.vins) {
    console.error('Invalid vente data:', vente);
    return (
      <Document>
        <Page style={styles.page}>
          <Text>Invalid vente data</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Vente #{vente.num_vente}</Text>
          <Text style={styles.text}>Client: {vente.client?.num_client || 'Client inconnu'}</Text>
          <Text style={styles.text}>Date: {new Date(vente.date).toLocaleDateString('fr-FR')}</Text>
          <Text style={styles.heading}>Vins:</Text>
          {vente.vins.map((vinItem, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.text}>
                {vinItem.vin ? `${vinItem.vin.nom} - ${vinItem.vin.prix}€ - Quantité: ${vinItem.quantite}` : 'Vin inconnu'}
              </Text>
            </View>
          ))}
          <Text style={styles.heading}>Montant Total: {vente.montant_total}€</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument;
