import React from 'react';
import { getDrawnPathD } from './mazeUtils';

// MazeSVG component definition
const MazeSVG = ({ drawnPath, cellSize, strokeWidth, onCellClick, maze, start, end, isSolved }) => {

    // If the maze is not ready, display a loading message
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
                    const cursorStyle = cell === 'P' ? 'pointer' : 'default'; // Set cursor style based on cell type
                    return (
                        <rect
                            className='maze-cell'
                            key={`${rowIndex}-${cellIndex}`}
                            x={cellIndex * cellSize} // Set x position based on cell index
                            y={rowIndex * cellSize}  // Set y position based on row index
                            width={cellSize}
                            height={cellSize}
                            fill={cell === 'W' ? '#33415c' : '#edf2fb'} // Fill color based on cell type (W for wall, P for path)
                            style={{ cursor: cursorStyle }}
                            onClick={() => cell === 'P' && onCellClick && onCellClick(rowIndex, cellIndex)} // Handle cell click if it's a path cell and onCellClick exists
                        />
                    );
                })
            )}
            {/* Render the drawn path */}
            {pathD && (
                <path
                    d={pathD} // Path data for the SVG path
                    stroke="red"
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                    fill="none"
                    className={isSolved ? 'blinking-path' : ''} // Add css class if maze is solved
                />
            )}
            {/* Render the start point */}
            {start && (
                <circle
                    cx={(start.col + 0.5) * cellSize} // Set x position of the start position
                    cy={(start.row + 0.5) * cellSize} // Set y position of the circle start position
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
