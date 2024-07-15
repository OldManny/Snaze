const SnakeAlgorithm = (snake, direction, food, setFood, setGameOver, setScore) => {
    const newSnake = [...snake]; // Create a copy of the current snake
    const head = { ...newSnake[0] }; // Copy the head of the snake

    // Get the new head position based on the current direction
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

    // Create a grid representation of the snake
    const createGrid = (snake) => {
        const grid = Array.from({ length: 20 }, () => Array(34).fill(0));
        snake.forEach(segment => {
            grid[segment.y][segment.x] = 1;
        });
        return grid;
    };

    // Check if a position is safe for the snake to move into
    const isSafe = (pos, grid, snake) => {
        return (
            pos.x >= 0 &&
            pos.x < 34 &&
            pos.y >= 0 &&
            pos.y < 20 &&
            grid[pos.y][pos.x] === 0 &&
            !snake.some(segment => segment.x === pos.x && segment.y === pos.y)
        );
    };

    // A* algorithm to find the shortest path from start to end
    const aStar = (start, end, grid) => {
        const heuristic = (pos0, pos1) => {
            return Math.abs(pos1.x - pos0.x) + Math.abs(pos1.y - pos0.y);
        };

        const queue = [[start]];
        const visited = new Set();
        visited.add(`${start.x},${start.y}`);

        while (queue.length > 0) {
            const path = queue.shift();
            const pos = path[path.length - 1];

            if (pos.x === end.x && pos.y === end.y) {
                return path;
            }

            const directions = [
                { x: pos.x + 1, y: pos.y, dir: 'RIGHT' },
                { x: pos.x - 1, y: pos.y, dir: 'LEFT' },
                { x: pos.x, y: pos.y + 1, dir: 'DOWN' },
                { x: pos.x, y: pos.y - 1, dir: 'UP' },
            ];

            for (const next of directions) {
                const key = `${next.x},${next.y}`;
                if (isSafe(next, grid, snake) && !visited.has(key)) {
                    visited.add(key);
                    queue.push([...path, next]);
                }
            }

            queue.sort((a, b) => {
                const aHeuristic = heuristic(a[a.length - 1], end);
                const bHeuristic = heuristic(b[b.length - 1], end);
                return aHeuristic - bHeuristic;
            });
        }

        return null;
    };

    // Flood fill algorithm to determine the space available for the snake to move
    const floodFill = (grid, start) => {
        const stack = [start];
        const visited = new Set();
        visited.add(`${start.x},${start.y}`);

        let count = 0;

        while (stack.length > 0) {
            const { x, y } = stack.pop();
            count++;

            const directions = [
                { x: x + 1, y },
                { x: x - 1, y },
                { x, y: y + 1 },
                { x, y: y - 1 },
            ];

            for (const next of directions) {
                const key = `${next.x},${next.y}`;
                if (
                    next.x >= 0 && next.x < 34 &&
                    next.y >= 0 && next.y < 20 &&
                    grid[next.y][next.x] === 0 &&
                    !visited.has(key)
                ) {
                    visited.add(key);
                    stack.push(next);
                }
            }
        }

        return count;
    };

    // Lookahead function to determine the best move based on available space
    const lookahead = (currentHead, grid, snake, depth = 10) => {
        const directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
        let bestMove = null;
        let maxSpace = -1;

        for (const dir of directions) {
            let tempHead = { ...currentHead };
            let valid = true;
            for (let i = 0; i < depth; i++) {
                tempHead = getNewHead(dir, tempHead);
                if (!isSafe(tempHead, grid, snake)) {
                    valid = false;
                    break;
                }
            }
            if (valid) {
                const space = floodFill(grid, tempHead);
                if (space > maxSpace) {
                    maxSpace = space;
                    bestMove = dir;
                }
            }
        }
        return bestMove;
    };

    // Function to determine the best fallback move if the optimal path is blocked
    const optimisedFallbackMove = (head, direction, grid) => {
        const directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
        let bestMove = direction;
        let maxOpenSpace = -1;

        for (const dir of directions) {
            const newHead = getNewHead(dir);
            if (isSafe(newHead, grid, snake)) {
                const openSpace = floodFill(grid, newHead);
                if (openSpace > maxOpenSpace) {
                    maxOpenSpace = openSpace;
                    bestMove = dir;
                }
            }
        }

        return bestMove;
    };

    // Determine the best escape move if the snake is trapped
    const escapeMove = (head, grid, snake) => {
        const directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
        let bestMove = null;
        let maxSpace = -1;

        for (const dir of directions) {
            const newHead = getNewHead(dir);
            if (isSafe(newHead, grid, snake)) {
                const space = floodFill(grid, newHead);
                if (space > maxSpace) {
                    maxSpace = space;
                    bestMove = dir;
                }
            }
        }

        return bestMove;
    };

    // Determine the best backtracking move if no other options are available
    const backtrackingMove = (head, grid, snake) => {
        const directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
        let bestMove = null;
        let maxSafeSpace = -1;

        for (const dir of directions) {
            const newHead = getNewHead(dir);
            if (isSafe(newHead, grid, snake)) {
                const space = floodFill(grid, newHead);
                if (space > maxSafeSpace) {
                    maxSafeSpace = space;
                    bestMove = dir;
                }
            }
        }

        return bestMove;
    };

    // Place food at a random location on the grid
    const placeFood = (snake, grid) => {
        let newFood;
        let attempts = 0;
        let bufferSize = 3;

        const isWithinBuffer = (x, y, buffer) => {
            return (
                snake.some(segment => 
                    segment.x >= x - buffer && 
                    segment.x <= x + buffer && 
                    segment.y >= y - buffer && 
                    segment.y <= y + buffer
                ) || grid[y][x] === 1
            );
        };

        do {
            if (attempts > 50 && bufferSize > 1) bufferSize--;
            if (attempts > 100) {
                newFood = { x: Math.floor(Math.random() * 32) + 1, y: Math.floor(Math.random() * 18) + 1 };
                break;
            }

            newFood = { x: Math.floor(Math.random() * 30) + 2, y: Math.floor(Math.random() * 16) + 2 };
            attempts++;
        } while (isWithinBuffer(newFood.x, newFood.y, bufferSize));
        
        return newFood;
    };

    // Create the grid based on the current snake position
    const grid = createGrid(snake);

    // Use A* algorithm to find the path to the food
    let path = aStar(head, food, grid);

    if (path && path.length > 1) {
        const nextStep = path[1];
        direction = nextStep.dir;
    } else {
        direction = optimisedFallbackMove(head, direction, grid);
    }

    // Get the new head position based on the chosen direction
    const newHead = getNewHead(direction);

    // Use lookahead to determine the best move based on available space
    const lookaheadMove = lookahead(newHead, grid, snake);
    if (lookaheadMove) {
        direction = lookaheadMove;
    } else {
        direction = escapeMove(newHead, grid, snake);
    }

    if (!direction) {
        direction = backtrackingMove(newHead, grid, snake);
    }

    // Update the snake's position
    newSnake.unshift(newHead);

    // Check if the snake has eaten the food
    if (newHead.x === food.x && newHead.y === food.y) {
        setFood(placeFood(newSnake, grid));
    } else {
        newSnake.pop();
    }

    // Check for collisions with the wall or itself
    const hitWall = newHead.x < 0 || newHead.y < 0 || newHead.x >= 34 || newHead.y >= 20;
    const hitSelf = newSnake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y);

    if (hitWall || hitSelf) {
        setGameOver(true);
        setScore(newSnake.length - 1); // Set the score to the length of the snake minus one (initial head)
        console.log('Game Over: Hit Wall or Self', { hitWall, hitSelf, newHead, snake });
        return snake;
    }

    return newSnake;
};

export default SnakeAlgorithm;
