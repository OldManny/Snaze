import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import WindowAlert from './WindowAlert';

// InfoIcon component for the a modal popup
const InfoIcon = ({ color = "text-blue-500", messageType }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

    // Handle icon click to open the modal
    const handleIconClick = () => {
        setIsModalOpen(true);
    };

    // Handle closing the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Messages for maze information
    const messages = {
        maze: `
            <div>
                <p>This maze game allows to generate and solve mazes using different algorithms. Here's how it works:</p>
                <br>
                <ul class="list-disc pl-5">
                    <li><strong>Maze Generation:</strong> Click on "New Maze" to generate a new maze. The maze is randomly generated each time using Recursive Backtracking algorithm.</li>
                    <li><strong>Select Start and End Points:</strong> Click on the maze grid to select the start and end points. The start point is marked first, followed by the end point.</li>
                    <li><strong>Choose an Algorithm:</strong> Select an algorithm from the dropdown menu to solve the maze. Available algorithms include BFS, DFS, Dijkstra, and A*.</li>
                    <li><strong>Solve the Maze:</strong> Click on "Solve Maze" to see the path from the start to the end point using the selected algorithm.</li>
                    <li><strong>Algorithm Details:</strong>
                        <ul class="list-disc pl-5">
                            <li><strong>BFS (Breadth-First Search):</strong> Explores all nodes at the present depth level before moving on to nodes at the next depth level.</li>
                            <li><strong>DFS (Depth-First Search):</strong> Explores as far as possible along each branch before backtracking.</li>
                            <li><strong>Dijkstra:</strong> Finds the shortest path between nodes in a graph.</li>
                            <li><strong>A* (A-star):</strong> An extension of Dijkstra's algorithm that uses heuristics for an improved performance.</li>
                        </ul>
                    </li>
                </ul>
            </div>
        `,
        snake: `
            <div>
                <p>The AI Snake game is fully autonomous and utilises a combination of technologies to enhance its performance:</p>
                <br>
                <ul class="list-disc pl-5">
                    <li><strong>A* Pathfinding Algorithm:</strong> The snake uses the A* algorithm to determine the shortest and safest path to the food. This ensures efficient navigation by evaluating potential paths and selecting the best one.</li>
                    <li><strong>Grid System:</strong> The game operates on a grid system, allowing precise movement and collision detection for the snake.</li>
                    <li><strong>Heuristic Function:</strong> Integral to the A* algorithm, the heuristic function estimates the cost of reaching the food, aiding in the selection of the optimal path.</li>
                    <li><strong>Flood Fill Algorithm:</strong> Used to assess the available space around the snake, this algorithm ensures safe movement by avoiding collisions with the snake's own body.</li>
                    <li><strong>Breadth-First Search (BFS):</strong> The snake employs BFS to check if it can reach its tail after making a move. This prevents the snake from getting trapped easily.</li>
                    <li><strong>Optimised Move Selection:</strong> Advanced techniques such as lookahead, escape moves, and backtracking are used to determine the best possible move.</li>
                </ul>
            </div>
        `
        };

    // Get the message
    const infoMessage = messages[messageType];

    return (
        <div className="relative">
            {/* Info icon button */}
            <button onClick={handleIconClick} className={`text-2xl ${color}`}>
                <FaInfoCircle />
            </button>
            {/* Modal for displaying information */}
            <WindowAlert 
                isOpen={isModalOpen} 
                message={infoMessage} 
                onClose={handleCloseModal} 
                className="max-w-full sm:max-w-md" // Ensure modal is responsive
            />
        </div>
    );
};

export default InfoIcon;
