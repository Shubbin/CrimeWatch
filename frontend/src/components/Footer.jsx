import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin, FaGoogle, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-darkBackground text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <ul className="flex space-x-4 mb-4 md:mb-0">
            <li><Link to="/" className="hover:text-accent">Home</Link></li>
            <li><Link to="/about" className="hover:text-accent">About</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
          </ul>
          <div className="flex space-x-4">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-accent"
              aria-label="Visit our Facebook page"
            >
              <FaFacebook size={24} />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-accent"
              aria-label="Visit our Instagram profile"
            >
              <FaInstagram size={24} />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-accent"
              aria-label="Visit our LinkedIn profile"
            >
              <FaLinkedin size={24} />
            </a>
            <a 
              href="mailto:crimewatch@example.com" 
              className="hover:text-accent"
              aria-label="Email Crimewatch"
            >
              <FaEnvelope size={24} />
            </a>
          </div>
        </div>
        <div className="text-center mt-8 pt-4 border-t border-borderLight">
          <p>&copy; {currentYear} Crimewatch. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
