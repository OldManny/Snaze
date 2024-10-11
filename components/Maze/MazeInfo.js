import React, { useEffect, useRef } from 'react';

// MazeInfo component displays modal information about the current maze algorithm and steps
const MazeInfo = ({ isOpen, onClose, pathLength, nodesExplored, algorithm }) => {
    const modalRef = useRef(null); // Ref to detect clicks outside the modal

    // Helper function to format algorithm names for display
    const formatAlgorithmName = (algo) => {
        switch (algo) {
            case 'bfs':
                return 'BFS'; // Breadth-First Search
            case 'dfs':
                return 'DFS'; // Depth-First Search
            case 'dijkstra':
                return 'Dijkstra'; // Dijkstra's Algorithm
            case 'astar':
                return 'A*'; // A* Algorithm
            default:
                return algo; // Fallback for unknown algorithms
        }
    };

    // Function to return a description of the selected algorithm
    const getAlgorithmDescription = (algorithm) => {
        switch (algorithm) {
            case 'bfs':
                return "Explores all nodes at the present depth level before moving on to nodes at the next depth one.";
            case 'dfs':
                return "Explores as far as possible along each branch before backtracking.";
            case 'dijkstra':
                return "Finds the shortest path between nodes in a weighted graph.";
            case 'astar':
                return "This algorithm is an extension of Dijkstra's algorithm which uses heuristics to improve its performance.";
            default:
                return "Unknown algorithm."; // Fallback description
        }
    };

    // Function to return comparative analysis of the algorithm's performance
    const getComparativeAnalysis = (algo) => {
        switch (algo) {
            case 'bfs':
                return "BFS is efficient for finding the shortest path in unweighted graphs but can be slow on large graphs.";
            case 'dfs':
                return "DFS is less efficient for finding shortest paths but is useful for pathfinding in deep graphs.";
            case 'dijkstra':
                return "Dijkstra is efficient, but A* can be faster with heuristics.";
            case 'astar':
                return "A* is typically faster than Dijkstra due to its heuristic but requires more memory.";
            default:
                return ""; // No comparative analysis available for unknown algorithms
        }
    };

    // Function to return real-world applications of the selected algorithm
    const getRealLifeApplications = (algorithm) => {
        switch (algorithm) {
            case 'bfs':
                return "Is used in social networking sites, GPS navigation systems, and web crawlers.";
            case 'dfs':
                return "Is used in scheduling, solving puzzles, and exploring mazes.";
            case 'dijkstra':
                return "Is used in network routing protocols, geographical maps, and robotics.";
            case 'astar':
                return "Is used in video games, pathfinding in maps, and artificial intelligence.";
            default:
                return "Unknown algorithm."; // Fallback for unknown algorithms
        }
    };

    // Effect to handle closing the modal if a click is detected outside the modal
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose(); // Close modal if click is outside
            }
        };

        if (isOpen) {
            window.addEventListener('mousedown', handleOutsideClick); // Add event listener when modal is open
        }

        return () => {
            window.removeEventListener('mousedown', handleOutsideClick); // Cleanup when modal closes
        };
    }, [isOpen, onClose]);

    // JSX structure of the modal
    return (
        <div className={`fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30 flex justify-center items-center px-4 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}> {/* Modal background */}
            <div ref={modalRef} className={`bg-indigo-100 p-4 sm:p-8 rounded-3xl shadow-xl max-w-full sm:max-w-4xl mx-auto transform transition-transform duration-500 ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}> {/* Modal content */}
                <div className="text-slate-600 text-sm sm:text-base py-4"> {/* Text content inside modal */}
                    <p><strong>Algorithm:</strong> {formatAlgorithmName(algorithm)}</p>
                    <p><strong>Path Length:</strong> {pathLength}</p>
                    <p><strong>Nodes Explored:</strong> {nodesExplored}</p>
                    <p><strong>Description:</strong> {getAlgorithmDescription(algorithm)}</p>
                    <p><strong>Analysis:</strong> {getComparativeAnalysis(algorithm)}</p>
                    <p><strong>Real-Life Applications:</strong> {getRealLifeApplications(algorithm)}</p>
                </div>
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-xl hover:bg-indigo-600"> {/* Close button */}
                    Close
                </button>
            </div>
        </div>
    );
};

export default MazeInfo;
