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
        <MazeProvider showModal={true}> {/* MazeProvider context with showModal prop set to true */}
            <Navbar /> {/* Navigation bar at the top */}
            <div className="flex items-center justify-end mr-4 mt-4"> {/* Flex container to align InfoIcon */}
                <InfoIcon color="text-slate-700" messageType="maze" /> {/* InfoIcon component with custom props */}
            </div>
            <main className="flex-grow flex items-center justify-center"> {/* Main content area centered horizontally and vertically */}
                <MazeController /> {/* MazeController component for controlling the maze logic */}
            </main>
            <Footer /> {/* Footer component at the bottom */}
        </MazeProvider>
    );
}

export default Maze;
