import React, { useState, useEffect } from 'react';
import { useMaze } from './MazeContext';
import MazeSVG from './MazeSVG';

// MazeDisplay component to display the maze and its solution
const MazeDisplay = ({ onCellClick, strokeWidth = 8, onAnimationEnd }) => {
    // Destructure maze-related state and functions from the maze context
    const { maze, solutionPath, generateMaze, start, end } = useMaze();
    const cellSize = 15; // Set the size of each cell in the maze
    const [drawnPath, setDrawnPath] = useState([]); // State to track the currently drawn path
    const [currentMaze, setCurrentMaze] = useState([]); // State to track the current maze for rendering
    const [isSolved, setIsSolved] = useState(false); // State to track whether the maze is solved

    // Generate the initial maze on component mount
    useEffect(() => {
        generateMaze(33, 69); // Generate a maze with 33 rows and 69 columns
    }, [generateMaze]);

    // Smooth transition effect for displaying the maze
    useEffect(() => {
        if (maze.length > 0) {
            const timeoutId = setTimeout(() => {
                setCurrentMaze(maze);
            }, 300); // Delay to create a smooth transition
            return () => clearTimeout(timeoutId); // Cleanup timeout on unmount
        }
    }, [maze]);

    // Smooth transition effect for displaying the solution path
    useEffect(() => {
        if (solutionPath.length === 0) {
            setDrawnPath([]);
            setIsSolved(false);
            return;
        }
        if (solutionPath.length > 0) {
            const intervalId = setInterval(() => {
                setDrawnPath(currentPath => {
                    const nextIndex = currentPath.length;
                    if (nextIndex < solutionPath.length) {
                        return [...currentPath, solutionPath[nextIndex]];
                    } else {
                        clearInterval(intervalId);
                        setIsSolved(true); // Set isSolved to true when the path is fully drawn
                        if (onAnimationEnd) {
                            onAnimationEnd(); // Call onAnimationEnd callback if provided
                        }
                        return currentPath;
                    }
                });
            }, 35); // Interval for drawing the path smoothly
            return () => clearInterval(intervalId); // Cleanup interval on unmount
        }
    }, [solutionPath, onAnimationEnd]);

    // Display a loading message if the maze is not ready
    if (!currentMaze || currentMaze.length === 0 || !currentMaze[0]) {
        return <div>Loading maze...</div>;
    }

    // Render the MazeSVG component with necessary props
    return (
        <div className="maze-container">
            <MazeSVG 
                drawnPath={drawnPath} 
                cellSize={cellSize} 
                strokeWidth={strokeWidth} 
                onCellClick={onCellClick} 
                maze={currentMaze}
                start={start}
                end={end}
                isSolved={isSolved}
                onAnimationEnd={onAnimationEnd} // Pass the onAnimationEnd prop
            />
        </div>
    );
};

export default MazeDisplay;
