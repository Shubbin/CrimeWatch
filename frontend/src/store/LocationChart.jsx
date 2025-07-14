import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const LocationChart = ({ criminals }) => {
  // Group crimes by location
  const locationCounts = criminals.reduce((acc, criminal) => {
    const location = criminal.location || "Unknown";
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(locationCounts);
  const dataValues = Object.values(locationCounts);

  const data = {
    labels,
    datasets: [
      {
        label: "Number of Crimes",
        data: dataValues,
        backgroundColor: "#3b82f6", // Tailwind blue-500
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Bar data={data} options={options} />
    </div>
  );
};

export default LocationChart;
