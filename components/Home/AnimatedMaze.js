'use client';
import React, { useEffect, useState } from 'react';
import { useMaze } from '../Maze/MazeContext'; 
import MazeSVG from '../Maze/MazeSVG';

const AnimatedMaze = ({ strokeWidth = 5 }) => {
    // Destructure maze-related functions and state
    const { generateMaze, maze, solveMaze, setStart, setEnd, start, end, solutionPath, setSolutionPath } = useMaze();
    
    // Local state to track the animation phase, drawn path, and whether the maze is solved
    const [animationPhase, setAnimationPhase] = useState('init');
    const [drawnPath, setDrawnPath] = useState([]);
    const [isSolved, setIsSolved] = useState(false);
    const [dimensions, setDimensions] = useState({ rows: 33, cols: 69 }); // Store maze dimensions based on screen size

    // Start a new cycle by resetting paths, points, and maze
    const startNewCycle = () => {
        setSolutionPath([]);
        setDrawnPath([]);
        setIsSolved(false);
        setStart(null);
        setEnd(null);
        generateMaze(dimensions.rows, dimensions.cols); // Generate maze with dynamic dimensions
        setAnimationPhase('init');
    };

    // Update maze dimensions based on screen size (responsive behaviour)
    const updateDimensions = () => {
        const width = window.innerWidth;
        let rows, cols;

        // Adjust rows and columns based on screen width
        if (width < 720) {
            rows = 35;
            cols = 33;
        } else {
            rows = 33;
            cols = 69;
        }

        // Set new dimensions and reset maze state
        setDimensions({ rows, cols });
        setSolutionPath([]);
        setDrawnPath([]);
        setIsSolved(false);
        setStart(null);
        setEnd(null);
        generateMaze(rows, cols);
        setAnimationPhase('init');
    };

    // Update dimensions on window resize
    useEffect(() => {
        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    }, []);

    // Set random start and end points when the maze is generated
    useEffect(() => {
        if (maze.length > 0 && maze[0].length > 0) {
            const setRandomPoints = () => {
                const rows = maze.length;
                const cols = maze[0].length;

                // Get a random point within the maze that is a valid path
                const getRandomPoint = () => {
                    let point;
                    do {
                        point = { row: Math.floor(Math.random() * rows), col: Math.floor(Math.random() * cols) };
                    } while (maze[point.row][point.col] !== 'P');
                    return point;
                };

                // Set random start and end points
                const start = getRandomPoint();
                let end;
                do {
                    end = getRandomPoint();
                } while (start.row === end.row && start.col === end.col); // Ensure start and end are not the same

                setStart(start);
                setEnd(end);
            };

            setRandomPoints();
        }
    }, [maze, setStart, setEnd]);

    // Start solving the maze when start and end points are set
    useEffect(() => {
        if (start && end && animationPhase === 'init') {
            solveMaze();
            setAnimationPhase('drawing');
        }
    }, [start, end, solveMaze, animationPhase]);

    // Handle the animation for drawing and erasing the solution path
    useEffect(() => {
        if (animationPhase === 'drawing' && solutionPath.length > 0) {
            let currentIndex = 0;
            const intervalId = setInterval(() => {
                setDrawnPath(solutionPath.slice(0, currentIndex + 1)); // Incrementally draw the path
                currentIndex += 1;
                if (currentIndex === solutionPath.length) {
                    clearInterval(intervalId);
                    setIsSolved(true); // Mark maze as solved
                    setTimeout(() => setAnimationPhase('erasing'), 2000); // Wait before erasing
                }
            }, 35);
            return () => clearInterval(intervalId);
        } else if (animationPhase === 'erasing' && solutionPath.length > 0) {
            let currentIndex = 0;
            const intervalId = setInterval(() => {
                setDrawnPath(solutionPath.slice(currentIndex)); // Incrementally erase the path
                currentIndex += 1;
                if (currentIndex === solutionPath.length) {
                    clearInterval(intervalId);
                    setTimeout(() => startNewCycle(), 2000); // Start a new cycle after erasing
                }
            }, 33);
            return () => clearInterval(intervalId);
        }
    }, [animationPhase, solutionPath]);

    // If the maze is not ready, display a loading message
    if (maze.length === 0 || maze[0].length === 0) {
        return <div>Loading maze...</div>;
    }

    // Render the MazeSVG component
    return (
        <div className="w-full h-full">
            <MazeSVG 
                drawnPath={drawnPath} 
                cellSize={10} 
                strokeWidth={strokeWidth} 
                isSolved={isSolved} 
                maze={maze} 
                start={start} 
                end={end}
                onCellClick={null}  
                onAnimationEnd={() => setAnimationPhase('done')} // Triggered when animation ends
            />
        </div>
    );
};

export default AnimatedMaze;
