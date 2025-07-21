import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function FloatingIcons() {
    const [showCopyNotification, setShowCopyNotification] = useState(false);
    const phoneNumber = '+91 8000303808';

    const handleCopyNumber = async () => {
        try {
            await navigator.clipboard.writeText(phoneNumber);
            setShowCopyNotification(true);
            setTimeout(() => setShowCopyNotification(false), 2000);
        } catch (err) {
            console.error('Failed to copy number:', err);
        }
    };

    return (
        <>
            <div className='fixed bottom-6 sm:bottom-8 right-6 sm:right-8 flex flex-col gap-3 sm:gap-4 z-13'>
                <div className='group relative'>
                    <div
                        onClick={handleCopyNumber}
                        className='w-10 sm:w-12 h-10 sm:h-12 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors shadow-lg'
                    >
                        <i className='ri-phone-fill text-xl sm:text-2xl text-[#136DA0]'></i>
                    </div>
                    <div className='absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap'>
                        <span className='text-[#136DA0] font-medium'>{phoneNumber}</span>
                    </div>
                </div>
                <div className='group relative'>
                    <div
                        onClick={handleCopyNumber}
                        className='w-10 sm:w-12 h-10 sm:h-12 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors shadow-lg'
                    >
                        <i className='ri-whatsapp-line text-xl sm:text-2xl text-[#007E00]'></i>
                    </div>
                    <div className='absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap'>
                        <span className='text-[#007E00] font-medium'>{phoneNumber}</span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showCopyNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className='fixed top-6 sm:top-8 right-6 sm:right-8 bg-[#136DA0] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50'
                    >
                        <i className='ri-checkbox-circle-fill text-xl'></i>
                        <span className='font-medium'>Number copied successfully!</span>
                    </motion.div>
                )}
            </AnimatePresence>
            <style jsx>{`
                @media (hover: none) {
                    .group:hover .group-hover\\:opacity-100 {
                        opacity: 100;
                        visibility: visible;
                    }
                }
            `}</style>
        </>
    )
}

export default FloatingIcons;