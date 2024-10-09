import React, { useEffect, useRef } from 'react';

// WindowAlert component for displaying modal alerts
const WindowAlert = ({ isOpen, message, onClose }) => {
    const modalRef = useRef(null); // Reference to the modal element to detect outside clicks

    // Effect to handle closing the modal when clicking outside of it
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose(); // Call the onClose function when clicking outside the modal
            }
        };

        // Add event listener to detect clicks outside the modal when it is open
        if (isOpen) {
            window.addEventListener('mousedown', handleOutsideClick);
        }

        // Cleanup the event listener when the modal is closed or component is unmounted
        return () => {
            window.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, onClose]);

    // Return the modal structure
    return (
        <div 
            className={`fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30 flex justify-center items-center px-4 transition-opacity duration-500 
            ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}> {/* Modal background with transition */}
            <div 
                ref={modalRef} 
                className={`bg-indigo-100 p-4 sm:p-8 rounded-3xl shadow-xl max-w-full sm:max-w-4xl mx-auto transform transition-transform duration-500 
                ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}> {/* Modal content with transition */}
                <div 
                    className='text-slate-600 text-xs md:text-base py-4' 
                    dangerouslySetInnerHTML={{ __html: message }} /> {/* Display the message with support for HTML */}
                <button 
                    onClick={onClose} 
                    className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-xl hover:bg-indigo-600"> {/* Close button */}
                    Close
                </button>
            </div>
        </div>
    );
};

export default WindowAlert;