// Counters for tracking the usage of various algorithms
let aStarCount = 0;
let floodFillCount = 0;
let canReachTailCount = 0;

// SnakeAlgorithm function responsible for handling the snake's movement, food placement, and game logic
const SnakeAlgorithm = (snake, direction, food, setFood, setGameOver, setScore) => {
    const newSnake = [...snake]; // Get a copy of the current snake position
    const head = { ...newSnake[0] }; // Get the head of the snake position

    // Function to get the new head position based on the current direction
    const getNewHead = (dir, currentHead = head) => {
        switch (dir) {
            case 'RIGHT':
                return { ...currentHead, x: currentHead.x + 1 };
            case 'LEFT':
                return { ...currentHead, x: currentHead.x - 1 };
            case 'UP':
                return { ...currentHead, y: currentHead.y - 1 };
            case 'DOWN':
                return { ...currentHead, y: currentHead.y + 1 };
            default:
                return currentHead;
        }
    };

    // Function to create a grid representation of the snake on a 20x34 grid
    const createGrid = (snake) => {
        const grid = Array.from({ length: 20 }, () => Array(34).fill(0));
        snake.forEach(segment => {
            grid[segment.y][segment.x] = 1; // Mark the snake's position on the grid
        });
        return grid;
    };

    // Function to check if a position is safe for the snake to move into
    const isSafe = (pos, grid) => {
        return (
            pos.x >= 0 && pos.x < 34 && // Check if the x-coordinate is within bounds
            pos.y >= 0 && pos.y < 20 && // Check if the y-coordinate is within bounds
            grid[pos.y][pos.x] === 0 // Ensure the position is not occupied by the snake
        );
    };

    // A* algorithm to find the shortest path from the snake's head to the food
    const aStar = (start, end, grid) => {
        aStarCount++; // Increment A* usage counter

        const heuristic = (pos0, pos1) => {
            return Math.abs(pos1.x - pos0.x) + Math.abs(pos1.y - pos0.y); // Manhattan distance heuristic
        };

        const queue = [[start]]; // Initialize the queue with the starting position
        const visited = new Set(); // Track visited positions
        visited.add(`${start.x},${start.y}`);

        while (queue.length > 0) {
            const path = queue.shift(); // Get the first path from the queue
            const pos = path[path.length - 1]; // Get the last position in the path

            if (pos.x === end.x && pos.y === end.y) {
                return path; // Return the path if the snake reaches the food
            }

            const directions = [
                { x: pos.x + 1, y: pos.y, dir: 'RIGHT' },
                { x: pos.x - 1, y: pos.y, dir: 'LEFT' },
                { x: pos.x, y: pos.y + 1, dir: 'DOWN' },
                { x: pos.x, y: pos.y - 1, dir: 'UP' },
            ];

            // Explore each direction and add safe moves to the queue
            for (const next of directions) {
                const key = `${next.x},${next.y}`;
                if (isSafe(next, grid) && !visited.has(key)) {
                    visited.add(key);
                    queue.push([...path, next]); // Add the new path to the queue
                }
            }

            // Sort the queue based on the heuristic to prioritize paths closer to the food
            queue.sort((a, b) => {
                const aHeuristic = heuristic(a[a.length - 1], end);
                const bHeuristic = heuristic(b[b.length - 1], end);
                return aHeuristic - bHeuristic;
            });
        }

        return null; // Return null if no path is found
    };

    // Flood fill algorithm to determine the available space for the snake to move
    const floodFill = (grid, start) => {
        floodFillCount++; // Increment Flood Fill usage counter

        const stack = [start]; // Stack to explore the grid
        const visited = new Set(); // Track visited positions
        visited.add(`${start.x},${start.y}`);

        let count = 0;

        while (stack.length > 0) {
            const { x, y } = stack.pop(); // Pop the last position from the stack
            count++;

            const directions = [
                { x: x + 1, y },
                { x: x - 1, y },
                { x, y: y + 1 },
                { x, y: y - 1 },
            ];

            // Explore each direction and add unvisited, safe positions to the stack
            for (const next of directions) {
                const key = `${next.x},${next.y}`;
                if (
                    next.x >= 0 && next.x < 34 && // Check if the x-coordinate is within bounds
                    next.y >= 0 && next.y < 20 && // Check if the y-coordinate is within bounds
                    grid[next.y][next.x] === 0 && // Ensure the position is free
                    !visited.has(key)
                ) {
                    visited.add(key);
                    stack.push(next); // Add the position to the stack
                }
            }
        }

        return count;
    };

    // Function to check if the snake can reach its tail after making a move
    const canReachTail = (newHead, snake, grid) => {
        canReachTailCount++; // Increment Can Reach Tail usage counter

        const tempGrid = grid.map(row => row.slice()); // Copy the grid

        // Simulate the snake's new position after the move
        const newSnake = [newHead, ...snake.slice(0, -1)]; // Remove the last segment

        // Remove the tail from the grid (since it will move)
        const tail = snake[snake.length - 1];
        tempGrid[tail.y][tail.x] = 0;

        // Mark the new head on the grid
        tempGrid[newHead.y][newHead.x] = 1;

        // Check if there is a path from the new head to the tail
        const queue = [newHead];
        const visited = new Set();
        visited.add(`${newHead.x},${newHead.y}`);

        while (queue.length > 0) {
            const pos = queue.shift();

            if (pos.x === tail.x && pos.y === tail.y) {
                return true; // Path exists to the tail
            }

            const directions = [
                { x: pos.x + 1, y: pos.y },
                { x: pos.x - 1, y: pos.y },
                { x: pos.x, y: pos.y + 1 },
                { x: pos.x, y: pos.y - 1 },
            ];

            for (const next of directions) {
                const key = `${next.x},${next.y}`;
                if (
                    next.x >= 0 && next.x < 34 &&
                    next.y >= 0 && next.y < 20 &&
                    tempGrid[next.y][next.x] === 0 &&
                    !visited.has(key)
                ) {
                    visited.add(key);
                    queue.push(next);
                }
            }
        }

        return false; // No path exists to the tail
    };

    // Function to place food at a random location on the grid
    const placeFood = (snake, grid) => {
        let newFood;
        let attempts = 0;
        let bufferSize = 3; // Buffer to avoid placing food too close to the snake

        const isWithinBuffer = (x, y, buffer) => {
            return snake.some(segment => 
                segment.x >= x - buffer && 
                segment.x <= x + buffer && 
                segment.y >= y - buffer && 
                segment.y <= y + buffer
            );
        };

        do {
            // Reduce buffer size after multiple failed attempts
            if (attempts > 50 && bufferSize > 1) bufferSize--;
            if (attempts > 100) {
                // Place food at any valid position after n attempts
                newFood = {
                    x: Math.floor(Math.random() * 34), // Random x-coordinate
                    y: Math.floor(Math.random() * 20)  // Random y-coordinate
                };
                if (grid[newFood.y][newFood.x] === 1) { // Check if the position is occupied by the snake
                    attempts++;
                    continue;
                } else {
                    break;
                }
            } else {
                // Place food within the buffer zone
                newFood = {
                    x: Math.floor(Math.random() * (34 - bufferSize * 2)) + bufferSize,
                    y: Math.floor(Math.random() * (20 - bufferSize * 2)) + bufferSize
                };
                if (grid[newFood.y][newFood.x] === 1 || isWithinBuffer(newFood.x, newFood.y, bufferSize)) {
                    attempts++;
                    continue;
                } else {
                    break;
                }
            }
        } while (true);
        
        return newFood; // Return the new food position
    };

    // Create the grid based on the current snake position
    const grid = createGrid(snake);

    // Use A* algorithm to find the path to the food
    let path = aStar(head, food, grid);

    let directionChosen = false;
    const possibleDirections = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

    // Try to follow the path returned by A*
    if (path && path.length > 1) {
        const nextStep = path[1]; // Get the next step in the path
        const potentialDirection = nextStep.dir; // Direction of the next step
        const newHead = getNewHead(potentialDirection); // Get the new head position

        // Check if the new head position is safe and the snake can reach its tail
        if (isSafe(newHead, grid) && canReachTail(newHead, snake, grid)) {
            direction = potentialDirection; // Update the direction
            directionChosen = true;
        }
    }

    // If no safe path is found, find an alternative move
    if (!directionChosen) {
        let bestMove = null;
        let maxSpace = -1;

        // Try all possible directions and pick the one with the most space
        for (const dir of possibleDirections) {
            const newHead = getNewHead(dir);

            if (isSafe(newHead, grid) && canReachTail(newHead, snake, grid)) {
                const space = floodFill(grid, newHead); // Calculate available space

                if (space > maxSpace) {
                    maxSpace = space;
                    bestMove = dir;
                }
            }
        }

        if (bestMove) {
            direction = bestMove; // Update the direction to the best move
        } else {
            // As a last resort, pick any safe move
            for (const dir of possibleDirections) {
                const newHead = getNewHead(dir);

                if (isSafe(newHead, grid)) {
                    direction = dir; // Update the direction to a safe move
                    break;
                }
            }
        }
    }

    // Get the new head position based on the chosen direction
    const newHead = getNewHead(direction);

    // Update the snake's position
    newSnake.unshift(newHead);

    // Update the grid to include the new snake position
    const updatedGrid = createGrid(newSnake);
    
    // Check if the snake has eaten the food
    if (newHead.x === food.x && newHead.y === food.y) {
        setFood(placeFood(newSnake, updatedGrid)); // Place new food after eating
    } else {
        newSnake.pop(); // Remove the last segment of the snake if no food was eaten
    }

    // Check for collisions with the wall or itself
    const hitWall = newHead.x < 0 || newHead.y < 0 || newHead.x >= 34 || newHead.y >= 20;
    const hitSelf = newSnake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y);

    if (hitWall || hitSelf) {
        setGameOver(true); // End the game if the snake hits a wall or itself
        setScore(newSnake.length - 1); // Set the score to the snake's length minus one
        return snake; // Return the previous snake state
    }

    return newSnake; // Return the updated snake position
};

// Export functions to get and reset algorithm usage counts
export const algorithmUsage = {
    getAStarCount: () => aStarCount, // Get A* algorithm usage count
    getFloodFillCount: () => floodFillCount, // Get Flood Fill usage count
    getCanReachTailCount: () => canReachTailCount, // Get Can Reach Tail usage count
    resetCounts: () => {
        aStarCount = 0;
        floodFillCount = 0;
        canReachTailCount = 0; // Reset all algorithm usage counters
    }
};

export default SnakeAlgorithm;
