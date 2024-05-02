import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from 'axios';

export default function SalesChart() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSalesData() {
      try {
        const response = await axios.get('http://localhost:3000/vente/month');
        const salesByMonth = response.data;

        // Reformater les données pour correspondre au format requis par ApexCharts
        const formattedSalesData = salesByMonth.map(sale => ({
          x: sale._id.month,
          y: sale.totalQuantite
        }));

        setSalesData(formattedSalesData);
        setLoading(false); // Mettre fin au chargement une fois les données chargées
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setLoading(false); // Mettre fin au chargement en cas d'erreur
      }
    }

    fetchSalesData();
  }, []);

  const salesChartOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    title: {
      show: "",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#020617"],
    stroke: {
      lineCap: "round",
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    xaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
      categories: salesData.map(data => data.x), // Utiliser les mois récupérés depuis l'API
    },
    yaxis: {
      labels: {
        style: {
          colors: "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#dddddd",
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
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
    <div className="bg-white rounded-xl p-7  ">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div>
          <h6 className="font-semibold text-xl mb-4">Bouteilles vendues par mois</h6>
        </div>
      </div>
      <div className="px-2 pb-0 mb-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Chart 
            options={salesChartOptions}
            series={[{ name: "Sales", data: salesData }]}
            type="line"
            height={240}
          />
        )}
      </div>
    </div>
  );
}
