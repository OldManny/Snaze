'use client';
import React, { useState, useEffect } from 'react';

// TypingText component takes two props: text (the string to display) and speed (the typing speed in milliseconds, default is 100ms)
const TypingText = ({ text, speed = 100 }) => {
    // State to store the portion of text being displayed in the typing effect
    const [displayedText, setDisplayedText] = useState('');

    // useEffect hook to manage the typing effect animation
    useEffect(() => {
        let currentIndex = text.length; // Start typing from the end of the text
        const intervalId = setInterval(() => {
            setDisplayedText(text.slice(currentIndex)); // Update the displayed text by slicing from the current index
            currentIndex -= 1; // Decrease the current index to "type" one character at a time
            if (currentIndex < 0) {
                clearInterval(intervalId); // Stop the interval once the entire text is displayed
            }
        }, speed); // The typing speed, determining the interval time between character displays

        // Cleanup function to clear the interval when the component unmounts or when text/speed changes
        return () => clearInterval(intervalId);
    }, [text, speed]); // useEffect dependency array ensures the effect runs whenever text or speed changes

    // Render the displayed text inside a <p> element with responsive text classes
    return (
        <p className="typing-text text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">
            {displayedText}
        </p>
    );
};

export default TypingText;
