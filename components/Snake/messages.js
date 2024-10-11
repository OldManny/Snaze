export const gameOverMessage = (score, totalMoves, coveragePercentage, aStarCount, floodFillCount, canReachTailCount) => {
    const formatter = new Intl.NumberFormat('en-US'); // Number formatter

    return `
        <div>
            <p>Game Over! Your score is ${formatter.format(score)}.</p>
            <br>
            <p><strong>• Total Moves Made:</strong> ${formatter.format(totalMoves)}.</p>
            <p><strong>• Final Grid Coverage:</strong> ${coveragePercentage.toFixed(2)}%.</p>
            <br>
            <p>Algorithm Usage:</p>
            <ul>
                <li><strong>• A* Pathfinding</strong> used ${formatter.format(aStarCount)} times.</li>
                <li><strong>• Flood Fill</strong> used ${formatter.format(floodFillCount)} times.</li>
                <li><strong>• BFS</strong> used ${formatter.format(canReachTailCount)} times.</li>
            </ul>
        </div>
    `;
};
