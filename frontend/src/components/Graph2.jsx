import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from 'axios';

export default function Example() {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await axios.get('http://localhost:3000/vin/type');
        setChartData(response.data);
        setIsLoading(false); // Mettre à jour l'état pour indiquer que le chargement est terminé
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setIsLoading(false); // Mettre à jour l'état en cas d'erreur
      }
    }

    fetchChartData();
  }, []);

  return (
    <div className="bg-white rounded-xl p-7 shadow-lg mb-3">
      <div>
          <h6 className="font-semibold text-xl mb-4">Nombre de bouteilles par type</h6>
        </div>
        <div className="flex">
        <div className={`mt-4 grid place-items-center px-2 ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}`}>
        <Chart
          type="pie"
          width={200}
          height={200}
          series={chartData.map(data => data.totalQuantite)}
          options={{
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
            colors: ["#640236", "#b77d91", "#FD9BCF", "#1e88e5", "#d81b60"],
            legend: {
              show: false,
              labels: {
                colors: ["#640236", "#FD9BCF", "#F40583"],
                useSeriesColors: false,
                items: {
                  useSeriesColors: false,
                  markers: {
                    width: 8,
                    height: 8,
                  },
                  fontSize: '12px',
                },
                formatter: function (seriesName, opts) {
                  const labels = ['Vin Rouge', 'Vin Blanc', 'Vin Rosé'];
                  return [labels[opts.seriesIndex], opts.w.globals.series[opts.seriesIndex]];
                }
              }
            },
          
          }}
        />
      </div>
    <div className="justify-between align-items-center mt-20 ml-5">
      <ul>

        <li className="flex">
          <div className="w-5 h-5 rounded-full bg-blush-800 mb-2"></div>
          <div className="ml-4 mb-2">Vin rouge</div>
        </li>
        <li className="flex">
          <div className="w-5 h-5 rounded-full bg-vinRouge-500 mb-2"></div>
          <div className="ml-4 mb-2">Vin blanc</div>
        </li>
        <li className="flex">
          <div className="w-5 h-5 rounded-full bg-blush-100 mb-2"></div>
          <div className="ml-4 mb-2">Vin rosé</div>
        </li>
      </ul>
    </div>
        </div>
      
    </div>
  );
}
