import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from 'axios';
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";

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

  const chartConfig = {
    type: "bar",
    height: 240,
    series: [
      {
        name: "Ventes",
        data: salesData,
      },
    ],
    options: {
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
      colors: ["#458795"],
      plotOptions: {
        bar: {
          columnWidth: "40%",
          borderRadius: 2,
        },
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
            colors: "#458795",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
      yaxis: {
        labels: {
          style: {
            colors: "#458795",
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
    },
  };

  return (
    <div className="bg-white rounded-xl p-7 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="w-max rounded-lg bg-ziggurat-500 p-5 text-white">
          <Square3Stack3DIcon className="h-6 w-6" />
        </div>
        <div>
          <h6 className="font-bold text-xl">Bouteilles vendues par mois</h6>
          <p className=" max-w-sm font-normal">
            Ce diagramme illustre le déroulement des ventes sur
            <span className="font-bold text-vinRouge-600 mx-2 ">Vinomarket</span>
            au cours de l'année
            <span className="ml-2 font-bold text-vinRouge-600">2024</span>.
          </p>
        </div>
      </div>
      <div className="px-2 pb-0">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Chart {...chartConfig} />
        )}
      </div>
    </div>
  );
}
