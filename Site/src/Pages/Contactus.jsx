import React, { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import FloatingIcons from '../components/FloatingIcons';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

gsap.registerPlugin(ScrollTrigger);

export default function Contactus() {
  // Refs for animations
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const formRef = useRef(null);
  const separatorRef = useRef(null);
  const officesRef = useRef(null);

  useEffect(() => {
    // Set initial states
    gsap.set([titleRef.current, descriptionRef.current, formRef.current, separatorRef.current, officesRef.current], {
      opacity: 0,
      y: 30
    });

    // Title animation
    gsap.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: titleRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // Description animation
    gsap.to(descriptionRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.2,
      scrollTrigger: {
        trigger: descriptionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // Form animation
    gsap.to(formRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: formRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // Separator animation
    gsap.to(separatorRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: separatorRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });

    // Offices animation
    gsap.to(officesRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: officesRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    city: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Add document to Firestore
      const docRef = await addDoc(collection(db, 'FormData'), {
        ...formData,
        timestamp: new Date()
      });

      // Clear form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        city: ''
      });

      toast.success('✅ Message sent successfully!', {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#136DA0',
          color: '#fff',
          fontSize: '16px',
          borderRadius: '10px',
          padding: '16px',
          margin: '16px',
          width: '300px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }
      });
    } catch (error) {
      console.error('Error submitting form: ', error);
      toast.error('❌ Failed to send message. Please try again.', {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#ef4444',
          color: '#fff',
          fontSize: '16px',
          borderRadius: '10px',
          padding: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rajkot office coordinates (Head Office)
  const rajkotLatitude = 22.2736308;
  const rajkotLongitude = 70.7512555;

  // Junagadh office coordinates (Branch Office)
  const junagadhLatitude = 21.5222;
  const junagadhLongitude = 70.4579;

  // Generate the Google Maps embed URL with the coordinates and zoom level
  const zoom = 15;
  const rajkotMapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.7!2d${rajkotLongitude}!3d${rajkotLatitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDE2JzI1LjEiTiA3MMKwNDUnMDQuNSJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin&zoom=${zoom}`;
  const junagadhMapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.7!2d${junagadhLongitude}!3d${junagadhLatitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDMxJzIwLjAiTiA3MMKwMjcnMjguNCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin&zoom=${zoom}`;

  const openRajkotInGoogleMaps = () => {
    // Open Google Maps in a new tab with the Rajkot office location
    window.open(`https://www.google.com/maps?q=${rajkotLatitude},${rajkotLongitude}`, '_blank');
  };

  const openJunagadhInGoogleMaps = () => {
    // Open Google Maps in a new tab with the Junagadh office location
    window.open(`https://www.google.com/maps?q=${junagadhLatitude},${junagadhLongitude}`, '_blank');
  };

  return (
    <>
      <div className="max-w-screen mx-auto relative p-5 pt-24 sm:pt-28 lg:pt-32 font-[Poppins] gap-5 flex flex-col">

        {/* Navbar */}
        <Navbar />


        <h1 ref={titleRef} className="text-4xl font-bold text-[#136DA0] mb-2">Contact Us</h1>
        <p ref={descriptionRef} className="text-lg mb-8 font-medium">
          We'd love to hear from you! Whether you have questions, feedback, or
          need support, feel free to reach out to us.
        </p>

        <div ref={formRef} className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-600 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Your Name"
                className="w-full p-3 bg-gray-100 rounded text-gray-800"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 mb-2">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Your E-mail Id"
                className="w-full p-3 bg-gray-100 rounded text-gray-800"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-600 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter Your Phone Number"
                className="w-full p-3 bg-gray-100 rounded text-gray-800"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="city" className="block text-gray-600 mb-2">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter Your City"
                className="w-full p-3 bg-gray-100 rounded text-gray-800"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-600 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter Your Message"
                className="w-full p-3 bg-gray-100 rounded text-gray-800 h-32"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-[#136DA0] hover:bg-[#116696] cursor-pointer rounded-[10px] text-white font-medium py-3 px-6 rounded transition duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>

        <div
          ref={separatorRef}
          id="separator"
          className="w-full flex items-center justify-center py-6 px-4"
        >
          <div className="flex items-center w-full gap-4">
            {/* Left line */}
            <div className="flex-grow h-px bg-[#D1E9F5]"></div>

            {/* Label container */}
            <div className="px-4 py-2 bg-[#F0F9FF] text-[#136DA0] font-medium text-sm rounded-full shadow-sm border border-[#B5DAF0] flex items-center gap-2">
              <i className="ri-building-fill text-lg"></i>
              Offices
            </div>

            {/* Right line */}
            <div className="flex-grow h-px bg-[#D1E9F5]"></div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[#136DA0] mb-8 underline decoration-[#136DA0]">Office Addresses</h1>

        {/* Head Office Section */}
        <div ref={officesRef} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="md:flex">
            <div className="md:w-1/3 p-2">
              <div className="bg-gray-100 rounded-lg overflow-hidden h-64 relative">
                {/* Button to open in Google Maps */}
                <button
                  onClick={openRajkotInGoogleMaps}
                  className="absolute top-2 left-2 bg-white py-1 px-3 rounded shadow text-sm hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  View in Google Maps
                </button>

                {/* Embedded map */}
                <iframe
                  src={rajkotMapUrl}
                  title="Head Office Location"
                  className="w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            <div className="md:w-2/3 p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h2 className="text-3xl font-bold">Head Office</h2>
              </div>
              <h3 className="text-xl text-[#136DA0] font-medium mb-4">Rajkot</h3>
              <p className="mb-2 font-medium">Office No. 921-922, 9th Floor, RK Empire,150ft Ring Road, Near Umiya Circle,Rajkot, Gujarat – 360 004.</p>
              <p className="mb-2 font-medium">Contact No.: +91-99044 36410</p>
              <p className="mb-2 font-medium">Email: <span>info.bmghco@gmail.com</span></p>
              <p className="font-medium">Contact Person: CA. Bhavin Bhadra (Managing Partner)</p>
            </div>
          </div>
        </div>

        {/* Branch Office Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="md:flex">
            <div className="md:w-1/3 p-2">
              <div className="bg-gray-100 rounded-lg overflow-hidden h-64 relative">
                {/* Button to open in Google Maps */}
                <button
                  onClick={openJunagadhInGoogleMaps}
                  className="absolute top-2 left-2 bg-white py-1 px-3 rounded shadow text-sm hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  View in Google Maps
                </button>

                {/* Embedded map */}
                <iframe
                  src={junagadhMapUrl}
                  title="Branch Office Location"
                  className="w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            <div className="md:w-2/3 p-4">
              <div className="flex items-center gap-2 mb-2">
                <i className="ri-building-4-fill text-2xl text-[#EB7E37]"></i>
                <h2 className="text-3xl font-bold">Branch Office</h2>
              </div>
              <h3 className="text-xl text-[#136DA0] font-medium mb-4 font-medium">Junagadh</h3>
              <p className="mb-2 font-medium">Office No. 214, 2nd Floor, Fortune Plaza,MG Road, Junagadh – 362 001.</p>
              <p className="mb-2 font-medium">Contact No.: +91-9904436410</p>
              <p className="mb-2 font-medium">Email: info.bmghco@gmail.com</p>
              <p className="font-medium">Contact Person: CA. HIMMAT GANGVANI (Managing Partner)</p>
            </div>
          </div>
        </div>

        {/* Contact Icons */}
        <FloatingIcons />

        {/* Add ToastContainer with custom styling */}
        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          toastStyle={{
            fontFamily: 'Poppins',
          }}
        />
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}