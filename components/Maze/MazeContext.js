'use client';
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { bfsSolve, dijkstraSolve, aStarSolve, dfsSolve } from './mazeAlgorithms'; 
import WindowAlert from '../WindowAlert'; 
import MazeInfo from './MazeInfo'; 

const MazeContext = createContext();

export const useMaze = () => useContext(MazeContext);

export const MazeProvider = ({ children, showModal = true }) => {
    const [maze, setMaze] = useState([]);
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [solutionPath, setSolutionPath] = useState([]);
    const [algorithm, setAlgorithm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [steps, setSteps] = useState(0);

    useEffect(() => {
        if (!showModal) {
            setAlgorithm('bfs'); 
        }
    }, [showModal]);

    const generateMaze = useCallback((rows, cols) => {
        let newMaze = Array(rows).fill(null).map(() => Array(cols).fill('W'));

        const carvePath = (x, y) => {
            const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
            directions.sort(() => Math.random() - 0.5);

            newMaze[y][x] = 'P';

            directions.forEach(([dx, dy]) => {
                const nx = x + dx * 2, ny = y + dy * 2;
                if (ny >= 0 && ny < rows && nx >= 0 && nx < cols && newMaze[ny][nx] === 'W') {
                    newMaze[y + dy][x + dx] = 'P';
                    carvePath(nx, ny);
                }
            });
        };

        setStart(null);
        setEnd(null);
        setSolutionPath([]);
        carvePath(1, 1);
        setMaze(newMaze);
    }, []);

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

    const handleAnimationEnd = () => {
        console.log("Animation ended");
        setTimeout(() => {
            if (showModal) {
                setIsModalOpen(true);
            }
        }, 500); 
    };

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
