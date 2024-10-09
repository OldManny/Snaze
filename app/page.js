'use client';
import React from 'react';
import Navbar from '/components/Navbar/Navbar';
import Footer from '/components/Footer/Footer';
import AnimatedMaze from '/components/Home/AnimatedMaze';
import TypingText from '/components/Home/TypingText';
import { MazeProvider } from '/components/Maze/MazeContext';

const Home = () => {
    return (
        <MazeProvider showModal={false}>
            <Navbar />
            <div className="landing-page flex flex-col items-center justify-center flex-grow w-full h-full p-4 sm:p-6 lg:p-8 space-y-12">
                {/* Header text section */}
                <div className="header-text text-center pt-2 md:pt-12">
                    <h1 className="text-3xl md:text-5xl font-bold">Snaze</h1>
                </div>
                {/* Animated maze component */}
                <div className="w-full max-w-3xl flex-grow flex justify-center items-center py-1 px-10 lg:p-8">
                    <AnimatedMaze />
                </div>
                {/* Animated text section */}
                <div className="pb-12 md:pb-28 text-center">
                    <TypingText text="Solve mazes and play snake using algorithms." speed={10} />
                </div>
            </div>
            <Footer />
        </MazeProvider>
    );
};

export default Home;
