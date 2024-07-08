'use client';
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { bfsSolve, dijkstraSolve, aStarSolve, dfsSolve } from './mazeAlgorithms';
import WindowAlert from '../WindowAlert';
import MazeInfo from './MazeInfo';

// Create Maze context
const MazeContext = createContext();

// Custom hook to use the Maze context
export const useMaze = () => useContext(MazeContext);

// MazeProvider component to provide maze-related state and functions to children components
export const MazeProvider = ({ children, showModal = true }) => {
    // State variables
    const [maze, setMaze] = useState([]);
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [solutionPath, setSolutionPath] = useState([]);
    const [algorithm, setAlgorithm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [steps, setSteps] = useState(0);

    // useEffect to set default algorithm if showModal is false
    useEffect(() => {
        if (!showModal) {
            setAlgorithm('bfs'); // Default algorithm
        }
    }, [showModal]);

    // Function to generate a new maze
    const generateMaze = useCallback((rows, cols) => {
        let newMaze = Array(rows).fill(null).map(() => Array(cols).fill('W')); // Initialize maze with walls

        // Recursive function to carve paths in the maze
        const carvePath = (x, y) => {
            const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // Possible directions to move
            directions.sort(() => Math.random() - 0.5); // Randomize directions

            newMaze[y][x] = 'P'; // Mark the current cell as a path

            directions.forEach(([dx, dy]) => {
                const nx = x + dx * 2, ny = y + dy * 2;
                if (ny >= 0 && ny < rows && nx >= 0 && nx < cols && newMaze[ny][nx] === 'W') {
                    newMaze[y + dy][x + dx] = 'P'; // Carve a path
                    carvePath(nx, ny); // Recursively carve paths
                }
            });
        };

        // Reset states before generating a new maze
        setStart(null);
        setEnd(null);
        setSolutionPath([]);
        carvePath(1, 1); // Start carving from (1,1)
        setMaze(newMaze);
    }, []);

    // Function to solve the maze using the selected algorithm
    const solveMaze = useCallback(() => {
        if (!start || !end) {
            console.error("Please select a start and an end point.");
            return;
        }

        if (!algorithm) {
            if (showModal) setIsModalOpen(true);
            return;
        }

        console.log(`Solving maze using: ${algorithm}`); 

        let path = [];
        switch (algorithm) {
            case 'bfs':
                path = bfsSolve(maze, start, end);
                break;
            case 'dijkstra':
                path = dijkstraSolve(maze, start, end);
                break;
            case 'astar':
                path = aStarSolve(maze, start, end);
                break;
            case 'dfs':
                path = dfsSolve(maze, start, end);
                break;
            default:
                console.error("Unknown algorithm");
        }

        setSolutionPath(path);
        setSteps(path.length); 

        if (path.length === 0) {
            console.error("No solution found.");
        } else {
            console.log(`Solution path (${path.length} steps):`, path); 
        }
    }, [maze, start, end, algorithm, showModal]);

    // Function to handle the end of the animation
    const handleAnimationEnd = () => {
        console.log("Animation ended");
        setTimeout(() => {
            if (showModal) {
                setIsModalOpen(true);
            }
        }, 500); 
    };

    // Provide maze-related state and functions to children components
    return (
        <MazeContext.Provider value={{
            maze, setMaze, start, setStart, end, setEnd, solutionPath, setSolutionPath, generateMaze, solveMaze, setAlgorithm, handleAnimationEnd
        }}>
            {children}
            {showModal && (
                <WindowAlert 
                    isOpen={isModalOpen && !solutionPath.length} 
                    message="Please choose an algorithm to solve the maze." 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
            {showModal && (
                <MazeInfo
                    isOpen={isModalOpen && !!solutionPath.length}
                    steps={steps}
                    algorithm={algorithm}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </MazeContext.Provider>
    );
}
