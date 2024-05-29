// Import necessary modules from React and custom components
import React from 'react';
import AnimatedMaze from '/components/Home/AnimatedMaze'; 
import Footer from "/components/Footer/Footer";
import { MazeProvider } from '/components/Maze/MazeContext'; // Ensure the correct path is used

// Home component
const Home = () => {
    return (
        // Wrap the content to provide maze-related context
        <MazeProvider>
            <div className="landing-page">
                {/* Header section with the title */}
                <div className="header-text">
                    <h1 className="text-4xl font-semibold">Snaze</h1>
                </div>
                {/* Container for the animated maze component */}
                <div className="animated-maze-container">
                    <AnimatedMaze />
                </div>
                {/* Footer text section */}
                <div className="footer-text">
                    <p className="text-xl">Solve mazes and play snake using algorithms.</p>
                </div>
            </div>
            {/* Footer component */}
            <Footer />
        </MazeProvider>
    );
};

// Export the Home component as the default export
export default Home;
