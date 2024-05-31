'use client';
import React, { useEffect, useState } from 'react';
import { useMaze } from '../Maze/MazeContext';
import MazeSVG from '../Maze/MazeSVG';

const AnimatedMaze = ({ strokeWidth = 5 }) => {
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
        generateMaze(33, 69);
        setAnimationPhase('init');
    };

    // Generate the initial maze on component mount
    useEffect(() => {
        generateMaze(33, 69);
    }, [generateMaze]);

    // Set random start and end points when the maze is ready
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
                    } while (maze[point.row][point.col] !== 'P'); // Ensure point is valid (e.g., 'P' might represent a path)
                    return point;
                };

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

    // Solve the maze when start and end points are set
    useEffect(() => {
        if (start && end && animationPhase === 'init') {
            solveMaze();
            setAnimationPhase('drawing');
        }
    }, [start, end, solveMaze, animationPhase]);

    // Handle the drawing and erasing animation phases
    useEffect(() => {
        if (animationPhase === 'drawing' && solutionPath.length > 0) {
            let currentIndex = 0;
            const intervalId = setInterval(() => {
                setDrawnPath(solutionPath.slice(0, currentIndex + 1));
                currentIndex += 1;
                if (currentIndex === solutionPath.length) {
                    clearInterval(intervalId);
                    setIsSolved(true);
                    setTimeout(() => setAnimationPhase('erasing'), 2000); // Pause before erasing
                }
            }, 35);
            return () => clearInterval(intervalId);
        } else if (animationPhase === 'erasing' && solutionPath.length > 0) {
            let currentIndex = 0;
            const intervalId = setInterval(() => {
                setDrawnPath(solutionPath.slice(currentIndex));
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
                onCellClick={null}  // Pass null or undefined
            />
        </div>
    );
};

export default AnimatedMaze;
