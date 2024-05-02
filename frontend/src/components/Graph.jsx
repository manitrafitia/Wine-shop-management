import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from 'axios';

export default function ProductionChart() {
  const [productionData, setProductionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductionData() {
      try {
        const response = await axios.get('http://localhost:3000/production/month');
        const productionByMonth = response.data;

        // Reformater les données pour correspondre au format requis par ApexCharts
        const formattedProductionData = productionByMonth.map(production => ({
          x: production._id.month || "", // Assurez-vous que x est une chaîne vide si le mois est indéfini
          y: production.totalQuantite
        }));

        setProductionData(formattedProductionData);
        setLoading(false); // Mettre fin au chargement une fois les données chargées
      } catch (error) {
        console.error('Error fetching production data:', error);
        setLoading(false); // Mettre fin au chargement en cas d'erreur
      }
    }

    fetchProductionData();
  }, []);

  const productionChartOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    title: {
      align: "center",
      style: {
        fontSize: "20px",
        fontWeight: "bold",
        fontFamily: "inherit",
        color: "#333"
      }
    },
    xaxis: {
      type: "category",
      labels: {
        show: true,
        rotate: -45,
        rotateAlways: false,
        minHeight: undefined,
        maxHeight: 120,
        style: {
          colors: "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "16px",
          fontWeight: "bold",
          fontFamily: "inherit",
          color: "#333"
        }
      },
      labels: {
        style: {
          colors: "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
    },
    colors: ["#91034F"],
    stroke: {
      lineCap: "round",
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    grid: {
      show: true,
      borderColor: "#dddddd",
      strokeDashArray: 5,
      padding: {
        top: 5,
        right: 20,
      },
    },
    fill: {
      opacity: 0.8,
    },
    tooltip: {
      theme: "dark",
    },
  };

  return (
    <div className="bg-white rounded-xl p-7   mb-3">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div>
          <h6 className="font-semibold text-xl mb-4">Bouteilles produites par mois</h6>
        </div>
      </div>
      <div className="px-2 pb-0 mb-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Chart 
            options={productionChartOptions}
            series={[{ name: "Production", data: productionData }]}
            type="line"
            height={240}
          />
        )}
      </div>
    </div>
  );
}
