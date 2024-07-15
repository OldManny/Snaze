'use client';
import React, { useState, useEffect } from 'react';
import { useMaze } from './MazeContext';
import MazeDisplay from './MazeDisplay';
import Button from '../Button';
import WindowAlert from '../WindowAlert';

// Debounce function to limit the rate at which a function is executed
function debounce(fn, ms) {
    let timer;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            fn.apply(this, arguments);
        }, ms);
    };
}

// MazeController component to manage maze interactions and state
const MazeController = () => {
    // Destructure maze-related state and functions from the maze context
    const { maze, generateMaze, start, setStart, end, setEnd, solveMaze, setSolutionPath, algorithm, setAlgorithm, handleAnimationEnd } = useMaze();
    const [viewportSize, setViewportSize] = useState({ width: null, height: null }); // Initial state set to null

    // State for managing modal visibility and message
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    // Function to dynamically adjust maze size based on screen width and height
    const getMazeDimensions = (width, height) => {
        let cols, rows;

        // Adjust columns based on width
        if (width < 720) cols = 23; 
        else if (width < 930) cols = 45; 
        else if (width < 1024) cols = 59; 
        else if (width < 1250) cols = 65; 
        else if (width > 1540) cols = 101; 
        else cols = 79;

        // Adjust rows based on height
        if (height < 600) rows = 15;
        else if (height < 1000) rows = 25;
        else if (height < 1200) rows = 35;
        else rows = 39;

        return { rows, cols };
    };

    // useEffect to set viewport size based on window dimensions only after component mounts
    useEffect(() => {
        const updateViewportSize = () => setViewportSize({ width: window.innerWidth, height: window.innerHeight });

        updateViewportSize(); // Initial update

        const debouncedHandleResize = debounce(updateViewportSize, 100);

        window.addEventListener('resize', debouncedHandleResize);
        return () => window.removeEventListener('resize', debouncedHandleResize);
    }, []);

    // Regenerate the maze based on the current screen width and height
    useEffect(() => {
        if (viewportSize.width !== null && viewportSize.height !== null) {
            const { rows, cols } = getMazeDimensions(viewportSize.width, viewportSize.height);
            generateMaze(rows, cols);
        }
    }, [generateMaze, viewportSize]);

    // Handle point selection in the maze
    const handlePointSelect = (row, col) => {
        if (maze[row][col] !== 'P') {
            return;
        }

        if (!start) {
            setStart({ row, col });
        } else if (!end) {
            setEnd({ row, col });
        } else {
            setStart({ row, col });
            setEnd(null);
            setSolutionPath([]);
        }
    };

    // Function to show modal with a message
    const showModal = (message) => {
        setModalMessage(message);
        setIsModalOpen(true);
    };

    // Handle click on "Solve Maze" button
    const handleSolveClick = () => {
        if (!start || !end) {
            showModal("Please select the start and the end points first, as well as choosing an algorithm.");
            return;
        }
        solveMaze();
    };

    // Render MazeController component
    return (
        <div>
            <MazeDisplay onCellClick={handlePointSelect} onAnimationEnd={handleAnimationEnd} />
            <div className="flex justify-between w-full px-4 mt-16 pb-5">
                <Button
                    text="New Maze"
                    onClick={() => {
                        const { rows, cols } = getMazeDimensions(viewportSize.width, viewportSize.height);
                        generateMaze(rows, cols);
                    }}
                    className="bg-cyan-700 shadow-lg shadow-cyan-100/50 rounded-2xl hover:bg-cyan-800"
                />

                <Button
                    text="Solve Maze"
                    onClick={handleSolveClick}
                    className="bg-slate-700 shadow-lg shadow-slate-400/50 rounded-2xl hover:bg-slate-900"
                />
            </div>
            <WindowAlert isOpen={isModalOpen} message={modalMessage} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default MazeController;
