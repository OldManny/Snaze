'use client';
import Navbar from '/components/Navbar/Navbar';
import Footer from '/components/Footer/Footer';
import SnakeGame from '@/components/Snake/SnakeGame';
import InfoIcon from '@/components/Info';

const SnakePage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex items-center justify-end mr-4 mt-4">
                <InfoIcon color="text-slate-700" messageType="snake" />
            </div>
            <main className="flex-grow flex items-center justify-center">
                <div className="flex flex-col items-center justify-center w-full h-full max-w-screen-md">
                    <SnakeGame />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SnakePage;
