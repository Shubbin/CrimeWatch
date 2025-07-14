import { useState, useEffect, useRef } from "react";
import {
  FaUserCircle,
  FaSearch,
  FaUserShield,
  FaUsers,
  FaUserTie,
  FaExclamationTriangle,
  FaPlusCircle, 
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Particles from "react-tsparticles";

const statsConfig = [
  {
    label: "Total Users",
    icon: FaUsers,
    gradient: "from-green-400 to-green-700",
    bgColor: "bg-green-600",
    roleFilter: null,
  },
  {
    label: "Police Officers",
    icon: FaUserShield,
    gradient: "from-blue-400 to-blue-700",
    bgColor: "bg-blue-600",
    roleFilter: "police",
  },
  {
    label: "Criminals",
    icon: FaExclamationTriangle,
    gradient: "from-red-400 to-red-700",
    bgColor: "bg-red-600",
    roleFilter: null,
    clickable: true,
    navigateTo: "/viewcriminals",
  },
  {
    label: "Sub Admins",
    icon: FaUserTie,
    gradient: "from-yellow-400 to-yellow-600",
    bgColor: "bg-yellow-500",
    roleFilter: "sub-admin",
  },
];

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [criminalsCount, setCriminalsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // New state: Controls whether Add Criminal button is expanded or icon-only
  const [addBtnExpanded, setAddBtnExpanded] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setFetchError(null);

        const usersRes = await fetch("http://localhost:8000/api/users");
        if (!usersRes.ok) throw new Error("Failed to fetch users");
        let usersData = await usersRes.json();
        usersData = usersData.sort((a, b) => a.name.localeCompare(b.name));

        const criminalsRes = await fetch("http://localhost:8000/api/criminals");
        if (!criminalsRes.ok) throw new Error("Failed to fetch criminals");
        const criminalsData = await criminalsRes.json();
        const criminalsArr = criminalsData.data || criminalsData;

        setUsers(usersData);
        setCriminalsCount(criminalsArr.length);
      } catch (err) {
        setFetchError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Handle the 5 second timeout to revert Add button back to icon-only
  useEffect(() => {
    if (addBtnExpanded) {
      // Clear any previous timeout to avoid multiple running
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // After 5 seconds, revert to icon-only
      timeoutRef.current = setTimeout(() => {
        setAddBtnExpanded(false);
      }, 5000);
    }

    // Cleanup timeout on unmount or on addBtnExpanded change
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [addBtnExpanded]);

  const handleUpdateRole = async (userId, newRole) => {
    if (!userId || !newRole) return;

    const prevUsers = [...users];
    setUpdatingUserId(userId);

    try {
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );

      const res = await fetch(`http://localhost:8000/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error("Failed to update role on server");

      toast.success(`Role updated to "${newRole}"`);
    } catch (err) {
      setUsers(prevUsers);
      toast.error("Failed to update role. Please try again.");
      console.error(err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white text-xl">
        Loading dashboard...
      </div>
    );

  if (fetchError)
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-800 text-white text-xl p-6">
        Error loading dashboard: {fetchError}
      </div>
    );

  return (
    <>
      {/* Particle Background */}
      <Particles
        options={{
          fpsLimit: 60,
          particles: {
            number: { value: 60, density: { enable: true, area: 800 } },
            color: { value: "#facc15" },
            shape: { type: "circle" },
            opacity: { value: 0.1 },
            size: { value: 3, random: true },
            move: { enable: true, speed: 1, direction: "none", outModes: "bounce" },
          },
          interactivity: {
            events: {
              onHover: { enable: false },
              onClick: { enable: false },
            },
          },
          detectRetina: true,
        }}
        className="fixed inset-0 -z-10"
      />

      <div className="min-h-screen p-6 flex justify-center items-start bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
        <div
          className="w-full max-w-7xl bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20"
          role="main"
          aria-label="Admin dashboard"
        >
          <ToastContainer position="top-right" autoClose={3000} />

          <h2 className="flex items-center text-4xl font-extrabold mb-10 text-white gap-3 select-none">
            <FaUserCircle className="text-pink-500" aria-hidden="true" />
            Welcome, {user?.name.split(" ")[0]} 👮‍♂️
          </h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {statsConfig.map(
              (
                { label, icon: Icon, gradient, roleFilter, clickable, navigateTo },
                i
              ) => {
                let value;
                if (label === "Criminals") value = criminalsCount;
                else if (roleFilter)
                  value = users.filter((u) => u.role === roleFilter).length;
                else value = users.length;

                return (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, type: "spring", stiffness: 120 }}
                    whileHover={clickable ? { scale: 1.05 } : {}}
                    onClick={clickable ? () => navigate(navigateTo) : undefined}
                    role={clickable ? "button" : undefined}
                    tabIndex={clickable ? 0 : -1}
                    aria-label={`${label} statistic`}
                    onKeyDown={(e) => {
                      if (clickable && (e.key === "Enter" || e.key === " ")) {
                        navigate(navigateTo);
                      }
                    }}
                    className={`relative cursor-pointer select-none rounded-xl p-7 shadow-lg text-white bg-gradient-to-br ${gradient} ${
                      clickable ? "hover:brightness-110" : ""
                    }`}
                  >
                    {/* Large Icon Background */}
                    <Icon
                      aria-hidden="true"
                      className="absolute -top-6 -right-6 text-white/20 text-[5rem] pointer-events-none select-none"
                    />
                    {/* Content */}
                    <div className="relative z-10 flex flex-col gap-1">
                      <Icon aria-hidden="true" className="text-3xl" />
                      <h3 className="text-lg font-semibold">{label}</h3>
                      <p className="text-4xl font-extrabold">{value}</p>
                    </div>
                  </motion.div>
                );
              }
            )}
          </div>

          {/* Container holding Add Criminal and Search Bar side by side */}
          <div className="flex items-center justify-between mb-8 max-w-full gap-4">
            {/* Add Criminal Icon/Button */}
            <div
              // Hover to expand the button, onMouseLeave keeps expanded until timeout
              onMouseEnter={() => setAddBtnExpanded(true)}
              onMouseLeave={() => {
                // Do nothing here because timeout will handle collapse
              }}
              className="relative"
            >
              {!addBtnExpanded ? (
                // Icon only view
                <button
                  aria-label="Add Criminal"
                  onClick={() => navigate("/add-criminal")}
                  className="text-red-600 hover:text-red-700 text-4xl transition"
                  title="Add Criminal"
                >
                  <FaPlusCircle />
                </button>
              ) : (
                // Expanded button view
                <button
                  aria-label="Navigate to Add Criminal page"
                  onClick={() => navigate("/add-criminal")}
                  className="bg-red-600 hover:bg-red-700 transition text-white px-6 py-3 rounded-lg font-semibold shadow-md shadow-red-600/50 whitespace-nowrap"
                >
                  Add Criminal
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <input
                type="search"
                placeholder="Search user by name or email..."
                className="w-full rounded-xl py-3 pl-5 pr-12 text-black text-lg font-medium focus:outline-none focus:ring-4 focus:ring-yellow-400 shadow-md"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search users by name or email"
              />
              <FaSearch
                aria-hidden="true"
                className="absolute right-4 top-3.5 text-yellow-500 pointer-events-none"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-xl shadow-lg bg-white/10 backdrop-blur-md border border-white/20">
            <table
              className="w-full text-white text-sm sm:text-base"
              role="table"
              aria-label="Users table"
            >
              <thead className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-semibold select-none">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-8 text-yellow-400 font-semibold select-none"
                    >
                      No users found matching "{search}"
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(({ _id, name, email, role }) => (
                    <tr
                      key={_id}
                      className="hover:bg-yellow-300 hover:text-black cursor-default transition"
                    >
                      <td className="p-4 font-semibold">{name}</td>
                      <td className="p-4">{email}</td>
                      <td className="p-4">
                        <select
                          aria-label={`Change role for ${name}`}
                          value={role}
                          onChange={(e) => handleUpdateRole(_id, e.target.value)}
                          disabled={updatingUserId === _id}
                          className="bg-yellow-300 rounded px-2 py-1 font-semibold cursor-pointer hover:bg-yellow-400"
                        >
                          <option value="user">User</option>
                          <option value="sub-admin">Sub Admin</option>
                          <option value="police">Police Officer</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
