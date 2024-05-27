import React from 'react';
import AnimatedMaze from '/components/Home/AnimatedMaze'; 
import Footer from "/components/Footer/Footer";
import { MazeProvider } from '/components/Maze/MazeContext'; // Ensure the correct path



const Home = () => {
    return (
        <MazeProvider>
            <div className="landing-page">
                <div className="header-text">
                    <h1 className="text-4xl font-semibold">Snaze</h1>
                </div>
                <div className="animated-maze-container">
                    <AnimatedMaze />
                </div>
                <div className="footer-text">
                    <p className="text-xl">Solve mazes and play snake with advanced algorithms!</p>
                </div>
            </div>
            <Footer />
        </MazeProvider>
    );
};

export default Home;
