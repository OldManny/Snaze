import React, { useEffect, useRef } from 'react';

// MazeInfo component to display algorithm information in a modal
const MazeInfo = ({ isOpen, onClose, steps, algorithm }) => {
    const modalRef = useRef(null); // Reference for the modal element

    // Function to format the algorithm name for display
    const formatAlgorithmName = (algo) => {
        switch (algo) {
            case 'bfs':
                return 'BFS';
            case 'dfs':
                return 'DFS';
            case 'dijkstra':
                return 'Dijkstra';
            case 'astar':
                return 'A*';
            default:
                return algo;
        }
    };

    // Function to get the description of the algorithm
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
                return "Unknown algorithm.";
        }
    };

    // Function to get the comparative analysis of the algorithm
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
                return "";
        }
    };

    // Function to get real-life applications of the algorithm
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
                return "Unknown algorithm.";
        }
    };

    // useEffect hook to handle clicks outside the modal to close it
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose(); // Close the modal if the click is outside the modal element
            }
        };

        if (isOpen) {
            window.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            window.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, onClose]);

    // Render the modal
    return (
        <div className={`fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30 flex justify-center items-center px-4 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div ref={modalRef} className={`bg-indigo-100 p-4 sm:p-8 rounded-3xl shadow-xl max-w-full sm:max-w-4xl mx-auto transform transition-transform duration-500 ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
                <div className="text-slate-600 text-sm sm:text-base py-4">
                    <p><strong>Algorithm:</strong> {formatAlgorithmName(algorithm)}</p>
                    <p><strong>Steps:</strong> {steps}</p>
                    <p><strong>Description:</strong> {getAlgorithmDescription(algorithm)}</p>
                    <p><strong>Analysis:</strong> {getComparativeAnalysis(algorithm)}</p>
                    <p><strong>Real-Life Applications:</strong> {getRealLifeApplications(algorithm)}</p>
                </div>
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-xl hover:bg-indigo-600">
                    Close
                </button>
            </div>
        </div>
    );
};

export default MazeInfo;
