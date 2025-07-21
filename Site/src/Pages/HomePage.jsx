import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Navbar from '../components/Navbar';
import HeroBG from '../../public/HeroBG.png';
import Footer from '../components/Footer';
import Logo from '../../public/Logo.png';
import ConnectBg from '../../public/ConnectBg.png';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { db } from '../firebase'; // adjust path if needed
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import FloatingIcons from '../components/FloatingIcons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function HomePage() {
    const heroRef = useRef();
    const aboutRef = useRef();
    const servicesRef = useRef();
    const teamRef = useRef();

    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(
                    collection(db, 'ServiceData')
                );
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setServices(data);
            } catch (error) {
                console.error('Error fetching service data:', error);
            }
        };

        fetchData();
    }, []);

    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const querySnapshot = await getDocs(
                    collection(db, 'MemberData')
                );
                const membersList = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    indexNo: doc.data().indexNo || 0
                }));
                // Sort members by indexNo in ascending order
                const sortedMembers = membersList.sort((a, b) => a.indexNo - b.indexNo);
                setMembers(sortedMembers);
            } catch (error) {
                console.error('Error fetching team members:', error);
            }
        };

        fetchMembers();
    }, []);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Hero section animation
        gsap.set(heroRef.current.querySelectorAll('*'), { opacity: 0 });
        gsap.to(heroRef.current.querySelectorAll('*'), {
            opacity: 1,
            y: 0,
            duration: 0.3, // Increased speed by reducing duration
            stagger: 0.2,
            scrollTrigger: {
                trigger: heroRef.current,
                start: 'top 80%',
                toggleActions: 'play none none none',
                markers: false,
            },
        });

        // About section animation
        gsap.set(aboutRef.current.querySelectorAll('*'), { opacity: 0 });
        gsap.to(aboutRef.current.querySelectorAll('*'), {
            opacity: 1,
            x: 0,
            duration: 0.3, // Increased speed by reducing duration
            stagger: 0.1,
            scrollTrigger: {
                trigger: aboutRef.current,
                start: 'top 80%',
                toggleActions: 'play none none none',
                markers: false,
            },
        });

        // Services section animation
        gsap.set(servicesRef.current.querySelectorAll('*'), { opacity: 0 });
        gsap.to(servicesRef.current.querySelectorAll('*'), {
            opacity: 1,
            y: 0,
            duration: 0.3, // Increased speed by reducing duration
            stagger: 0.1,
            scrollTrigger: {
                trigger: servicesRef.current,
                start: 'top 80%',
                toggleActions: 'play none none none',
                markers: false,
            },
        });

        // Team section animation
        gsap.set(teamRef.current.querySelectorAll('*'), { opacity: 0 });
        gsap.to(teamRef.current.querySelectorAll('*'), {
            opacity: 1,
            x: 0,
            duration: 0.3, // Increased speed by reducing duration
            stagger: 0.1,
            scrollTrigger: {
                trigger: teamRef.current,
                start: 'top 80%',
                toggleActions: 'play none none none',
                markers: false,
            },
        });
    }, []);



    return (
        <>
            <div
                id='main'
                className='h-fit w-full flex flex-col items-center justify-center p-5 pt-24 sm:pt-28 lg:pt-32 gap-5 font-[Poppins] bg-gray-50'
            >
                <Navbar />

                <div
                    id='herosec'
                    className='relative h-[80vh] w-[100%] rounded-lg overflow-hidden shadow-lg'
                    ref={heroRef}
                >
                    <div className='absolute inset-0'>
                        <img
                            src={HeroBG}
                            alt='Hero Background'
                            className='w-full h-full object-cover'
                        />
                    </div>

                    {/* Content */}
                    <div className='relative h-full flex flex-col items-center justify-center text-white px-4'>
                        <h1 className='text-3xl sm:text-4xl md:text-5xl font-normal mb-4 text-center font-semibold drop-shadow-lg'>
                            Welcome to
                            <br />
                            BMGH & Co.LLP
                        </h1>
                        <p className='text-sm sm:text-sm md:text-sm text-center max-w-xs sm:max-w-xl md:max-w-2xl opacity-90 drop-shadow'>
                            We are committed to creating and sustaining long-term relationships which drawn on our experience and expertise to help our clients achieve real success.
                        </p>
                        <div className='absolute bottom-6 sm:bottom-8 left-6 sm:left-8'>
                            <Link to='/about'>
                                <button className='bg-white text-black px-4 py-1.5 rounded-[50px] hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm cursor-pointer shadow-md'>
                                    <span className='bg-black rounded-full w-6 h-6 flex items-center justify-center -ml-2'>
                                        <i className='ri-arrow-right-up-line text-white text-sm'></i>
                                    </span>
                                    Learn More
                                </button>
                            </Link>
                        </div>

                        {/* Contact Icons */}
                    </div>
                </div>

                <div
                    id="separator"
                    className="w-full flex items-center justify-center py-6 px-4"
                >
                    <div className="flex items-center w-full gap-4">
                        {/* Left line */}
                        <div className="flex-grow h-px bg-[#D1E9F5]"></div>

                        {/* Label container */}
                        <div className="px-4 py-2 bg-[#F0F9FF] text-[#136DA0] font-medium text-sm rounded-full shadow-sm border border-[#B5DAF0] flex items-center gap-2">
                            <i className="ri-information-line text-lg"></i>
                            About Us
                        </div>

                        {/* Right line */}
                        <div className="flex-grow h-px bg-[#D1E9F5]"></div>
                    </div>
                </div>

                <div
                    id='AboutUsMini'
                    className='relative h-fit w-[100%] rounded-lg overflow-hidden bg-white p-4 sm:p-8'
                    ref={aboutRef}
                >
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 h-full'>
                        {/* Left side - Image Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                                <img
                                    src="https://www.asitmehtaassociates.com/wp-content/uploads/2019/02/ca-firms-in-india.jpg"
                                    alt="Image 1"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-[#136DA0]/80 flex items-center justify-center">
                                    <i className="ri-team-line text-white text-4xl"></i>
                                </div>
                            </div>
                            <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                                <img
                                    src="https://www.companify.in/public/upload/More/extra-Untitled-design-%283%29.webp"
                                    alt="Image 2"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-[#136DA0]/80 flex items-center justify-center">
                                    <i className="ri-file-chart-line text-white text-4xl"></i>
                                </div>
                            </div>
                            <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                                <img
                                    src="https://cdn.dnaindia.com/sites/default/files/styles/full/public/2018/09/01/725482-ca-firm.jpg"
                                    alt="Image 3"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-[#136DA0]/80 flex items-center justify-center">
                                    <i className="ri-calculator-line text-white text-4xl"></i>
                                </div>
                            </div>
                            <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                                <img
                                    src="https://carajput.com/blog/wp-content/uploads/2025/01/Chartered-Accountancy-Firms-in-Delhi.jpg"
                                    alt="Image 4"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-[#136DA0]/80 flex items-center justify-center">
                                    <i className="ri-presentation-line text-white text-4xl"></i>
                                </div>
                            </div>
                        </div>



                        {/* Right side - Content */}
                        <div className='flex flex-col justify-center'>
                            <div className='mb-6'>
                                <img
                                    src={Logo}
                                    alt='BMGH & Co. LLP Logo'
                                    className='h-12'
                                />
                            </div>
                            <h2 className='text-3xl font-semibold text-[#136DA0] mb-4'>
                                Experience, Accuracy, and Commitment You Can
                                Trust
                            </h2>
                            <p className='text-gray-600 mb-6'>
                                At BMGH & Co. LLP, we believe in more than just
                                crunching numbers — we believe in building
                                strong financial foundations for our clients.
                                With years of experience in taxation, audit, and
                                financial consulting, our mission is to deliver
                                accurate, timely, and strategic solutions
                                tailored to your needs.
                            </p>
                            <button className='bg-[#136DA0] text-white px-6 py-2 rounded-full w-fit flex items-center gap-2 hover:bg-[#0d5a87] transition-colors'>
                                Read more
                                <i className='ri-arrow-right-line'></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    id="separator"
                    className="w-full flex items-center justify-center py-6 px-4"
                >
                    <div className="flex items-center w-full gap-4">
                        {/* Left line */}
                        <div className="flex-grow h-px bg-[#D1E9F5]"></div>

                        {/* Label container */}
                        <div className="px-4 py-2 bg-[#F0F9FF] text-[#136DA0] font-medium text-sm rounded-full shadow-sm border border-[#B5DAF0] flex items-center gap-2">
                            <i className="ri-service-fill text-lg"></i>
                            Services
                        </div>

                        {/* Right line */}
                        <div className="flex-grow h-px bg-[#D1E9F5]"></div>
                    </div>
                </div>

                <div
                    id='service'
                    className='relative h-fit w-[100%] rounded-lg overflow-hidden bg-white p-4 sm:p-8'
                    ref={servicesRef}
                >
                    <div className='flex flex-col items-center justify-center gap-6'>
                        <h2 className='text-3xl font-semibold text-[#136DA0]'>
                            SERVICES WE PROVIDE
                        </h2>
                        <p className='text-gray-600 text-center max-w-3xl'>
                            We offer a range of professional services tailored
                            to meet your needs. From innovative solutions to
                            reliable support, our goal is to help you succeed.
                        </p>

                        <div className='relative w-full'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-2 sm:px-4 md:px-12 pb-4 w-full'>
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        className='bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 w-full border border-gray-100'
                                    >
                                        <div className='h-40 sm:h-44 md:h-48 flex items-center justify-center'>
                                            {service.imageUrl ? (
                                                <img
                                                    src={service.imageUrl}
                                                    alt={service.title}
                                                    className='w-full h-full object-cover'
                                                />
                                            ) : (
                                                <i className='ri-user-3-line text-6xl sm:text-7xl text-[#136DA0]'></i>
                                            )}
                                        </div>
                                        <div className='p-4 sm:p-6 md:p-8'>
                                            <h3 className='text-xl sm:text-2xl font-semibold text-[#136DA0] mb-2 sm:mb-3'>
                                                {service.title || 'Title Missing'}
                                            </h3>
                                            <p className='text-gray-600 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6'>
                                                {(service.description || 'No description available').split(' ').slice(0, 20).join(' ')}
                                                {(service.description || '').split(' ').length > 20 ? '...' : ''}
                                            </p>
                                            <Link to={`/${service.title.toLowerCase().replace(/\s+/g, '')}Service`}>
                                                <button className='flex items-center gap-2 text-[#136DA0] hover:text-[#0d5a87] transition-colors cursor-pointer group'>
                                                    Learn More
                                                    <div className='w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#136DA0] group-hover:bg-[#0d5a87] flex items-center justify-center transition-colors'>
                                                        <i className='ri-arrow-right-line text-white'></i>
                                                    </div>
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    id="separator"
                    className="w-full flex items-center justify-center py-6 px-4"
                >
                    <div className="flex items-center w-full gap-4">
                        {/* Left line */}
                        <div className="flex-grow h-px bg-[#D1E9F5]"></div>

                        {/* Label container */}
                        <div className="px-4 py-2 bg-[#F0F9FF] text-[#136DA0] font-medium text-sm rounded-full shadow-sm border border-[#B5DAF0] flex items-center gap-2">
                            <i className="ri-group-fill text-lg"></i>
                            Our Members
                        </div>

                        {/* Right line */}
                        <div className="flex-grow h-px bg-[#D1E9F5]"></div>
                    </div>
                </div>

                <div
                    id='teammembers'
                    className='relative h-fit w-[100%] rounded-lg overflow-hidden bg-white p-4 sm:p-8'
                    ref={teamRef}
                >
                    <div className='flex flex-col items-center justify-center gap-6'>
                        <h2 className='text-3xl font-semibold text-[#136DA0]'>
                            Meet Our Experts
                        </h2>
                        <p className='text-gray-600 text-center max-w-3xl'>
                            At BMGH & Co. LLP, our strength lies in our people.
                            Our team is a dynamic blend of experienced Chartered
                            Accountants, legal advisors, financial analysts, and
                            young professionals—all committed to delivering
                            excellence.
                        </p>

                        <div className='flex flex-col items-center gap-4'>
                            <p className='text-gray-700 text-center max-w-2xl'>
                                Discover the dedicated professionals behind BMGH & Co. LLP. Our diverse team brings together expertise in taxation, auditing, and financial consulting to deliver exceptional results for our clients.
                            </p>
                            <Link to='/about' className='w-fit'>
                                <button className='bg-[#136DA0] text-white px-8 py-3 rounded-full hover:bg-[#0d5a87] transition-colors flex items-center gap-2'>
                                    Meet the Team
                                    <i className='ri-arrow-right-line'></i>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div
                    id="separator"
                    className="w-full flex items-center justify-center py-6 px-4"
                >
                    <div className="flex items-center w-full gap-4">
                        {/* Left line */}
                        <div className="flex-grow h-px bg-[#D1E9F5]"></div>

                        {/* Label container */}
                        <div className="px-4 py-2 bg-[#F0F9FF] text-[#136DA0] font-medium text-sm rounded-full shadow-sm border border-[#B5DAF0] flex items-center gap-2">
                            <i className="ri-shake-hands-fill text-lg"></i>
                            Connect with Us
                        </div>

                        {/* Right line */}
                        <div className="flex-grow h-px bg-[#D1E9F5]"></div>
                    </div>
                </div>
                <div id="connect" className="relative w-full rounded-2xl overflow-hidden">
                    {/* Background Image with Blur */}
                    <div className="absolute inset-0 z-0">
                        <img src={ConnectBg} alt="Connect Background" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-[#136DA0]/30 backdrop-blur-sm"></div>
                    </div>

                    {/* Content Card */}
                    <div className="relative z-10 px-4 sm:px-8 md:px-12 py-12 sm:py-20 flex items-center justify-center">
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 sm:p-10 max-w-2xl w-full text-center space-y-2">
                            <h2 className="text-3xl md:text-4xl font-semibold text-white">Connect With Us</h2>
                            {/* <p className="text-white/90 font-[400] text-sm tracking-[1px]">Start your journey towards a better future with us.</p> */}

                            {/* Contact Button */}
                            <div className="w-full mt-8 flex flex-col items-center gap-6">
                                <div className="text-center">
                                    <p className="text-white/80 text-lg md:text-xl font-medium italic mb-2">"Building Trust Through Excellence"</p>
                                    <p className="text-white/80 text-sm">Let's discuss how we can help you achieve your financial goals</p>
                                </div>
                                <Link to="/contactus" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                    <button className="w-full sm:w-auto px-8 py-4 bg-[#F4804E] hover:bg-[#e06c3a] text-white rounded-full font-semibold transition-all shadow-md hover:shadow-lg whitespace-nowrap flex items-center justify-center gap-2">
                                        Contact Us
                                        <i className="ri-arrow-right-line"></i>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <FloatingIcons />
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
            <Footer />
        </>
    );
}

export default HomePage;
