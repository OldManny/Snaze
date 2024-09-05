import React, { useEffect, useRef } from 'react';
import { getDrawnPathD } from './mazeUtils';

const MazeSVG = ({ drawnPath, cellSize, strokeWidth, onCellClick, maze, start, end, isSolved, onAnimationEnd }) => {
    const pathRef = useRef(null);

    // useEffect hook to handle animation when the maze is solved
    useEffect(() => {
        if (isSolved) {
            const handleAnimationEnd = () => {
                if (onAnimationEnd) {
                    onAnimationEnd(); // Trigger callback when animation ends
                }
            };
            const pathElement = pathRef.current;
            pathElement.addEventListener('animationend', handleAnimationEnd); // Add animation end event listener

            return () => {
                pathElement.removeEventListener('animationend', handleAnimationEnd); // Cleanup event listener on unmount
            };
        }
    }, [isSolved, onAnimationEnd]);

    // Return a loading message if the maze is not loaded
    if (!maze || maze.length === 0 || !maze[0]) {
        return <div>Loading maze...</div>;
    }

    // Get the SVG path data for the drawn path
    const pathD = getDrawnPathD(drawnPath, cellSize);

    // Render the SVG element
    return (
        <svg
            width={maze[0].length * cellSize} // Set the width based on maze columns and cell size
            height={maze.length * cellSize}   // Set the height based on maze rows and cell size
        >
            {/* Render the maze cells */}
            {maze.map((row, rowIndex) =>
                row.map((cell, cellIndex) => {
                    const cursorStyle = cell === 'P' ? 'pointer' : 'default'; // Set cursor style
                    return (
                        <rect
                            className='maze-cell'
                            key={`${rowIndex}-${cellIndex}`}
                            x={cellIndex * cellSize}
                            y={rowIndex * cellSize}
                            width={cellSize}
                            height={cellSize}
                            fill={cell === 'W' ? '#33415c' : '#edf2fb'} // Fill color based on cell type (W for wall, P for path)
                            style={{ cursor: cursorStyle }}
                            onClick={() => cell === 'P' && onCellClick && onCellClick(rowIndex, cellIndex)} // Handle cell click
                        />
                    );
                })
            )}
            {/* Render the drawn path */}
            {pathD && (
                <path
                    ref={pathRef} // Set reference to the path element for animation control
                    d={pathD} // Path data for the SVG path
                    stroke="red"
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                    fill="none"
                    className={isSolved ? 'blinking-path' : ''} // Add CSS class if maze is solved to trigger animation
                />
            )}
            {/* Render the start point */}
            {start && (
                <circle
                    cx={(start.col + 0.5) * cellSize} // Set x position of the start position
                    cy={(start.row + 0.5) * cellSize} // Set y position of the start position
                    r={cellSize / 3.5} // Radius of the circle
                    fill="red"
                    style={{ cursor: 'pointer' }}
                />
            )}
            {/* Render the end point */}
            {end && (
                <circle
                    cx={(end.col + 0.5) * cellSize} // Set x position of the end position
                    cy={(end.row + 0.5) * cellSize} // Set y position of the end position
                    r={cellSize / 3.5} // Radius of the circle
                    fill="red"
                    style={{ cursor: 'pointer' }}
                />
            )}
        </svg>
    );
};

export default MazeSVG;
