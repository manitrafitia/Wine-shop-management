import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function ProductionReport({ vinInfo }) {
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
      marginBottom: 10,
    });
    
    const defaultVinInfo = {
      nom: 'Nom du Vin',
      num_prod: 'PROD0001',
      date: '13 avril 2024',
      raisin: '#raisin',
      quantite: '#QUANTITE',
      date_production: '#DATE',
      // duree_vinification: '#DATE',
      // date_mise_bouteille: '#DATE',
      region: '#REGION',
    };

    const finalVinInfo = vinInfo || defaultVinInfo;


    doc.setFontSize(12); // Réduire la taille de la police

    doc.text(`Société VINSPIRATION`, 10, 10);
    doc.text(`301, Fianarantsoa`, 10, 15);
    doc.text(`vinomarket.v@gmail.com`, 10, 20);
    doc.text(`034 00 000 0`, 10, 25);
    doc.text(`Fianarantsoa, le ${finalVinInfo.date}`, 10, 30);
    doc.text(`Objet : Production du vin (${finalVinInfo.nom})`, 10, 40);
    doc.text(`Référence : ${finalVinInfo.num_prod}`, 10, 45);

    doc.text('Madame, Monsieur,', 10, 60);
    const introText = doc.splitTextToSize(`Je vous adresse ce rapport afin de vous rendre compte de manière détaillée de la production du vin #VIN, référencé ${finalVinInfo.num_prod}. Ce document relate l'ensemble des étapes de fabrication, depuis la cueillette des raisins jusqu'à l'embouteillage du vin, en passant par la vinification et l'élevage.`, 190);
    doc.text(introText, 10, 70);

    const blueInfoText = doc.splitTextToSize(`Le vin est nommé "${finalVinInfo.nom}", produit avec une quantité de raisin équivalente à "${finalVinInfo.quantite_raisin}" et une production totale de "${finalVinInfo.quantite_bouteilles}" bouteilles. La production a été réalisée le "${finalVinInfo.date_production}", avec une durée de vinification et une mise en bouteille également effectuées à la même date. Ce vin a été produit dans la région de "${finalVinInfo.region}".`, 190);
    doc.text(blueInfoText, 10, 90);

    const concText = doc.splitTextToSize(`Je suis convaincu(e) que ce rapport saura répondre à vos attentes. N'hésitez pas à me contacter pour toute question complémentaire.`, 190);
    doc.text(concText, 10, 120);

    doc.text(`Cordialement,`, 10, 130);
    doc.text(`VINOMARKET`, 10, 140);

    doc.save(`Rapport_Production_Vin_${finalVinInfo.nom}.pdf`);
  };

  return (
    <div>
      <button onClick={generatePDF}>Télécharger PDF</button>
    </div>
  );
}
