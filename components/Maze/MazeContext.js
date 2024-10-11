'use client';
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { bfsSolve, dijkstraSolve, aStarSolve, dfsSolve } from './mazeAlgorithms';
import WindowAlert from '../WindowAlert';
import MazeInfo from './MazeInfo';

// Create Maze context
const MazeContext = createContext();

// Custom hook to use the Maze context
export const useMaze = () => useContext(MazeContext);

/**
 * Function to shuffle an array in place using the Fisher-Yates algorithm.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} - The shuffled array.
 */
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

/**
 * Function to add loops to a perfect maze by removing random walls.
 * This creates multiple solution paths.
 * @param {Array} maze - The maze grid represented as a 2D array.
 * @param {number} rows - Number of rows in the maze.
 * @param {number} cols - Number of columns in the maze.
 * @param {number} numberOfWallsToRemove - Number of walls to remove to create loops.
 * @returns {Array} - The maze grid with loops added.
 */
const addLoops = (maze, rows, cols, numberOfWallsToRemove) => {
    let potentialWalls = [];

    // Iterate through the maze to find potential walls to remove
    for (let y = 1; y < rows - 1; y++) {
        for (let x = 1; x < cols - 1; x++) {
            // Identify horizontal walls
            if (y % 2 === 1 && x % 2 === 0 && maze[y][x] === 'W') {
                // Check if the wall separates two path cells
                if (maze[y][x - 1] === 'P' && maze[y][x + 1] === 'P') {
                    potentialWalls.push({ row: y, col: x, direction: 'horizontal' });
                }
            }
            // Identify vertical walls
            if (y % 2 === 0 && x % 2 === 1 && maze[y][x] === 'W') {
                // Check if the wall separates two path cells
                if (maze[y - 1][x] === 'P' && maze[y + 1][x] === 'P') {
                    potentialWalls.push({ row: y, col: x, direction: 'vertical' });
                }
            }
        }
    }

    console.log(`Total potential walls for loops: ${potentialWalls.length}`);

    // Shuffle the potential walls to ensure randomness
    shuffleArray(potentialWalls);

    let wallsRemoved = 0;
    for (let wall of potentialWalls) {
        if (wallsRemoved >= numberOfWallsToRemove) break;

        const { row, col } = wall;

        // Remove the wall to create a loop
        maze[row][col] = 'P';
        wallsRemoved++;
    }

    console.log(`Total walls removed to create loops: ${wallsRemoved}`);

    return maze;
};

// MazeProvider component to provide maze-related state and functions to children components
export const MazeProvider = ({ children, showModal = true, loopFactor = 0.1 }) => {
    // State variables
    const [maze, setMaze] = useState([]);
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [solutionPath, setSolutionPath] = useState([]);
    const [algorithm, setAlgorithm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [steps, setSteps] = useState(0);
    const [modalManuallyClosed, setModalManuallyClosed] = useState(false); // State to track manual modal closure

    // useEffect to set default algorithm if showModal is false
    useEffect(() => {
        if (!showModal) {
            setAlgorithm('bfs'); // Default algorithm
        }
    }, [showModal]);

    /**
     * Function to generate a new maze with optional loops.
     * @param {number} rows - Number of rows in the maze.
     * @param {number} cols - Number of columns in the maze.
     */
    const generateMaze = useCallback((rows, cols) => {
        // Initialize maze with walls ('W')
        let newMaze = Array(rows).fill(null).map(() => Array(cols).fill('W'));

        /**
         * Recursive function to carve paths in the maze using backtracking.
         * @param {number} x - Current x-coordinate.
         * @param {number} y - Current y-coordinate.
         */
        const carvePath = (x, y) => {
            const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // Possible directions: up, right, down, left
            shuffleArray(directions); // Randomize directions to ensure maze randomness

            newMaze[y][x] = 'P'; // Mark the current cell as a path

            directions.forEach(([dx, dy]) => {
                const nx = x + dx * 2;
                const ny = y + dy * 2;
                // Check if the new position is within maze boundaries and is a wall
                if (ny > 0 && ny < rows && nx > 0 && nx < cols && newMaze[ny][nx] === 'W') {
                    newMaze[y + dy][x + dx] = 'P'; // Carve a path to the adjacent cell
                    carvePath(nx, ny); // Recursively carve paths from the new cell
                }
            });
        };

        // Start carving paths from (1,1)
        carvePath(1, 1);

        // Calculate the number of walls to remove based on loopFactor
        const totalWalls = Math.floor((rows * cols) * loopFactor);
        const mazeWithLoops = addLoops(newMaze, rows, cols, totalWalls);

        // Reset states before generating a new maze
        setStart(null);
        setEnd(null);
        setSolutionPath([]);
        setSteps(0); // Reset steps as well

        // Update the maze state with the maze containing loops
        setMaze(mazeWithLoops);
    }, [loopFactor]);

    /**
     * Function to solve the maze using the selected algorithm.
     */
    const solveMaze = useCallback(() => {
        if (!start || !end) {
            console.error("Please select a start and an end point.");
            return;
        }

        if (!algorithm) {
            if (showModal) setIsModalOpen(true);
            return;
        }

        let result = { path: [], nodesExplored: 0 };
        switch (algorithm) {
            case 'bfs':
                result = bfsSolve(maze, start, end);
                break;
            case 'dijkstra':
                result = dijkstraSolve(maze, start, end);
                break;
            case 'astar':
                result = aStarSolve(maze, start, end);
                break;
            case 'dfs':
                result = dfsSolve(maze, start, end);
                break;
            default:
                console.error("Unknown algorithm");
        }

        setSolutionPath(result.path);
        setSteps(result.nodesExplored); // Update steps to represent nodes explored

        if (result.path.length === 0) {
            console.error("No solution found.");
        } else {
            setModalManuallyClosed(false); // Reset manual close flag when solving
        }
    }, [maze, start, end, algorithm, showModal]);

    /**
     * Function to handle the end of the animation.
     */
    const handleAnimationEnd = () => {
        console.log("Animation ended");
        setTimeout(() => {
            if (showModal && !modalManuallyClosed) { // Check if the modal was manually closed
                setIsModalOpen(true);
            }
        }, 1000);
    };

    // Provide maze-related state and functions to children components
    return (
        <MazeContext.Provider value={{
            maze, setMaze, start, setStart, end, setEnd, solutionPath, setSolutionPath,
            generateMaze, // Use the maze generation function with loops
            solveMaze, setAlgorithm, handleAnimationEnd
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
                    pathLength={solutionPath.length}     // Correctly pass path length
                    nodesExplored={steps}                // Correctly pass nodes explored
                    algorithm={algorithm}
                    onClose={() => {
                        setIsModalOpen(false);
                        setModalManuallyClosed(true); // Mark modal as manually closed
                    }}
                />
            )}
        </MazeContext.Provider>
    );
}
