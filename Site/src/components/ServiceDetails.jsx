import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from './Navbar';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { FaClipboardList, FaBalanceScale, FaHandHoldingUsd, FaChartLine } from 'react-icons/fa';
import Footer from './Footer';
import FloatingIcons from './FloatingIcons';

gsap.registerPlugin(ScrollTrigger);

const sectionIcons = [
  <FaClipboardList className="text-[#136DA0] text-2xl" />,
  <FaBalanceScale className="text-[#136DA0] text-2xl" />,
  <FaHandHoldingUsd className="text-[#136DA0] text-2xl" />,
  <FaChartLine className="text-[#136DA0] text-2xl" />
];

export default function ServiceDetails() {
  const [serviceData, setServiceData] = useState(null);
  const { serviceTitle } = useParams();

  // Refs for animation targets
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const imageRef = useRef(null);
  const descriptionRef = useRef(null);
  const separatorRef = useRef(null);
  const sectionsRef = useRef(null);

  useEffect(() => {
    // Animation setup
    const setupAnimations = () => {
      // Set initial states
      gsap.set([titleRef.current, subtitleRef.current, descriptionRef.current, separatorRef.current], {
        opacity: 1,
        y: 0,
        scale: 1
      });

      if (imageRef.current) {
        gsap.set(imageRef.current, {
          opacity: 1,
          scale: 1
        });
      }

      if (sectionsRef.current?.children) {
        gsap.set(sectionsRef.current.children, {
          opacity: 1,
          y: 0
        });
      }

      // Title animation
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Subtitle animation
      gsap.fromTo(subtitleRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Image animation
      if (imageRef.current) {
        gsap.fromTo(imageRef.current,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            scrollTrigger: {
              trigger: imageRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }

      // Description animation
      gsap.fromTo(descriptionRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Separator animation
      gsap.fromTo(separatorRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: separatorRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Sections animation
      const sections = sectionsRef.current?.children;
      if (sections) {
        gsap.fromTo(sections,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
              trigger: sectionsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    };

    const fetchServiceData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'ServiceData'));
        const services = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        const service = services.find(s =>
          s.title.toLowerCase().replace(/\s+/g, '') + 'Service' === serviceTitle
        );
        setServiceData(service);

        // Initialize animations after content is loaded
        setTimeout(() => {
          setupAnimations();
        }, 100);
      } catch (error) {
        console.error('Error fetching service data:', error);
      }
    };

    fetchServiceData();
  }, [serviceTitle]);

  if (!serviceData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">Loading...</div>
      </>
    );
  }

  // Helper to render interleaved sections with icons and vertical timeline
  const renderInterleavedSections = () => {
    const subTitles = Array.isArray(serviceData.subTitles) ? serviceData.subTitles : [];
    const subData = Array.isArray(serviceData.subData) ? serviceData.subData : [];
    const maxLen = Math.max(subTitles.length, subData.length);

    // Use the same icon for every subtitle
    const subtitleIcon = <FaClipboardList className="text-[#136DA0] text-xl mr-2" />;

    return (
      <div className="flex flex-col gap-8 mt-10" ref={sectionsRef}>
        {Array.from({ length: maxLen }).map((_, idx) => (
          <div key={idx} className="flex flex-col w-full">
            {/* Subtitle as Title with Icon */}
            {subTitles[idx] && (
              <div className="bg-blue-50 border-l-4 border-[#136DA0] rounded-md p-4 shadow-sm mb-2 flex items-center">
                {subtitleIcon}
                <h3 className="text-lg font-bold text-[#136DA0] flex items-center gap-2">
                  {typeof subTitles[idx] === 'string' ? subTitles[idx] : subTitles[idx].title}
                </h3>
                {typeof subTitles[idx] === 'object' && subTitles[idx].description && (
                  <p className="text-gray-600 text-sm mt-1">{subTitles[idx].description}</p>
                )}
              </div>
            )}
            {/* SubData as Description, plain, small text */}
            {subData[idx] && (
              <div className="flex flex-col items-start px-1 py-1">
                <ul className="list-disc pl-5 mt-1 text-gray-800 text-sm space-y-1 w-full">
                  {typeof subData[idx] === 'object' && subData[idx].description
                    ? (Array.isArray(subData[idx].description)
                      ? subData[idx].description.map((desc, i) => <li key={i}>{desc}</li>)
                      : <li>{subData[idx].description}</li>)
                    : (typeof subData[idx] === 'string' && subData[idx].includes('|')
                      ? subData[idx].split('|').map((item, i) => (
                        <li key={i}>{item.trim()}</li>
                      ))
                      : <li>{subData[idx]}</li>)
                  }
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div
        id='main'
        className='h-fit w-full flex flex-col items-center justify-center p-5 pt-24 sm:pt-28 lg:pt-32 gap-5 font-[Poppins] bg-gray-50'
      >
        <Navbar />

        <div className="w-[90%] mx-auto px-2 sm:px-4 lg:px-8 py-8">
          {/* Title */}
          <div className="mb-2" ref={titleRef}>
            <h1 className="text-3xl font-bold text-[#136DA0]">
              {serviceData.title}
              <span className="text-orange-500"> &amp; </span>
              <span className="text-[#136DA0]">Related Services</span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className="mb-4" ref={subtitleRef}>
            <p className="text-lg text-gray-600">{serviceData.subtitle}</p>
          </div>
          {/* Main Image */}
          {serviceData.imageUrl && (
            <div className="flex justify-start mb-8" ref={imageRef}>
              <img
                src={serviceData.imageUrl}
                alt={serviceData.title}
                className="rounded-lg shadow max-h-72 object-cover w-full"
                style={{ maxWidth: "100%" }}
              />
            </div>
          )}
          {/* Description */}
          <div className="mb-8 text-left" ref={descriptionRef}>
            <p className="text-gray-700 leading-relaxed break-words">{serviceData.description}</p>
          </div>
          <div className="border-t border-gray-200 mb-8"></div>
          {/* Interleaved Sections */}
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
                <i className="ri-survey-fill text-lg"></i>
                Service Details
              </div>

              {/* Right line */}
              <div className="flex-grow h-px bg-[#D1E9F5]"></div>
            </div>
          </div>
          {renderInterleavedSections()}
        </div>
      </div>
      <FloatingIcons />

      <Footer /> {/* <-- Add this line to render the Footer at the bottom */}

    </>
  );
}