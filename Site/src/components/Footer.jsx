import React, { useEffect, useState } from 'react';
import Logo from "../../public/Logo.png"
import { Twitter, Facebook, Instagram, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

export default function Footer() {
    const [services, setServices] = useState([]);

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
        <div className='w-full'>
            {/* Blue top bar */}
            <div className='w-full h-1 bg-[#136DA0]'></div>

            {/* Main footer content */}
            <div className='w-full bg-white py-8 px-4 md:px-8 lg:px-16'>
                <div className='container mx-auto'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
                        {/* Column 1: Logo and intro section */}
                        <div>
                            <div className='flex items-center mb-4'>
                                <div className='flex items-center'>
                                    <img
                                        src={Logo}
                                        alt='BMGH Logo'
                                        className='h-8'
                                    />
                                </div>
                            </div>
                            <p className='text-sm mb-6'>
                                At BMGH.Co Chartered Accountants, we believe in
                                more than just crunching numbers — we believe in
                                building strong financial foundations for our
                                clients.
                            </p>

                        </div>

                        {/* Column 2: Quick Links section */}
                        <div>
                            <h3 className='text-[#136DA0] font-bold text-lg mb-4'>
                                Quick Links
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/" className="text-gray-700 hover:text-[#136DA0]" onClick={scrollToTop}>
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about" className="text-gray-700 hover:text-[#136DA0]" onClick={scrollToTop}>
                                        About Us
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/contactus" className="text-gray-700 hover:text-[#136DA0]" onClick={scrollToTop}>
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Services section */}
                        <div>
                            <h3 className='text-[#136DA0] font-bold text-lg mb-4'>
                                Services
                            </h3>
                            <ul className="space-y-2">
                                {services.map(service => (
                                    <li key={service.id}>
                                        <Link
                                            to={`/${service.title.toLowerCase().replace(/\s+/g, '')}Service`}
                                            className="text-gray-700 hover:text-[#136DA0]"
                                            onClick={scrollToTop}
                                        >
                                            {service.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 4: Office Address section */}
                        <div>
                            <h3 className='text-[#136DA0] font-bold text-lg mb-4'>
                                Office Address
                            </h3>
                            <div className='space-y-4'>
                                <div>
                                    <h4 className='font-bold mb-1'>
                                        Rajkot Branch
                                    </h4>
                                    <p className='text-sm'>
                                        Office No. 921-922, 9th Floor, RK
                                        Empire,150ft Ring Road, Near Umiya
                                        Circle,Rajkot, Gujarat – 360 004
                                    </p>
                                </div>
                                <div>
                                    <h4 className='font-bold mb-1'>
                                        Junagadh Branch
                                    </h4>
                                    <p className='text-sm'>
                                        Office No. 214, 2nd Floor, Fortune
                                        Plaza,MG Road, Junagadh – 362 001
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright section */}
            <div className='w-full py-4 border-t border-gray-200'>
                <div className='max-w-7xl mx-auto px-4'>
                    <p className='text-center text-sm text-gray-600'>
                        © 2025 BMGH&Co LLP. All Rights Reserved
                    </p>
                </div>
            </div>
        </div>
    );
}
