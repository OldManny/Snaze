'use client';
import Navbar from '/components/Navbar/Navbar';
import Footer from '/components/Footer/Footer';
import SnakeGame from '@/components/Snake/SnakeGame';
import InfoIcon from '@/components/Info';

// SnakePage component to structure the Snake Game page
const SnakePage = () => {
    return (
        <div className="flex flex-col min-h-screen"> {/* Flexbox layout to ensure full screen height */}
            <Navbar /> {/* Navigation bar at the top of the page */}
            <div className="flex items-center justify-end mr-4 mt-4"> {/* Flexbox for aligning InfoIcon */}
                <InfoIcon color="text-slate-700" messageType="snake" /> {/* InfoIcon with color and message type for Snake Game */}
            </div>
            <main className="flex-grow flex items-center justify-center"> {/* Main content area centered horizontally and vertically */}
                <div className="flex flex-col items-center justify-center w-full h-full max-w-screen-md"> {/* Wrapper to contain SnakeGame */}
                    <SnakeGame /> {/* SnakeGame component rendering the game */}
                </div>
            </main>
            <Footer /> {/* Footer at the bottom of the page */}
        </div>
    );
};

export default SnakePage;