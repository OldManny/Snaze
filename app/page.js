'use client'; 
import React from 'react';
import Navbar from '/components/Navbar/Navbar';
import Footer from '/components/Footer/Footer';
import AnimatedMaze from '/components/Home/AnimatedMaze';
import TypingText from '/components/Home/TypingText';
import { MazeProvider } from '/components/Maze/MazeContext';

const Home = () => {
    return (
        // Wrapping the Home component with the MazeProvider
        <MazeProvider showModal={false}>
            {/* Navbar component */}
            <Navbar />
            <div className="landing-page">
                {/* Header text section */}
                <div className="header-text">
                    <h1 className="text-xl md:text-4xl font-semibold mt-28">Snaze</h1>
                </div>
                {/* Animated maze component */}
                <div className="animated-maze-container">
                    <AnimatedMaze />
                </div>
                {/* Animated text section */}
                <div className="footer-text mb-28 px-4 text-center">
                    <TypingText text="Solve mazes and play snake using algorithms." speed={10} />
                </div>
            </div>
            {/* Footer component */}
            <Footer />
        </MazeProvider>
    );
};

export default Home;
