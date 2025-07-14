import { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaSearch,
  FaUserShield,
  FaUsers,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion } from "framer-motion";

// Surprise particle background with Canvas (simple implementation)
const ParticleBackground = () => {
  useEffect(() => {
    const canvas = document.getElementById("particles");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const particles = [];

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > height) this.speedY = -this.speedY;
      }
      draw() {
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    return () => {
      window.cancelAnimationFrame(animate);
    };
  }, []);

  return (
    <canvas
      id="particles"
      className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
    />
  );
};

const SubAdminDashboard = ({ user }) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPolice: 0,
    totalCriminals: 0,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/users");
        const data = await res.json();
        setUsers(data);

        setStats({
          totalUsers: data.length,
          totalPolice: data.filter((u) => u.role === "police").length,
          totalCriminals: data.filter((u) => u.role === "criminal").length,
        });
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );

      const res = await fetch(`http://localhost:8000/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error("Failed to update role on server");

      alert(`Role for user ${userId} updated to "${newRole}"`);
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role. Please try again.");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <ParticleBackground />
      <div className="min-h-screen p-8 text-white relative z-10">
        <div className="max-w-7xl mx-auto backdrop-blur-md bg-white bg-opacity-10 rounded-3xl shadow-xl p-10 border border-white border-opacity-20">
          {/* Header */}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-extrabold mb-12 flex items-center gap-4 select-none"
          >
            <FaUserCircle className="text-yellow-400 drop-shadow-lg" />
            Welcome, {user?.name.split(" ")[0]} 👮‍♂️
          </motion.h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-14">
            {[
              {
                label: "Total Users",
                value: stats.totalUsers,
                icon: <FaUsers />,
                bg: "from-green-400 to-green-600",
                shadow: "shadow-green-500/60",
              },
              {
                label: "Police Officers",
                value: stats.totalPolice,
                icon: <FaUserShield />,
                bg: "from-blue-400 to-blue-600",
                shadow: "shadow-blue-500/60",
              },
              {
                label: "Criminals",
                value: stats.totalCriminals,
                icon: <FaExclamationTriangle />,
                bg: "from-red-400 to-red-600",
                shadow: "shadow-red-500/60",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.7, type: "spring" }}
                className={`relative rounded-3xl p-8 bg-gradient-to-br ${stat.bg} text-white shadow-lg ${stat.shadow} hover:scale-105 transform transition-transform cursor-pointer`}
              >
                <div className="absolute top-6 right-6 opacity-20 text-6xl">{stat.icon}</div>
                <h4 className="text-lg font-semibold z-10 relative">{stat.label}</h4>
                <p className="text-5xl font-extrabold z-10 relative">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="relative max-w-md mx-auto mb-10"
          >
            <input
              type="text"
              placeholder="Search user by name or email..."
              className="w-full py-4 px-6 rounded-xl text-gray-900 font-medium shadow-md focus:outline-none focus:ring-4 focus:ring-yellow-400 transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="absolute top-5 right-6 text-yellow-500" />
          </motion.div>

          {/* User Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="overflow-x-auto rounded-3xl shadow-xl border border-white border-opacity-20 bg-gradient-to-tr from-white/5 to-white/10 backdrop-blur-lg"
          >
            <table className="w-full text-sm sm:text-base text-white">
              <thead>
                <tr className="bg-gradient-to-r from-yellow-600 to-yellow-400 bg-opacity-20 text-white select-none">
                  <th className="p-4 text-left font-semibold tracking-wide">Name</th>
                  <th className="p-4 text-left font-semibold tracking-wide">Email</th>
                  <th className="p-4 text-left font-semibold tracking-wide">Role</th>
                  <th className="p-4 text-center font-semibold tracking-wide">Change Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length ? (
                  filteredUsers.map((u) => {
                    const isRestricted = u.role === "admin" || u.role === "sub-admin";

                    return (
                      <tr
                        key={u._id}
                        className="hover:bg-yellow-500 hover:bg-opacity-30 transition cursor-pointer"
                      >
                        <td className="p-4 font-semibold">{u.name}</td>
                        <td className="p-4">{u.email}</td>
                        <td className="p-4 capitalize font-medium">{u.role}</td>
                        <td className="p-4 text-center">
                          <select
                            value={u.role}
                            disabled={isRestricted}
                            onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                            className={`bg-yellow-600 bg-opacity-80 rounded-lg px-4 py-2 text-black font-semibold hover:bg-yellow-500 transition ${
                              isRestricted ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            <option value="user">User</option>
                            <option value="police">Police</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-yellow-300 font-semibold">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SubAdminDashboard;
