// Priority Queue class definition
class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    // Enqueue an element with a given priority and sort the queue based on priority
    enqueue(item, priority) {
        this.elements.push({ item, priority });
        this.elements.sort((a, b) => a.priority - b.priority);
    }

    // Dequeue an element from the front of the queue
    dequeue() {
        return this.elements.shift().item;
    }

    // Check if the queue is empty
    isEmpty() {
        return this.elements.length === 0;
    }
}

/****************** BFS *********************/

// Breadth-First Search (BFS) algorithm for maze solving
export const bfsSolve = (maze, start, end) => {
    if (!start || !end) {
        console.error("Start or end point is missing.");
        return [];
    }

    let queue = [{ pos: start, path: [start] }];
    let visited = new Set(`${start.row},${start.col}`);

    while (queue.length > 0) {
        let { pos, path } = queue.shift();
        let { row, col } = pos;

        if (row === end.row && col === end.col) {
            return path;
        }

        // Explore neighbors
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dRow, dCol]) => {
            let newRow = row + dRow, newCol = col + dCol;
            if (newRow >= 0 && newRow < maze.length && newCol >= 0 && newCol < maze[0].length && maze[newRow][newCol] === 'P' && !visited.has(`${newRow},${newCol}`)) {
                visited.add(`${newRow},${newCol}`);
                queue.push({ pos: { row: newRow, col: newCol }, path: [...path, { row: newRow, col: newCol }] });
            }
        });
    }

    // If no path is found
    return [];
};

/****************** DFS *********************/

// Depth-First Search (DFS) algorithm for maze solving
export const dfsSolve = (maze, start, end) => {
    let stack = [{ row: start.row, col: start.col, path: [start] }];
    let visited = new Set(`${start.row},${start.col}`);

    while (stack.length > 0) {
        const { row, col, path } = stack.pop();

        if (row === end.row && col === end.col) {
            return path;
        }

        // Explore neighbors
        getNeighbors(maze, { row, col }).forEach(({ row: nextRow, col: nextCol }) => {
            const key = `${nextRow},${nextCol}`;
            if (!visited.has(key)) {
                visited.add(key);
                stack.push({ row: nextRow, col: nextCol, path: [...path, { row: nextRow, col: nextCol }] });
            }
        });
    }

    // If no path is found
    return [];
};

/****************** A* *********************/

// A* algorithm for maze solving
export const aStarSolve = (maze, start, end) => {
    
    let openSet = new PriorityQueue();
    openSet.enqueue(start, 0);
    
    let cameFrom = new Map();
    
    let gScore = new Map();
    gScore.set(`${start.row},${start.col}`, 0);
    
    let fScore = new Map();
    fScore.set(`${start.row},${start.col}`, heuristic(start, end));
    
    while (!openSet.isEmpty()) {
        let current = openSet.dequeue();

        if (current.row === end.row && current.col === end.col) {
            return reconstructPath(cameFrom, start, end);
        }

        // Explore neighbors
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dRow, dCol]) => {
            let neighbor = { row: current.row + dRow, col: current.col + dCol };

            // Skip if neighbor is not valid or is a wall
            if (!isValidCell(maze, neighbor)) return;

            let tentativeGScore = gScore.get(`${current.row},${current.col}`) + 1; // Assume cost of 1 for each move

            // In the A* implementation
            if (tentativeGScore < (gScore.get(`${neighbor.row},${neighbor.col}`) || Infinity)) {
                // This path to neighbor is better than any previous one. Record it!
                cameFrom.set(`${neighbor.row},${neighbor.col}`, current);
                gScore.set(`${neighbor.row},${neighbor.col}`, tentativeGScore);
                fScore.set(`${neighbor.row},${neighbor.col}`, tentativeGScore + heuristic(neighbor, end));
                openSet.enqueue(neighbor, fScore.get(`${neighbor.row},${neighbor.col}`));
            }

        });
    }

    // Heuristic function for A* (Manhattan distance)
    function heuristic(a, b) {
        return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
    }

    // Check if cell is within maze bounds and not a wall
    function isValidCell(maze, cell) {
        return cell.row >= 0 && cell.row < maze.length && cell.col >= 0 && cell.col < maze[0].length && maze[cell.row][cell.col] === 'P';
    }

    // Reconstruct path from end to start
    function reconstructPath(cameFrom, start, end) {
        let current = end;
        let path = [];
        while (current !== start) {
            path.unshift(current);
            current = cameFrom.get(`${current.row},${current.col}`);
        }
        path.unshift(start); // Add the start position
        return path;
    }

    // If no path is found
    return [];
};

/****************** Dijkstra's *********************/

// Dijkstra's algorithm for maze solving
export const dijkstraSolve = (maze, start, end) => {
    let visited = new Set();
    let queue = new PriorityQueue();
    queue.enqueue(start, 0);
    
    let cameFrom = {};
    let costSoFar = {};
    let keyStart = `${start.row},${start.col}`;
    let keyEnd = `${end.row},${end.col}`;
    cameFrom[keyStart] = null;
    costSoFar[keyStart] = 0;
  
    while (!queue.isEmpty()) {
      let current = queue.dequeue();
      let keyCurrent = `${current.row},${current.col}`;
  
      if (keyCurrent === keyEnd) {
        break;
      }
  
      // Explore neighbors
      getNeighbors(maze, current).forEach(next => {
        let newCost = costSoFar[keyCurrent] + 1; // Assuming cost is 1 for each step
        let keyNext = `${next.row},${next.col}`;
  
        if (!costSoFar[keyNext] || newCost < costSoFar[keyNext]) {
          costSoFar[keyNext] = newCost;
          let priority = newCost;
          queue.enqueue(next, priority);
          cameFrom[keyNext] = current;
        }
      });
  
      visited.add(keyCurrent);
    }
  
    // Reconstruct path from end to start
    return reconstructPath(cameFrom, start, end);
  };
  
  // Helper to get valid neighbors of a cell
  function getNeighbors(maze, { row, col }) {
    let neighbors = [];
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dRow, dCol]) => {
      let newRow = row + dRow, newCol = col + dCol;
      if (newRow >= 0 && newRow < maze.length && newCol >= 0 && newCol < maze[0].length && maze[newRow][newCol] === 'P') {
        neighbors.push({ row: newRow, col: newCol });
      }
    });
    return neighbors;
  }
  
  // Reconstruct path from the end to the start
  function reconstructPath(cameFrom, start, end) {
    let current = end;
    let path = [];
    while (current !== start) {
      path.unshift(current);
      current = cameFrom[`${current.row},${current.col}`];
    }
    path.unshift(start); // Add the start position to the path
    return path;
  }
