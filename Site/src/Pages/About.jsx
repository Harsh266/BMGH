import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BG from '../../public/BG.png';
import image from '../../public/image.png';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import FloatingIcons from '../components/FloatingIcons';

export default function About() {
  const heroRef = useRef();
  const descriptionRef = useRef();
  const chooseUsRef = useRef();
  const founderRef = useRef();
  const teamRef = useRef();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero section animation
    if (heroRef.current) {
      gsap.set(heroRef.current.querySelectorAll('*'), {
        opacity: 0,
        y: 50,
      });
      gsap.to(heroRef.current.querySelectorAll('*'), {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }

    // Description section animation
    if (descriptionRef.current) {
      gsap.set(descriptionRef.current.querySelectorAll('p'), {
        opacity: 0,
        x: -50,
      });
      gsap.to(descriptionRef.current.querySelectorAll('p'), {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: descriptionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }

    // Choose Us section animation
    if (chooseUsRef.current) {
      gsap.set(
        chooseUsRef.current.querySelectorAll('h2, p, div.grid > div'),
        { opacity: 0, y: 50 }
      );
      gsap.to(
        chooseUsRef.current.querySelectorAll('h2, p, div.grid > div'),
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: chooseUsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // Founder section animation
    if (founderRef.current) {
      gsap.set(
        founderRef.current.querySelectorAll(
          'div.rounded-xl, div.w-full > *'
        ),
        {
          opacity: 0,
          x: 50,
          immediateRender: true,
        }
      );
      gsap.to(
        founderRef.current.querySelectorAll(
          'div.rounded-xl, div.w-full > *'
        ),
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: founderRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
            markers: false,
          },
        }
      );
    }

    // Team section animation
    if (teamRef.current) {
      gsap.set(
        teamRef.current.querySelectorAll(
          'h2, p, div.overflow-x-auto > div'
        ),
        {
          opacity: 0,
          y: 50,
          immediateRender: true,
        }
      );
      gsap.to(
        teamRef.current.querySelectorAll(
          'h2, p, div.overflow-x-auto > div'
        ),
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: teamRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
            markers: false,
          },
        }
      );
    }
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


  return (
    <>
      <div className='max-w-screen mx-auto relative p-5 pt-24 sm:pt-28 lg:pt-32 font-[Poppins] gap-5 flex flex-col'>
        <Navbar />


        <div
          id='herosec'
          ref={heroRef}
          className='relative h-[90%] w-full rounded-lg overflow-hidden'
        >
          <div className='absolute inset-0'>
            <img
              src={BG}
              alt='Hero Background'
              className='w-full h-full object-cover'
            />
          </div>

          {/* Content */}
          <div className='relative h-full flex flex-col items-center justify-center text-white px-6 sm:px-10 md:px-20 py-20 text-center'>
            <h1 className='text-3xl sm:text-4xl md:text-5xl font-normal mb-4 font-semibold drop-shadow-lg'>
              About{' '}
              <span className='underline'>
                BMGH <span className='text-[#EB7E37]'>&</span>{' '}
                Co.
              </span>
            </h1>
            <p className='text-sm sm:text-base md:text-lg max-w-xs sm:max-w-xl md:max-w-2xl opacity-90 drop-shadow px-4 sm:px-6 md:px-8'>
              CAs turn numbers into trust and strategy.
            </p>
          </div>
        </div>

        {/* Company Description */}
        <div className='px-0 mb-6' ref={descriptionRef}>
          <p className='text-lg font-semibold my-6 text-gray-700 leading-relaxed'>
            BMGH & Co., a Chartered Accountant firm, founded in 01st
            January 2025, by CA Bhavin Bhadra with the enthusiasm of
            providing the best consultancy and proficiency. We are a
            dedicated firm striving to add value to the business of
            its clients. The firm has evolved over the time and has
            a specialization in the field of direct and indirect
            taxation, Audits, startup recognitions, company
            formations, tax litigation, Business Restructuring,
            Corporate and Individual Tax Planning, Company law
            matters across a range of different sectors.
          </p>
          <p className='text-lg font-semibold my-6 text-gray-700 leading-relaxed'>
            The firm is having its Registered Office in Rajkot and
            Junagadh, Gujarat, India with a handful strength of
            expert professionals and consultants in the respective
            fields to provide its clients with end to end solution.
          </p>
          <p className='text-lg font-semibold my-8 text-gray-700 leading-relaxed'>
            Our vast base of clients are associated with us due to
            our professional ethics, quality service, core
            competency, and clients relationships. We provide
            professional and research based business solutions
            through a team of high caliber & ethical individuals. We
            strive to be the leaders in the industry through our
            creativity and vision, our ability to see the endless
            opportunities, our abilities to determine the unsolved
            and our ability to adopt & accept changes. We believe in
            "The way to get started is to quit talking and begin
            doing".
          </p>
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
              <i className="ri-cursor-fill text-lg"></i>
              Choose Us
            </div>

            {/* Right line */}
            <div className="flex-grow h-px bg-[#D1E9F5]"></div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className='max-w-6xl mx-auto px-4 py-12' ref={chooseUsRef}>
          {/* Heading */}
          <h2 className='text-4xl font-bold text-center text-[#136DA0] mb-6'>
            <span className='border-b-2 border-[#136DA0]'>
              Why to Choose Us
            </span>
          </h2>

          {/* Subheading */}
          <p className='text-center text-lg mb-12 px-4 max-w-4xl mx-auto'>
            We, take pride in being part of an institution committed
            to excellence. We try to excel in whatever we do.
          </p>

          {/* Three Boxes */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8'>
            {/* Vision Box */}
            <div className='rounded-lg border border-[#136DA0] p-6 shadow-md'>
              <h3 className='text-2xl font-bold text-[#136DA0] mb-4'>
                Our Vision
              </h3>
              <p className='text-gray-700'>
                To meet our clients expectation by being the
                most respected professional firm by catering
                them with the highest quality of services.
              </p>
            </div>

            {/* Values Box */}
            <div className='rounded-lg border border-[#136DA0] p-6 shadow-md'>
              <h3 className='text-2xl font-bold text-[#136DA0] mb-4'>
                Our Values
              </h3>
              <p className='text-gray-700'>
                Success today is essentially dependent upon
                providing clients with innovative solutions to
                achieve their goals.
              </p>
            </div>

            {/* Excellence Box */}
            <div className='rounded-lg border border-[#136DA0] p-6 shadow-md'>
              <h3 className='text-2xl font-bold text-[#136DA0] mb-4'>
                Excellence in Professional
              </h3>
              <p className='text-gray-700'>
                We, take pride in being part of an institution
                committed to excellence. We try to excel in
                whatever we do.
              </p>
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
              Our Members
            </div>

            {/* Right line */}
            <div className="flex-grow h-px bg-[#D1E9F5]"></div>
          </div>
        </div>


        {/* Big Layout Members */}
        <div className='max-w-6xl mx-auto px-4 py-12 bg-white rounded-lg' ref={founderRef}>
          <h2 className='text-4xl font-bold text-center text-[#136DA0] mb-6'>
            <span className='border-b-2 border-[#136DA0]'>
              Meet Our Experts
            </span>
          </h2>

          {/* Subheading */}
          <p className='text-center text-lg mb-12 px-4 max-w-4xl mx-auto'>
            At BMGH & Co. LLP, our strength lies in our people. Our team is a dynamic blend of experienced Chartered Accountants, legal advisors, financial analysts, and young professionals—all committed to delivering excellence.
          </p>
          {members
            .filter(member => member.layout === 'big')
            .map((member, index) => (
              <div key={index} className='flex flex-col md:flex-row gap-8 mb-12 hover:bg-gray-50 p-6 rounded-xl transition-all duration-300'>
                {/* Member Image - Left Side */}
                <div className='w-full md:w-1/2 lg:w-2/5'>
                  <div className='rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-[1.02] bg-gradient-to-br from-[#136DA0]/5 to-[#136DA0]/10 relative'>
                    {member.url ? (
                      <img
                        src={member.url}
                        alt={member.name || 'Member'}
                        className='w-full h-full object-cover aspect-[3/4]'
                      />
                    ) : (
                      <div className='w-full h-full aspect-[3/4] flex items-center justify-center'>
                        <i className='ri-user-3-line text-6xl text-[#136DA0]/30'></i>
                      </div>
                    )}
                    {/* <div className='absolute top-2 left-2 bg-[#136DA0] text-white px-2 py-1 rounded-md text-sm'>
                      #{member.indexNo}
                    </div> */}
                  </div>
                </div>

                {/* Member Details - Right Side */}
                <div className='w-full md:w-1/2 lg:w-3/5 flex flex-col justify-center'>
                  <h3 className='text-lg font-medium text-[#136DA0] mb-2'>
                    <span className='border-b-2 border-[#136DA0]'>
                      {member.position || 'Not Defined'}
                    </span>
                  </h3>

                  <h2 className='text-3xl font-bold text-gray-800 mb-3'>
                    {member.name || 'No Name'}
                  </h2>
                  <p className='text-gray-600 mb-4 text-lg'>
                    {member.qualification || 'No Data'}
                  </p>

                  <div className='bg-[#F0F9FF] text-[#136DA0] px-4 py-2 rounded-lg inline-block w-fit mb-6'>
                    <span className='font-semibold'>{member.experience || 'No Data'}</span>
                    <span className='ml-1'>Years of Experience</span>
                  </div>

                  <div className='space-y-4 text-gray-700 leading-relaxed'>
                    <p className='text-lg'>{member.description || 'No description available.'}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Cards Layout Members */}
        <div
          id='teammembers'
          className='relative h-fit w-[100%] rounded-lg overflow-hidden bg-white p-8'
          ref={teamRef}
        >
          <div className='flex flex-col items-center justify-center gap-6'>
            <div className='relative w-full'>


              {/* Card layout members */}
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-2 sm:px-4 md:px-12 pb-4 w-full'>
                {members
                  .filter(member => member.layout !== 'big')
                  .map((member, index) => (
                    <div
                      key={index}
                      className='bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow max-w-[300px] shrink-0 snap-start'
                    >
                      <div className='aspect-[4/3] bg-gradient-to-br from-[#136DA0]/10 to-[#136DA0]/5 flex items-center justify-center relative'>
                        {member.url ? (
                          <img
                            src={member.url}
                            alt={member.name || 'Member'}
                            className='w-full h-full object-cover object-top'
                          />
                        ) : (
                          <i className='ri-user-3-line text-6xl text-[#136DA0]/30'></i>
                        )}
                        {/* <div className='absolute top-2 left-2 bg-[#136DA0] text-white px-2 py-1 rounded-md text-sm'>
                          #{member.indexNo}
                        </div> */}
                      </div>
                      <div className='p-6'>
                        <h3 className='text-xl font-semibold text-[#136DA0]'>
                          {member.name || 'No Name'}
                        </h3>
                        <p className='text-gray-600 mt-2 font-semibold'>
                          {member.experience || 'No Data'} <span className='font-[400]'>+ Years of Experience</span>
                        </p>
                        <p className='text-gray-600 mt-2'>
                          {member.qualification || 'No Data'}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <FloatingIcons />
      </div>
      <Footer />
    </>
  );
}
