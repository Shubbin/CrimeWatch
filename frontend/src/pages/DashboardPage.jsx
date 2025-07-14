import AdminDashboard from "../dashboard/AdminDashboard";
import DashboardPage from "../dashboard/UserDashboard";
import SubAdminDashboard from "../dashboard/SubAdminDashboard";
import PoliceDashboard from "../dashboard/PoliceDashboard";
import { useAuthStore } from "../store/authStore";

const Dashboard = () => {
  const { user } = useAuthStore();

  if (!user)
    return <div className="text-center text-white mt-10">Loading user info...</div>;

  switch (user.role) {
    case "admin":
      return <AdminDashboard user={user} />;
    case "sub-admin":
      return <SubAdminDashboard user={user} />;
    case "police":
      return <PoliceDashboard user={user} />;
    default:
      return <DashboardPage user={user} />;
  }
};

export default Dashboard;
