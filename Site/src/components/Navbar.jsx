import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Logo from "../../public/Logo.png"
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const SCROLL_THRESHOLD = 50;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < SCROLL_THRESHOLD) {
        setVisible(true);
      } else {
        setVisible(currentScrollY < lastScrollY);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'ServiceData'));
        const servicesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  return (
    <nav className={`bg-white w-full shadow-lg shadow-black/5 rounded-lg fixed top-0 left-0 right-0 transition-transform duration-300 z-50 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16 sm:h-18 lg:h-20'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link to="/" onClick={scrollToTop}>
              <img src={Logo} alt="BMGH Logo" className='h-8' />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-2 lg:space-x-4'>
            <Link
              to="/"
              className="px-2 font-semibold lg:px-3 py-2 text-gray-800 hover:text-gray-900 hover:underline text-sm lg:text-base"
              onClick={scrollToTop}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="px-2 font-semibold lg:px-3 py-2 text-gray-800 hover:text-gray-900 text-sm lg:text-base hover:underline"
              onClick={scrollToTop}
            >
              About Us
            </Link>
            <div className="relative group">
              {/* Main Link */}
              <Link
                to="#"
                className="px-2 font-semibold lg:px-3 py-2 text-gray-800 hover:text-gray-900 flex items-center text-sm lg:text-base hover:underline"
              >
                Our Services
                <ChevronDown className="ml-1 w-4 h-4" />
              </Link>

              {/* Dropdown Menu */}
              <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                {services.map((service) => (
                  <Link
                    key={service.id}
                    to={`/${service.title.toLowerCase().replace(/\s+/g, '')}Service`}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={scrollToTop}
                  >
                    {service.title}
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/contactus" onClick={scrollToTop}><button className='bg-[#136DA0] text-white px-3 py-2 sm:px-5 sm:py-2 rounded-[25px] hover:bg-[#146796] ml-2 lg:ml-4 text-sm lg:text-base cursor-pointer'>
              Contact us
            </button></Link>
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden flex items-center'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none'
              aria-expanded={isOpen}
              aria-label='Toggle navigation'
            >
              {isOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className='md:hidden border-t border-gray-200 z-50 relative bg-white'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
            <Link
              to="/"
              className="block px-3 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
              onClick={scrollToTop}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
              onClick={scrollToTop}
            >
              About Us
            </Link>

            {/* Mobile Services Dropdown */}
            <div>
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="flex justify-between items-center w-full px-3 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
              >
                <span>Our Services</span>
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${mobileServicesOpen ? 'rotate-180' : ''
                    }`}
                />
              </button>

              {mobileServicesOpen && (
                <div className="pl-4 mt-1 space-y-1">
                  {services.map((service) => (
                    <Link
                      key={service.id}
                      to={`/${service.title.toLowerCase().replace(/\s+/g, '')}Service`}
                      className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                      onClick={scrollToTop}
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2">
              <Link to="/contactus" onClick={scrollToTop}><button className="w-full bg-[#136DA0] text-white px-4 py-2 rounded-md hover:bg-[#146796] cursor-pointer">
                Contact us
              </button></Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
