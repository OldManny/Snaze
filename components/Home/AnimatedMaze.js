'use client';
import React, { useEffect, useState } from 'react';
import { useMaze } from '../Maze/MazeContext'; 
import MazeSVG from '../Maze/MazeSVG';

// The AnimatedMaze component takes an optional prop strokeWidth with a default value of 5
const AnimatedMaze = ({ strokeWidth = 5 }) => {
    // Destructure the necessary functions and state from the useMaze hook
    const { generateMaze, maze, solveMaze, setStart, setEnd, start, end, solutionPath, setSolutionPath } = useMaze();
    const [animationPhase, setAnimationPhase] = useState('init');
    const [drawnPath, setDrawnPath] = useState([]);
    const [isSolved, setIsSolved] = useState(false);

    // Function to start a new animation cycle
    const startNewCycle = () => {
        setSolutionPath([]);
        setDrawnPath([]);
        setIsSolved(false);
        setStart(null);
        setEnd(null);
        generateMaze(33, 69); // Generate a new maze with specific dimensions
        setAnimationPhase('init'); // Reset animation phase to 'init'
    };

    // useEffect to generate the initial maze when the component mounts
    useEffect(() => {
        generateMaze(33, 69);
    }, [generateMaze]);

    // useEffect to set random start and end points once the maze is ready
    useEffect(() => {
        if (maze.length > 0 && maze[0].length > 0) {
            const setRandomPoints = () => {
                const rows = maze.length;
                const cols = maze[0].length;

                // Function to get a random point in the maze
                const getRandomPoint = () => {
                    let point;
                    do {
                        point = { row: Math.floor(Math.random() * rows), col: Math.floor(Math.random() * cols) };
                    } while (maze[point.row][point.col] !== 'P'); // Ensure the point is a valid path
                    return point;
                };

                const start = getRandomPoint();
                let end;
                do {
                    end = getRandomPoint();
                } while (start.row === end.row && start.col === end.col); // Ensure start and end points are not the same

                setStart(start);
                setEnd(end);
            };

            setRandomPoints();
        }
    }, [maze, setStart, setEnd]);

    // useEffect to solve the maze once start and end points are set
    useEffect(() => {
        if (start && end && animationPhase === 'init') {
            solveMaze();
            setAnimationPhase('drawing'); // Transition to the 'drawing' phase
        }
    }, [start, end, solveMaze, animationPhase]);

    // useEffect to handle the drawing and erasing animation phases
    useEffect(() => {
        if (animationPhase === 'drawing' && solutionPath.length > 0) {
            let currentIndex = 0;
            const intervalId = setInterval(() => {
                setDrawnPath(solutionPath.slice(0, currentIndex + 1)); // Incrementally draw the solution path
                currentIndex += 1;
                if (currentIndex === solutionPath.length) {
                    clearInterval(intervalId);
                    setIsSolved(true);
                    setTimeout(() => setAnimationPhase('erasing'), 2000); // Pause before starting the erasing phase
                }
            }, 35);
            return () => clearInterval(intervalId);
        } else if (animationPhase === 'erasing' && solutionPath.length > 0) {
            let currentIndex = 0;
            const intervalId = setInterval(() => {
                setDrawnPath(solutionPath.slice(currentIndex)); // Incrementally erase the solution path
                currentIndex += 1;
                if (currentIndex === solutionPath.length) {
                    clearInterval(intervalId);
                    setTimeout(() => startNewCycle(), 2000); // Pause before starting a new cycle
                }
            }, 33);
            return () => clearInterval(intervalId);
        }
    }, [animationPhase, solutionPath, setSolutionPath]);

    // Display a loading message if the maze is not ready
    if (maze.length === 0 || maze[0].length === 0) {
        return <div>Loading maze...</div>;
    }

    // Render the MazeSVG component
    return (
        <div>
            <MazeSVG 
                drawnPath={drawnPath} 
                cellSize={10} 
                strokeWidth={strokeWidth} 
                isSolved={isSolved} 
                maze={maze} 
                start={start} 
                end={end}
                onCellClick={null}
            />
        </div>
    );
};

export default AnimatedMaze;
