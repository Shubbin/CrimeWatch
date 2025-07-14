import { useEffect, useState, useRef } from "react";
import { FaPlus, FaSearch, FaUserSecret, FaSkullCrossbones, FaExclamationTriangle } from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const PoliceDashboard = ({ user }) => {
  const [criminals, setCriminals] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedAdd, setExpandedAdd] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchCriminals = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/criminals");
        if (!response.ok) throw new Error("Failed to fetch criminals");
        const data = await response.json();
        const list = data.data || data;
        setCriminals(Array.isArray(list) ? list : []);
      } catch (error) {
        console.error("Error fetching criminals:", error.message || error);
        setCriminals([]);
      }
    };
    fetchCriminals();
  }, []);

  // Auto collapse add button after 5 seconds if no click
  useEffect(() => {
    if (expandedAdd) {
      timerRef.current = setTimeout(() => {
        setExpandedAdd(false);
      }, 5000);
    }
    return () => clearTimeout(timerRef.current);
  }, [expandedAdd]);

  const filteredCriminals = criminals.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.type?.toLowerCase().includes(search.toLowerCase())
  );

  const typeCounts = Array.isArray(criminals)
    ? criminals.reduce((acc, c) => {
        acc[c.type] = (acc[c.type] || 0) + 1;
        return acc;
      }, {})
    : {};

  const pieChartData = {
    labels: Object.keys(typeCounts),
    datasets: [
      {
        label: "Crimes by Type",
        data: Object.values(typeCounts),
        backgroundColor: ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
        borderWidth: 1,
      },
    ],
  };

  const cardStats = [
    {
      label: "Wanted Criminals",
      icon: <FaUserSecret className="text-red-500" />,
      count: criminals.filter((c) => c.category === "wanted").length,
      color: "bg-red-700",
    },
    {
      label: "Most Dangerous",
      icon: <FaSkullCrossbones className="text-yellow-400" />,
      count: criminals.filter((c) => c.category === "dangerous").length,
      color: "bg-yellow-600",
    },
    {
      label: "Total Criminals",
      icon: <FaExclamationTriangle className="text-blue-400" />,
      count: criminals.length,
      color: "bg-blue-700",
    },
  ];

  return (
    <div className="min-h-screen p-8 bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-white relative font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 tracking-wide">
          👮 Officer <span className="text-indigo-400">{user?.name?.split(" ")[0]}</span>, your dashboard
        </h1>

        {/* Floating Add Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => navigate("/add-criminal")}
            onMouseEnter={() => setExpandedAdd(true)}
            onMouseLeave={() => setExpandedAdd(false)}
            className={`flex items-center gap-3
              bg-gradient-to-r from-indigo-600 to-indigo-400 
              text-white font-semibold rounded-full shadow-xl
              transition-all duration-300 ease-in-out
              ${expandedAdd ? "w-44 px-5 py-3" : "w-14 h-14 p-0 justify-center"}
              hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-500/50`}
          >
            <FaPlus className="text-xl" />
            {expandedAdd && <span className="select-none">Add Criminal</span>}
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8 w-full max-w-sm relative">
          <input
            type="text"
            placeholder="Search by name or type..."
            className="w-full py-3 pl-12 pr-4 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
        </div>

        {/* Statistic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {cardStats.map((card, i) => (
            <div
              key={i}
              className={`p-6 rounded-xl shadow-lg ${card.color} bg-opacity-90 flex items-center justify-between hover:scale-[1.04] transition-transform duration-300 cursor-default`}
            >
              <div>
                <h3 className="text-xl font-semibold">{card.label}</h3>
                <p className="text-4xl font-bold mt-1">{card.count}</p>
              </div>
              <div className="text-5xl">{card.icon}</div>
            </div>
          ))}
        </div>

        {/* Pie Chart + Analytics */}
        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-5xl mx-auto flex flex-col md:flex-row gap-10 items-center">
          <div style={{ width: "280px", height: "280px" }}>
            {Object.keys(typeCounts).length > 0 ? (
              <Pie data={pieChartData} options={{ maintainAspectRatio: false, responsive: true }} />
            ) : (
              <p className="text-gray-400 text-center">No data to display.</p>
            )}
          </div>
          <div className="flex-1 text-left text-gray-200">
            <h2 className="text-3xl font-bold mb-5">Crime Analytics</h2>
            {Object.keys(typeCounts).length > 0 ? (() => {
              const totalCrimes = criminals.length;
              const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
              const [topCrimeType, topCrimeCount] = sortedTypes[0];
              const topCrimePercentage = ((topCrimeCount / totalCrimes) * 100).toFixed(1);

              return (
                <>
                  <p className="mb-3 text-xl">
                    <strong>Most Common Crime:</strong>{" "}
                    <span className="capitalize text-indigo-400">{topCrimeType}</span>
                  </p>
                  <p className="mb-3 text-xl">
                    <strong>Percentage of Total:</strong> {topCrimePercentage}%
                  </p>
                  <p className="mb-3 text-xl">
                    <strong>Total Crimes Recorded:</strong> {totalCrimes}
                  </p>
                  <div className="mt-8 p-5 bg-indigo-900 bg-opacity-70 rounded-lg shadow-inner border border-indigo-700">
                    <p className="font-semibold text-indigo-300">
                      Insight: Allocate more resources to combat{" "}
                      <span className="capitalize">{topCrimeType}</span> crimes, which constitute the majority of cases.
                    </p>
                  </div>
                </>
              );
            })() : (
              <p className="text-gray-500">No crime data available to analyze.</p>
            )}
          </div>
        </div>

        {/* Criminals Table */}
        <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-xl mt-12">
          <table className="w-full text-sm sm:text-base border-collapse">
            <thead className="bg-indigo-700 bg-opacity-90 text-white">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCriminals.length ? (
                filteredCriminals.map((c) => (
                  <tr
                    key={c._id}
                    className="hover:bg-indigo-600 hover:bg-opacity-40 transition-colors cursor-pointer"
                  >
                    <td className="p-4 capitalize">{c.name}</td>
                    <td className="p-4 capitalize">{c.type}</td>
                    <td className="p-4 capitalize">{c.category}</td>
                    <td className="p-4 capitalize">{c.custodyStatus}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400">
                    No criminals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PoliceDashboard;
