'use client';
import React from 'react';
import { MazeProvider } from '/components/Maze/MazeContext'; 
import MazeController from '/components/Maze/MazeController';
import Footer from "/components/Footer/Footer";
import Navbar from '/components/Navbar/Navbar';
import InfoIcon from '@/components/Info';

// Maze component that wraps all other components inside the MazeProvider
const Maze = () => {
    return (
        <MazeProvider showModal={true} loopFactor={0.06}>
            {/* Outer wrapper with flex column and min-height to ensure full viewport height */}
            <div className="flex flex-col min-h-screen">
                
                <Navbar /> {/* Navigation bar at the top */}
                
                {/* InfoIcon positioned at the top-right corner */}
                <div className="flex items-center justify-end mr-4 mt-4">
                    <InfoIcon color="text-slate-700" messageType="maze" /> {/* InfoIcon component with custom props */}
                </div>
                
                {/* Main content area with flex-grow and centered content */}
                <main className="flex-grow flex items-center justify-center">
                    {/* Wrapper div to constrain MazeController's width and enable scrolling if necessary */}
                    <div className="w-full max-w-7xl p-4 lg:p-8">
                        <MazeController /> {/* MazeController component for controlling the maze logic */}
                    </div>
                </main>
                
                <Footer /> {/* Footer component at the bottom */}
            </div>
        </MazeProvider>
    );
}

export default Maze;
