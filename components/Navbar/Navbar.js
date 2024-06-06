'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useMaze } from '../Maze/MazeContext'; 
import Link from 'next/link';
import SIcon from '../SIcon';

const Navbar = () => {
  // State to manage dropdown open/close status, selected algorithm, and page identification
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
  const [isHomePage, setIsHomePage] = useState(false);
  const [isMazePage, setIsMazePage] = useState(false);

  // Destructure setAlgorithm function from the Maze context
  let setAlgorithm;
  try {
    ({ setAlgorithm } = useMaze());
  } catch (error) {
    setAlgorithm = null; // Fallback if useMaze hook is not available
  }

  // Reference to store the timeout ID
  const closeTimeoutRef = useRef(); 

  // Set page-specific state variables
  useEffect(() => {
    const pathname = window.location.pathname;
    setIsHomePage(pathname === '/');
    setIsMazePage(pathname === '/maze');
  }, []);

  // Handle algorithm selection change
  const handleAlgorithmChange = (algorithm, event) => {
    event.preventDefault();
    event.stopPropagation();
    if (setAlgorithm) {
      setAlgorithm(algorithm); // Set the selected algorithm
    }
    setSelectedAlgorithm(algorithm); // Update the local state with the selected algorithm
    setIsOpen(false); // Close the dropdown menu
  };

  // Get the display name for the current algorithm
  const getAlgorithmDisplayName = (algorithm) => {
    switch (algorithm) {
      case 'bfs':
        return 'Breadth-First Search (BFS)';
      case 'dfs':
        return 'Depth-First Search (DFS)';
      case 'dijkstra':
        return "Dijkstra's Algorithm";
      case 'astar':
        return 'A* Algorithm';
      default:
        return 'Choose Algorithm';
    }
  };

  // Toggle the dropdown menu on hoovering over the button
  const toggleDropdownOnHover = () => {
    clearTimeout(closeTimeoutRef.current); // Clear any existing timeout to prevent closing
    setIsOpen(true);
  };

  // Close the dropdown menu with a delay on mouse leave
  const closeDropdownOnLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  // Render the Navbar component
  return (
    <div className="header w-full flex justify-between items-center px-2 py-4 md:px-20 md:py-10">
      <div className="text-xl font-bold">
        <Link href="/">
          <SIcon className="" /> {/* Link to the homepage with the SIcon component */}
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {/* Conditionally render the algorithm dropdown if on the maze page */}
        {isMazePage && (
          <div className="relative dropdown-menu" onMouseLeave={closeDropdownOnLeave}>
            <button
              onMouseEnter={toggleDropdownOnHover}
              className="px-4 py-3 transition-transform duration-150 ease-in-out text-lg font-semibold"
            >
              {getAlgorithmDisplayName(selectedAlgorithm)}
            </button>
            {/* Conditionally render the dropdown menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-700 text-white py-2 rounded-2xl shadow-xl" onMouseEnter={toggleDropdownOnHover} onMouseLeave={closeDropdownOnLeave}>
                <ul>
                  {/* List of algorithm options */}
                  <li
                    className="px-4 py-2 mx-2 rounded-lg hover:bg-slate-800 cursor-pointer"
                    onClick={(event) => handleAlgorithmChange('bfs', event)}
                  >
                    Breadth-First Search (BFS)
                  </li>
                  <li
                    className="px-4 py-2 mx-2 rounded-lg hover:bg-slate-800 cursor-pointer"
                    onClick={(event) => handleAlgorithmChange('dfs', event)}
                  >
                    Depth-First Search (DFS)
                  </li>
                  <li
                    className="px-4 py-2 mx-2 rounded-lg hover:bg-slate-800 cursor-pointer"
                    onClick={(event) => handleAlgorithmChange('dijkstra', event)}
                  >
                    Dijkstra's Algorithm
                  </li>
                  <li
                    className="px-4 py-2 mx-2 rounded-lg hover:bg-slate-800 cursor-pointer"
                    onClick={(event) => handleAlgorithmChange('astar', event)}
                  >
                    A* Algorithm
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
        {/* Navigation links */}
        <Link href="/maze" className="px-4 py-3 text-lg font-semibold">Maze</Link>
        <Link href="/snake" className="px-4 py-3 text-lg font-semibold">Snake</Link>
      </div>
    </div>
  );
};

export default Navbar;
