import React, { useEffect, useRef } from 'react';
import { getDrawnPathD } from './mazeUtils';

// MazeSVG component responsible for rendering the maze as an SVG
const MazeSVG = ({ drawnPath, cellSize, strokeWidth, onCellClick, maze, start, end, isSolved, onAnimationEnd }) => {
    const pathRef = useRef(null); // Reference to the SVG path element

    // Effect to handle animation end when the maze is solved
    useEffect(() => {
        if (isSolved) {
            const handleAnimationEnd = () => {
                if (onAnimationEnd) {
                    onAnimationEnd(); // Trigger the callback when the animation ends
                }
            };
            const pathElement = pathRef.current;
            pathElement.addEventListener('animationend', handleAnimationEnd); // Listen for animation end event

            // Cleanup event listener when component unmounts or is solved
            return () => {
                pathElement.removeEventListener('animationend', handleAnimationEnd);
            };
        }
    }, [isSolved, onAnimationEnd]); // Effect runs when `isSolved` or `onAnimationEnd` changes

    // If the maze data is not available, display a loading message
    if (!maze || maze.length === 0 || !maze[0]) {
        return <div>Loading maze...</div>;
    }

    // Generate the SVG path data for the drawn path based on the cell size
    const pathD = getDrawnPathD(drawnPath, cellSize);

    // Calculate the total width and height of the SVG based on the maze dimensions and cell size
    const totalWidth = maze[0].length * cellSize;
    const totalHeight = maze.length * cellSize;

    return (
        <div className="w-full h-full">
            <svg
                viewBox={`0 0 ${totalWidth} ${totalHeight}`} // Setting the viewBox based on maze size
                className="w-full h-auto" // Responsive width with auto height
                preserveAspectRatio="xMidYMid meet" // Preserve aspect ratio to avoid distortion
            >
                {/* Render each cell of the maze as an SVG rectangle */}
                {maze.map((row, rowIndex) =>
                    row.map((cell, cellIndex) => {
                        const cursorStyle = cell === 'P' ? 'pointer' : 'default'; // Pointer cursor only for clickable path cells
                        return (
                            <rect
                                className='maze-cell'
                                key={`${rowIndex}-${cellIndex}`}
                                x={cellIndex * cellSize}
                                y={rowIndex * cellSize}
                                width={cellSize}
                                height={cellSize}
                                fill={cell === 'W' ? '#33415c' : '#edf2fb'}
                                style={{ cursor: cursorStyle }}
                                onClick={() => cell === 'P' && onCellClick && onCellClick(rowIndex, cellIndex)}
                            />
                        );
                    })
                )}
                
                {/* Render the solution path if it exists */}
                {pathD && (
                    <path
                        ref={pathRef}
                        d={pathD}
                        stroke="red" 
                        strokeWidth={strokeWidth}
                        strokeLinejoin="round" 
                        fill="none" 
                        className={isSolved ? 'blinking-path' : ''} 
                    />
                )}

                {/* Render a circle at the start point */}
                {start && (
                    <circle
                        cx={(start.col + 0.5) * cellSize} 
                        cy={(start.row + 0.5) * cellSize}
                        r={cellSize / 3.5}
                        fill="red" 
                        style={{ cursor: 'pointer' }}
                    />
                )}

                {/* Render a circle at the end point */}
                {end && (
                    <circle
                        cx={(end.col + 0.5) * cellSize} 
                        cy={(end.row + 0.5) * cellSize} 
                        r={cellSize / 3.5} 
                        fill="red" 
                        style={{ cursor: 'pointer' }} 
                    />
                )}
            </svg>
        </div>
    );
};

export default MazeSVG;
