// SVGRenderer component to render the snake and food in the game
const SVGRenderer = ({ snake, food, width, height, cellColor, snakeStrokeWidth, foodSize }) => {
    // Calculate the cell size based on the width and height of the SVG container
    const cellSize = Math.min(width / 34, height / 20);

    // Create a string of points for the snake's body segments
    const points = snake.map(segment => `${segment.x * cellSize + cellSize / 2},${segment.y * cellSize + cellSize / 2}`).join(' ');

    // Function to render the snake
    const renderSnake = () => {
        return (
            <>
                {/* Draw the snake's body as a polyline */}
                <polyline points={points} fill="none" stroke="green" strokeWidth={snakeStrokeWidth} strokeLinejoin="round" />
                {/* Draw circles at the head and tail of the snake */}
                {snake.length > 0 && (
                    <>
                        <circle cx={snake[0].x * cellSize + cellSize / 2} cy={snake[0].y * cellSize + cellSize / 2} r={snakeStrokeWidth / 2} fill="green" />
                        <circle cx={snake[snake.length - 1].x * cellSize + cellSize / 2} cy={snake[snake.length - 1].y * cellSize + cellSize / 2} r={snakeStrokeWidth / 2} fill="green" />
                    </>
                )}
            </>
        );
    };

    // Calculate total width and height based on maze dimensions and cell size
    const totalWidth = 34 * cellSize;
    const totalHeight = 20 * cellSize;

    // Render the SVG element containing the snake and the food
    return (
        <div className="w-full h-full">
            <svg
                viewBox={`0 0 ${totalWidth} ${totalHeight}`}
                className="w-full h-auto"
                preserveAspectRatio="xMidYMid meet"
                style={{ backgroundColor: cellColor }}
            >
                {renderSnake()} {/* Call the renderSnake function to draw the snake */}
                {/* Draw the food as a circle */}
                <circle cx={food.x * cellSize + cellSize / 2} cy={food.y * cellSize + cellSize / 2} r={foodSize / 2} fill="red" />
            </svg>
        </div>
    );
};

export default SVGRenderer;
