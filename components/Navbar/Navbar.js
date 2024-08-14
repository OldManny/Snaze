'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useMaze } from '../Maze/MazeContext'; 
import Link from 'next/link';
import SIcon from '../SIcon';

const Navbar = () => {
    // State variables for managing dropdowns and mobile menu
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
    const [isHomePage, setIsHomePage] = useState(false);
    const [isMazePage, setIsMazePage] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAlgorithmDropdownOpen, setIsAlgorithmDropdownOpen] = useState(false);
    
    // Get the setAlgorithm function from the MazeContext
    let setAlgorithm;
    try {
        ({ setAlgorithm } = useMaze());
    } catch (error) {
        setAlgorithm = null;
    }

    // Refs for handling dropdown timeouts and mobile menu clicks
    const closeTimeoutRef = useRef(); 
    const mobileMenuRef = useRef();

    // Check if the current page is the home page or maze page
    useEffect(() => {
        const pathname = window.location.pathname;
        setIsHomePage(pathname === '/');
        setIsMazePage(pathname === '/maze');
    }, []);

    // Handle algorithm selection
    const handleAlgorithmChange = (algorithm, event) => {
        event.preventDefault();
        event.stopPropagation();
        if (setAlgorithm) {
        setAlgorithm(algorithm);
        }
        setSelectedAlgorithm(algorithm);
        setIsAlgorithmDropdownOpen(false);
    };

    // Handle algorithm selection
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

    // Handle dropdown visibility
    const toggleDropdownOnHover = () => {
        clearTimeout(closeTimeoutRef.current);
        setIsOpen(true);
    };

    // Close dropdown with delay
    const closeDropdownOnLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
        }, 200);
    };

    // Handle mobile menu visibility
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        if (!isMobileMenuOpen) {
        setIsAlgorithmDropdownOpen(false); // Close the algorithm dropdown if the mobile menu is closed
        }
    };

    // Handle clicks outside the mobile menu
    const handleOutsideClick = (event) => {
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
        setIsAlgorithmDropdownOpen(false);
        }
    };

    // Effect to add and remove event listener for outside clicks
    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <div className="header w-full flex justify-between items-center px-6 py-4 md:py-6 md:px-9">
        {/* Logo/Home link */}
        <div className="text-xl font-bold">
            <Link href="/">
            <SIcon className="" />
            </Link>
        </div>
        <div className="flex items-center space-x-4">
            {/* Desktop algorithm dropdown (only shown on maze page) */}
            {isMazePage && (
            <div className="relative dropdown-menu hidden md:block" onMouseLeave={closeDropdownOnLeave}>
                <button
                onMouseEnter={toggleDropdownOnHover}
                className="px-4 py-3 transition-transform duration-150 ease-in-out text-lg font-semibold"
                >
                {getAlgorithmDisplayName(selectedAlgorithm)}
                </button>
                {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-700 text-white py-2 rounded-2xl shadow-xl" onMouseEnter={toggleDropdownOnHover} onMouseLeave={closeDropdownOnLeave}>
                    <ul>
                    {/* Algorithm options */}
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
            {/* Desktop navigation links */}
            <div className="hidden md:flex space-x-4">
            <Link href="/maze" className="px-4 py-3 text-lg font-semibold">Maze</Link>
            <Link href="/snake" className="px-4 py-3 text-lg font-semibold">Snake</Link>
            </div>
            {/* Mobile menu button and dropdown */}
            <div className="md:hidden relative" ref={mobileMenuRef}>
            <button onClick={toggleMobileMenu} className="px-4 py-3 text-lg font-semibold">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
            {/* Hamburger icon SVG */}
            </button>
            {isMobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-gray-700 text-white py-2 rounded-2xl shadow-xl">
                <ul>
                    <li>
                    <Link href="/maze" className="block px-4 py-2 text-sm font-semibold" onClick={toggleMobileMenu}>Maze</Link>
                    </li>
                    <li>
                    <Link href="/snake" className="block px-4 py-2 text-sm font-semibold" onClick={toggleMobileMenu}>Snake</Link>
                    </li>
                    {/* Mobile algorithm dropdown (only shown on maze page) */}
                    {isMazePage && (
                    <li className="relative">
                        <button
                        className="block px-4 py-2 text-sm font-semibold w-full text-left"
                        onClick={() => setIsAlgorithmDropdownOpen(!isAlgorithmDropdownOpen)}
                        >
                        {getAlgorithmDisplayName(selectedAlgorithm)}
                        </button>
                        {isAlgorithmDropdownOpen && (
                        <div className="absolute right-0 mt-3 w-40 bg-gray-700 text-white py-2 rounded-2xl shadow-xl">
                            <ul>
                            {/* Algorithm options for mobile */}
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
                    </li>
                    )}
                </ul>
                </div>
            )}
            </div>
        </div>
        </div>
    );
};

export default Navbar;
