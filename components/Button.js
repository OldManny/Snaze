import React from 'react';

// Button component
const Button = ({ text, onClick, className }) => (
  <button
    onClick={onClick} // Handle button click
    className={`active:scale-95 px-4 py-2 text-white font-bold text-sm sm:text-base md:text-xl md:px-12 md:py-3 focus:outline-none focus:shadow-outline transition-transform duration-75 ease-in-out ${className}`}
  >
    {text} {/* Display button text */}
  </button>
);

export default Button;
