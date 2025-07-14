import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import AnimatedBackground from "../components/AnimatedBackground";
import ThemeToggle from "../components/ThemeToggle";
import FloatingInput from "../components/FloatingInput";
import { Helmet } from "react-helmet";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      await login(email.trim(), password);
    } catch (err) {
      console.error("Login error:", err.message);
    }
  };

  return (
    <>
      <Helmet><title>Login | YourAppName</title></Helmet>
      <AnimatedBackground />
      <ThemeToggle />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='min-h-screen flex items-center justify-center px-4 py-10'
      >
        <div className='w-full max-w-md bg-gray-800 bg-opacity-70 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden dark:bg-gray-900 dark:bg-opacity-80'>
          <div className='p-8'>
            <h2 className='text-4xl font-extrabold mb-8 text-center text-white dark:text-green-400'>
              Welcome Back
            </h2>
            <form onSubmit={handleLogin} className='space-y-6'>
              <FloatingInput
                icon={Mail}
                label="Email Address"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FloatingInput
                icon={Lock}
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className='flex justify-end text-sm'>
                <Link to='/forgot-password' className='text-green-400 hover:underline'>
                  Forgot password?
                </Link>
              </div>
              {error && <p className='text-red-500 text-sm font-medium'>{error}</p>}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 transition duration-200'
                type='submit'
                disabled={isLoading}
              >
                {isLoading ? <Loader className='animate-spin mx-auto' /> : "Login"}
              </motion.button>
            </form>
          </div>
          <div className='bg-gray-900 bg-opacity-60 px-8 py-4 text-center dark:bg-gray-800 dark:bg-opacity-50'>
            <p className='text-gray-400 text-sm'>
              Don’t have an account?{" "}
              <Link to='/signup' className='text-green-400 hover:underline'>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default LoginPage;
