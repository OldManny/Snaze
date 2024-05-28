import React from 'react';
import { MazeProvider } from '/components/Maze/MazeContext';
import MazeController from '/components/Maze/MazeController';
import Header from "/components/Header/Header";
import Footer from "/components/Footer/Footer";


import "/styles/global.css";

const MazePage = () => {
    return (
        <MazeProvider>
            <Header />
                <main className="flex-grow flex items-center justify-center">
                    <MazeController />
                </main>
            <Footer />
        </MazeProvider>
    );
}



export default MazePage;

