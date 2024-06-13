// Function to generate the SVG path data string for a given path
// The path is an array of points, each with row and col properties

export const getDrawnPathD = (path, cellSize) => {
    // If the path is empty, return an empty string
    if (path.length === 0) return "";

    // Start the SVG path data string with the first point in the path
    let d = `M ${(path[0].col + 0.5) * cellSize} ${(path[0].row + 0.5) * cellSize}`;

    // Append each subsequent point in the path
    path.forEach((point, index) => {
        if (index > 0) {
            d += ` L ${(point.col + 0.5) * cellSize} ${(point.row + 0.5) * cellSize}`;
        }
    });

    return d;
};
