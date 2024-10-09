import React, { useState, useEffect } from 'react';
import { useMaze } from './MazeContext';
import MazeSVG from './MazeSVG';

// MazeDisplay component to display the maze and its solution
const MazeDisplay = ({ onCellClick, strokeWidth = 8, onAnimationEnd, cellSize = 15 }) => { // Default props for strokeWidth and cellSize
    // Destructuring maze-related state and functions from the context
    const { maze, solutionPath, generateMaze, start, end } = useMaze();

    // State to store the drawn path, current maze, and whether the maze is solved
    const [drawnPath, setDrawnPath] = useState([]); 
    const [currentMaze, setCurrentMaze] = useState([]);
    const [isSolved, setIsSolved] = useState(false);

    // Effect to generate the maze with initial dimensions and cell size
    useEffect(() => {
        generateMaze(23, 15, cellSize);
    }, [generateMaze, cellSize]);

    // Effect to update the current maze state with a delay
    useEffect(() => {
        if (maze.length > 0) {
            const timeoutId = setTimeout(() => {
                setCurrentMaze(maze); // Set the current maze after a delay
            }, 300);
            return () => clearTimeout(timeoutId); // Clear the timeout when the component unmounts or maze changes
        }
    }, [maze]);

    // Effect to handle the drawing of the solution path
    useEffect(() => {
        // If no solution path exists, reset the drawn path and solved state
        if (solutionPath.length === 0) {
            setDrawnPath([]);
            setIsSolved(false);
            return;
        }
        
        // If solutionPath exists, draw it incrementally
        if (solutionPath.length > 0) {
            const intervalId = setInterval(() => {
                setDrawnPath(currentPath => {
                    const nextIndex = currentPath.length; // Get the next index in the solution path
                    if (nextIndex < solutionPath.length) {
                        return [...currentPath, solutionPath[nextIndex]]; // Add the next step to the drawn path
                    } else {
                        clearInterval(intervalId); // Clear interval when the entire path is drawn
                        setIsSolved(true); // Mark the maze as solved
                        if (onAnimationEnd) {
                            onAnimationEnd(); // Call the onAnimationEnd callback
                        }
                        return currentPath; // Return the complete path
                    }
                });
            }, 35); // Draw each step with a 35ms delay
            return () => clearInterval(intervalId); // Cleanup interval on component unmount or path change
        }
    }, [solutionPath, onAnimationEnd]);

    // If the current maze is not available, display a loading message
    if (!currentMaze || currentMaze.length === 0 || !currentMaze[0]) {
        return <div>Loading maze...</div>;
    }

    // Render the MazeSVG component to display the maze
    return (
        <div className="w-full h-full flex justify-center items-center"> {/* Center the maze in the container */}
            <MazeSVG 
                drawnPath={drawnPath} 
                cellSize={cellSize} 
                strokeWidth={strokeWidth}
                onCellClick={onCellClick} 
                maze={currentMaze} 
                start={start} 
                end={end}
                isSolved={isSolved} 
                onAnimationEnd={onAnimationEnd} 
            />
        </div>
    );
};

export default MazeDisplay;

