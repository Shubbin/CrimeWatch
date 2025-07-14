import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import FloatingShape from "./components/FloatingShape";
import LoadingSpinner from "./components/LoadingSpinner";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";

import AddCriminal from "./pages/AddCriminal";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import EditCriminal from "./components/EditCriminal";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import ViewCriminals from "./pages/viewCriminals";
import AdminDashboard from "./dashboard/AdminDashboard";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";

// Route protection for authenticated and verified users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isVerified) return <Navigate to="/verify-email" replace />;
  return children;
};

// Redirect authenticated/verified users away from auth pages
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) return <Navigate to="/" replace />;
  return children;
};

// Main layout wrapper with navbar, floating shapes, footer
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden">
      <Navbar />
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />
      
      <main className="flex-grow pt-16 px-4 md:px-8">{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  const { isCheckingAuth, checkAuth, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <>
      <Routes>
        {/* Protected Routes */}
        <Route
          path="/dashboardpage"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminDashboard user={user} />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-criminal"
          element={
            <ProtectedRoute>
              <Layout>
                <AddCriminal />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/criminals/edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EditCriminal />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/viewcriminals" element={<Layout><ViewCriminals /></Layout>} />

        {/* Auth Routes */}
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />

        {/* Fallback for undefined routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster position="top-right" />
    </>
  );
}

export default App;
