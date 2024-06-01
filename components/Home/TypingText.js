'use client';
import React, { useState, useEffect } from 'react';

// TypingText component takes two props: text (the string to display) and speed (the typing speed in milliseconds)
const TypingText = ({ text, speed = 100 }) => {
    // State to keep track of the currently displayed portion of the text
    const [displayedText, setDisplayedText] = useState('');

    // useEffect hook to handle the typing animation
    useEffect(() => {
        let currentIndex = text.length; // Start from the end of the text
        const intervalId = setInterval(() => {
            setDisplayedText(text.slice(currentIndex)); // Update the displayed text by slicing from the current index
            currentIndex -= 1; // Move to the previous character
            if (currentIndex < 0) {
                clearInterval(intervalId); // Stop the interval when all characters are displayed
            }
        }, speed); // Set the interval speed

        // Cleanup function to clear the interval when the component unmounts or text/speed changes
        return () => clearInterval(intervalId);
    }, [text, speed]);

    // Render the displayed text inside a <p> element
    return (
        <p className="typing-text text-xl">{displayedText}</p>
    );
};

export default TypingText;
