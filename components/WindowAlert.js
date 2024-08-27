import React, { useEffect, useRef } from 'react';

// WindowAlert component
const WindowAlert = ({ isOpen, message, onClose }) => {
    const modalRef = useRef(null); // Initialize the ref to keep a reference to the modal element

    // useEffect hook to handle clicks outside the modal
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose(); // Close the modal if the click is outside the modal element
            }
        };

        if (isOpen) {
            window.addEventListener('mousedown', handleOutsideClick); // Add event listener when the modal is open
        }

        return () => {
            window.removeEventListener('mousedown', handleOutsideClick); // Clean up the event listener when the component unmounts or isOpen changes
        };
    }, [isOpen, onClose]);

    // Render the modal
    return (
        <div 
            className={`fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30 flex justify-center items-center px-4 transition-opacity duration-500 
            ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}> {/* Handle fade in/out transitions based on isOpen */}
            <div 
                ref={modalRef} 
                className={`bg-indigo-100 p-4 sm:p-8 rounded-3xl shadow-xl max-w-full sm:max-w-4xl mx-auto transform transition-transform duration-500 
                ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}> {/* Handle slide up/down transitions based on isOpen */}
                <div 
                    className='text-slate-600 text-sm sm:text-base py-4' 
                    dangerouslySetInnerHTML={{ __html: message }} /> {/* Render the alert message with potential HTML content */}
                <button 
                    onClick={onClose} 
                    className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-xl hover:bg-indigo-600"> {/* Button to close the modal */}
                    Close
                </button>
            </div>
        </div>
    );
};

export default WindowAlert;
