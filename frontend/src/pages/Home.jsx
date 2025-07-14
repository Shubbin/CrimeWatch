import { Link } from "react-router-dom";
import { FaLock, FaCamera, FaUserCheck, FaQuoteLeft } from "react-icons/fa";
import { motion } from "framer-motion";

import emblem from "../assets/images/emblem.png";
import anonymousImg from "../assets/images/anonymous.jpg";
import secureImg from "../assets/images/secure.png";

// Online profile photos
const johnPhoto = "https://randomuser.me/api/portraits/men/75.jpg";
const ngoziPhoto = "https://randomuser.me/api/portraits/women/65.jpg";
const sarahPhoto = "https://randomuser.me/api/portraits/women/45.jpg";

// Feature background
const featureBg1 = "https://images.unsplash.com/photo-1556740749-887f6717d7e4?fit=crop&w=800&q=80";

// Testimonials
const testimonials = [
  {
    name: "Sarah A.",
    comment:
      "Crimewatch helped me verify my housemaid before hiring. I feel much safer now!",
    photo: sarahPhoto,
  },
  {
    name: "John D.",
    comment:
      "As a landlord, background checks saved me from multiple risky tenants.",
    photo: johnPhoto,
  },
  {
    name: "Ngozi M.",
    comment:
      "Anonymous reporting is genius! I reported some shady activity without any fear.",
    photo: ngoziPhoto,
  },
];

// Feature list
const features = [
  {
    icon: <FaUserCheck />,
    title: "Background Checks",
    img: featureBg1,
    desc: "Search public records to see if someone has a criminal history before hiring or engaging with them.",
  },
  {
    icon: <FaCamera />,
    title: "Anonymous Tips",
    img: anonymousImg,
    desc: "Submit information about suspicious people or activity — all without revealing your identity.",
  },
  {
    icon: <FaLock />,
    title: "Secure Record Lookup",
    img: secureImg,
    desc: "View reports and criminal records safely with end-to-end encryption and total privacy.",
  },
];

const Home = () => {
  return (
    <main className="relative text-white min-h-screen font-sans overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary via-accent-dark to-secondary opacity-20 z-0 animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
      />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="bg-primary text-white py-20 px-6 md:px-16">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
                Know Who You Hire with{" "}
                <span className="text-yellow-500">Crimewatch</span>
              </h1>
              <p className="text-lg mb-8 leading-relaxed text-gray-200">
                Verify the background of individuals before hiring them.
                Whether you're a business, homeowner, or citizen, stay informed about
                criminal records or suspicious activity.
              </p>
              <Link
                to="/viewcriminals"
                className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:scale-105"
              >
                Get Started
              </Link>
            </motion.div>
            <motion.img
              src={emblem}
              alt="Justice Shield"
              className="rounded-xl shadow-2xl w-full max-h-[350px] object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 md:px-16 bg-gray-900">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            What You Can Do on <span className="text-yellow-500">Crimewatch</span>
          </h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-800 rounded-2xl p-6 text-center shadow-xl transition duration-300"
              >
                <div className="text-yellow-500 text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <img
                  src={feature.img}
                  alt={feature.title}
                  className="rounded-lg mb-4 w-full h-40 object-cover"
                />
                <p className="text-gray-300">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-6 md:px-16 bg-[#101010]">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What Our Users Are Saying
          </h2>
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 text-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <FaQuoteLeft className="text-yellow-500 text-2xl mb-2" />
                <img
                  src={testimonial.photo}
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-yellow-500"
                />
                <p className="text-lg italic mb-4">"{testimonial.comment}"</p>
                <h4 className="text-yellow-400 font-bold">- {testimonial.name}</h4>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <motion.section
          className="bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 py-16 text-center px-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Be Informed, Be Safe
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Get access to background checks, report past crimes, and help your community stay alert.
            Join the movement to promote safety and awareness.
          </p>
        </motion.section>
      </div>
    </main>
  );
};

export default Home;
