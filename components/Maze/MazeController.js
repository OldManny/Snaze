'use client';
import React, { useState, useEffect } from 'react';
import { useMaze } from './MazeContext';
import MazeDisplay from './MazeDisplay';
import Button from '../Button';
import WindowAlert from '../WindowAlert';

// Helper function
function debounce(fn, ms) {
    let timer;
    return () => {
        clearTimeout(timer); // Clear previous timer
        timer = setTimeout(() => {
            timer = null;
            fn.apply(this, arguments); // Call the function after the delay
        }, ms);
    };
}

const MazeController = () => {
    // Destructuring maze-related state and functions from context
    const { maze, generateMaze, start, setStart, end, setEnd, solveMaze, setSolutionPath, algorithm, setAlgorithm, handleAnimationEnd } = useMaze();
    
    // State for tracking viewport size
    const [viewportSize, setViewportSize] = useState({ width: null, height: null });

    // State for handling modal visibility and message
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    // Function to calculate maze dimensions based on the screen width and height
    const getMazeDimensions = (width, height) => {
        let cols, rows, cellSize;

        // Adjust columns, rows, and cellSize based on viewport width
        if (width < 360) { // Extra small devices
            cols = 19;
            rows = 15;
            cellSize = 10;
        } else if (width < 720) {
            cols = 31;
            rows = 21;
            cellSize = 12;
        } else if (width < 930) {
            cols = 45;
            rows = 25;
            cellSize = 15;
        } else if (width < 1024) {
            cols = 59;
            rows = 35;
            cellSize = 15;
        } else if (width < 1250) {
            cols = 65;
            rows = 35;
            cellSize = 15;
        } else if (width > 1540) {
            cols = 101;
            rows = 39;
            cellSize = 15;
        } else {
            cols = 79;
            rows = 35;
            cellSize = 15;
        }

        // Adjust rows based on viewport height
        if (height < 600) rows = 15;
        else if (height < 1000) rows = 25;
        else if (height < 1200) rows = 35;
        else rows = 39;

        return { rows, cols, cellSize }; // Return calculated dimensions
    };

    // Effect to handle viewport resizing
    useEffect(() => {
        const updateViewportSize = () => setViewportSize({ width: window.innerWidth, height: window.innerHeight });

        updateViewportSize(); // Set initial viewport size

        const debouncedHandleResize = debounce(updateViewportSize, 100); // Debounced resize handler

        window.addEventListener('resize', debouncedHandleResize); // Listen for window resize
        return () => window.removeEventListener('resize', debouncedHandleResize); // Cleanup event listener on unmount
    }, []);

    // Effect to generate maze based on updated viewport dimensions
    useEffect(() => {
        if (viewportSize.width !== null && viewportSize.height !== null) {
            const { rows, cols, cellSize } = getMazeDimensions(viewportSize.width, viewportSize.height);
            generateMaze(rows, cols, cellSize); // Generate maze with calculated dimensions
        }
    }, [generateMaze, viewportSize]);

    // Handle point selection (start and end points)
    const handlePointSelect = (row, col) => {
        if (maze[row][col] !== 'P') {
            return; // Return early if the selected cell is not a valid path
        }

        if (!start) {
            setStart({ row, col }); // Set start point
        } else if (!end) {
            setEnd({ row, col }); // Set end point
        } else {
            setStart({ row, col }); // Reset start point and clear solution path
            setEnd(null);
            setSolutionPath([]);
        }
    };

    // Function to show modal with a custom message
    const showModal = (message) => {
        setModalMessage(message);
        setIsModalOpen(true);
    };

    // Handle the maze solving process
    const handleSolveClick = () => {
        if (!start || !end) {
            showModal("Please select the start and the end points first, as well as choosing an algorithm.");
            return;
        }
        solveMaze(); // Trigger the maze solving function
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 sm:p-6 lg:p-8"> {/* Main container */}
            <MazeDisplay 
                onCellClick={handlePointSelect} // Pass point selection handler to MazeDisplay
                onAnimationEnd={handleAnimationEnd} // Pass animation end handler
                cellSize={viewportSize.cellSize} // Pass cellSize to MazeDisplay
            />
            <div className="flex justify-between w-full mt-8 space-x-4"> {/* Button container */}
                <Button
                    text="New Maze"
                    onClick={() => {
                        const { rows, cols, cellSize } = getMazeDimensions(viewportSize.width, viewportSize.height);
                        generateMaze(rows, cols, cellSize); // Generate new maze on button click
                    }}
                    className="bg-cyan-700 shadow-lg shadow-cyan-100/50 rounded-2xl hover:bg-cyan-800 px-4 py-2 flex-1 max-w-xs"
                />

                <Button
                    text="Solve Maze"
                    onClick={handleSolveClick} // Solve the maze on button click
                    className="bg-slate-700 shadow-lg shadow-slate-400/50 rounded-2xl hover:bg-slate-900 px-4 py-2 flex-1 max-w-xs"
                />
            </div>
            <WindowAlert isOpen={isModalOpen} message={modalMessage} onClose={() => setIsModalOpen(false)} /> {/* Modal for alerts */}
        </div>
    );
};

export default MazeController;
