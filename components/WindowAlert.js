import React, { useEffect, useRef } from 'react';

// WindowAlert component takes three props: isOpen (boolean to control the visibility), message (the alert message), and onClose (function to close the alert)
const WindowAlert = ({ isOpen, message, onClose }) => {
    const modalRef = useRef(); // Initialize the ref to keep a reference to the modal element

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
    }, [isOpen, onClose, modalRef]); // Include modalRef in the dependency array

    // If the modal is not open, return null and render nothing
    if (!isOpen) return null;

    // Render the modal
    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30 flex justify-center items-center">
            <div ref={modalRef} className="bg-indigo-100 p-8 rounded-3xl shadow-xl">
                <p className='text-slate-600'>{message}</p> // Display the alert message
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-xl hover:bg-indigo-600">
                    Close
                </button>
            </div>
        </div>
    );
};


export default WindowAlert;
