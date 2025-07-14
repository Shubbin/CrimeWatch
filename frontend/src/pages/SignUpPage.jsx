import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import AnimatedBackground from "../components/AnimatedBackground";
import ThemeToggle from "../components/ThemeToggle";
import FloatingInput from "../components/FloatingInput";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { Helmet } from "react-helmet";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { signup, error, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await signup(email.trim(), password, name.trim());
      navigate("/verify-email");
    } catch (err) {
      console.error("Signup error:", err.message);
    }
  };

  return (
    <>
      <Helmet><title>Sign Up | YourAppName</title></Helmet>
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
              Create Account
            </h2>

            <form onSubmit={handleSignUp} className='space-y-6'>
              <FloatingInput
                icon={User}
                label="Full Name"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

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

              <PasswordStrengthMeter password={password} />

              {error && <p className='text-red-500 text-sm font-medium'>{error}</p>}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 transition duration-200'
                type='submit'
                disabled={isLoading}
              >
                {isLoading ? <Loader className='animate-spin mx-auto' /> : "Sign Up"}
              </motion.button>
            </form>
          </div>

          <div className='bg-gray-900 bg-opacity-60 px-8 py-4 text-center dark:bg-gray-800 dark:bg-opacity-50'>
            <p className='text-gray-400 text-sm'>
              Already have an account?{" "}
              <Link to='/login' className='text-green-400 hover:underline'>
                Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SignUpPage;
