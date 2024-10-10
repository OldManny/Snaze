'use client';
import { useState, useEffect } from 'react';
import SVGRenderer from './SVGRenderer'; 
import SnakeAlgorithm from './SnakeAlgorithm'; 
import WindowAlert from '../WindowAlert'; 
import Button from '../Button';
import { FaAngleDoubleRight, FaAngleDoubleLeft } from 'react-icons/fa'; 

// Debounce function to limit the rate of function calls
function debounce(fn, ms) {
    let timer;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            fn.apply(this, arguments);
        }, ms);
    };
}

// SnakeGame component to manage the state and logic of the snake game
const SnakeGame = () => {
    const cellColor = '#33415c'; // Set the background color for normal cells
    const initialSnakeStrokeWidth = 13; // Initial snake stroke width
    const initialFoodSize = 13; // Initial food size

    // State variables for game logic and UI
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [direction, setDirection] = useState('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [userMode, setUserMode] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 700 });
    const [currentStrokeWidth, setCurrentStrokeWidth] = useState(initialSnakeStrokeWidth);
    const [currentFoodSize, setCurrentFoodSize] = useState(initialFoodSize);
    const [speed, setSpeed] = useState(35); // Default speed
    const [speedLabel, setSpeedLabel] = useState('Faster'); // Default speed label

    // Effect to update canvas size based on window dimensions
    useEffect(() => {
        const updateCanvasSize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            let canvasWidth, canvasHeight, strokeWidth, foodSize;

            // Define canvas size based on screen width
            if (width < 360) { // Extra small devices
                canvasWidth = 200;
                canvasHeight = 150;
                strokeWidth = initialSnakeStrokeWidth / 2;
                foodSize = initialFoodSize / 2;
            }
            else if (width < 720) {
                canvasWidth = 350;
                canvasHeight = 250;
                strokeWidth = initialSnakeStrokeWidth / 1.5;
                foodSize = initialFoodSize / 1.5;
            }
            else if (width < 930) {
                canvasWidth = 720;
                canvasHeight = 400;
                strokeWidth = initialSnakeStrokeWidth;
                foodSize = initialFoodSize;
            }
            else if (width < 1024) {
                canvasWidth = 840;
                canvasHeight = 400;
                strokeWidth = initialSnakeStrokeWidth;
                foodSize = initialFoodSize;
            }
            else if (width < 1625) {
                canvasWidth = 1025;
                canvasHeight = 300;
                strokeWidth = initialSnakeStrokeWidth / 1.5;
                foodSize = initialFoodSize / 1.5;
            }
            else {
                canvasWidth = 1200;
                canvasHeight = 540;
                strokeWidth = initialSnakeStrokeWidth;
                foodSize = initialFoodSize;
            }

            // Adjust height to ensure it fits within the available viewport height
            if (canvasHeight > height - 100) {
                canvasHeight = height - 100;
            }

            setCanvasSize({ width: canvasWidth, height: canvasHeight });
            setCurrentStrokeWidth(strokeWidth);
            setCurrentFoodSize(foodSize);
        };

        const debouncedHandleResize = debounce(updateCanvasSize, 100);
        window.addEventListener('resize', debouncedHandleResize);
        updateCanvasSize(); // Initial size calculation

        return () => window.removeEventListener('resize', debouncedHandleResize);
    }, [initialSnakeStrokeWidth, initialFoodSize]);

    // Handle starting a new game
    const handleNewGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood({ x: 15, y: 15 });
        setDirection('RIGHT');
        setGameOver(false);
        setUserMode(false);
        setScore(0);
        setIsModalOpen(false);
    };

    // Handle changing the game speed
    const handleSpeedChange = () => {
        if (speed === 35) {
            setSpeed(15);
            setSpeedLabel('Fastest');
        } else if (speed === 15) {
            setSpeed(5);
            setSpeedLabel('Normal');
        } else if (speed === 5) {
            setSpeed(35);
            setSpeedLabel('Faster');
        }
    };

    // Effect to handle user key presses for controlling the snake
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (userMode) {
                switch (e.key) {
                    case 'ArrowUp':
                        if (direction !== 'DOWN') setDirection('UP');
                        break;
                    case 'ArrowDown':
                        if (direction !== 'UP') setDirection('DOWN');
                        break;
                    case 'ArrowLeft':
                        if (direction !== 'RIGHT') setDirection('LEFT');
                        break;
                    case 'ArrowRight':
                        if (direction !== 'LEFT') setDirection('RIGHT');
                        break;
                    default:
                        break;
                }
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [direction, userMode]);

    // Effect to update the snake's position at set intervals based on the game speed
    useEffect(() => {
        const interval = setInterval(() => {
            if (!gameOver) {
                setSnake((prevSnake) => {
                    if (!userMode) {
                        return SnakeAlgorithm(prevSnake, direction, food, setFood, setGameOver, setScore);
                    } else {
                        const newSnake = [...prevSnake];
                        const head = { ...newSnake[0] };
                        switch (direction) {
                            case 'UP':
                                head.y -= 1;
                                break;
                            case 'DOWN':
                                head.y += 1;
                                break;
                            case 'LEFT':
                                head.x -= 1;
                                break;
                            case 'RIGHT':
                                head.x += 1;
                                break;
                            default:
                                break;
                        }
                        if (head.x < 0 || head.x >= canvasSize.width / 20 || head.y < 0 || head.y >= canvasSize.height / 20) {
                            setGameOver(true);
                            setIsModalOpen(true);
                            setModalMessage(`Game Over! Your score is ${score}.`);
                            return prevSnake;
                        }
                        for (let segment of newSnake) {
                            if (head.x === segment.x && head.y === segment.y) {
                                setGameOver(true);
                                setIsModalOpen(true);
                                setModalMessage(`Game Over! Your score is ${score}.`);
                                return prevSnake;
                            }
                        }
                        newSnake.unshift(head);
                        if (head.x === food.x && head.y === food.y) {
                            setFood({
                                x: Math.floor(Math.random() * (canvasSize.width / 20)),
                                y: Math.floor(Math.random() * (canvasSize.height / 20)),
                            });
                            setScore(score + 1);
                        } else {
                            newSnake.pop();
                        }
                        return newSnake;
                    }
                });
            }
        }, speed);
        return () => clearInterval(interval);
    }, [snake, direction, food, gameOver, userMode, score, canvasSize, speed]);

    // Effect to handle game over state
    useEffect(() => {
        if (gameOver) {
            setIsModalOpen(true);
            setModalMessage(`Game Over! Your score is ${score}.`);
        }
    }, [gameOver, score, modalMessage]);

    // Render the SnakeGame component
    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-4">
            {/* Snake Game SVG */}
            <div className="flex-grow w-full flex justify-center items-center mb-4">
                <SVGRenderer
                    snake={snake}
                    food={food}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    cellColor={cellColor}
                    snakeStrokeWidth={currentStrokeWidth}
                    foodSize={currentFoodSize}
                />
            </div>

            {/* Buttons Container */}
            <div className="flex justify-between w-full pt-4 space-x-4 pb-8">
                <Button
                    text={
                        <div className="flex items-center justify-center">
                            {speedLabel === 'Faster' ? (
                                <>
                                    <FaAngleDoubleRight className="mr-2" />
                                    Faster
                                </>
                            ) : speedLabel === 'Fastest' ? (
                                <>
                                    <FaAngleDoubleRight className="mr-2" />
                                    Fastest
                                </>
                            ) : (
                                <>
                                    <FaAngleDoubleLeft className="mr-2" />
                                    Normal
                                </>
                            )}
                        </div>
                    }
                    onClick={handleSpeedChange}
                    className="bg-cyan-700 shadow-lg shadow-cyan-100/50 rounded-2xl hover:bg-cyan-800 px-4 py-2 flex-1 max-w-xs"
                />

                <Button
                    text="New Game"
                    onClick={handleNewGame}
                    className="bg-slate-700 shadow-lg shadow-slate-400/50 rounded-2xl hover:bg-slate-900 px-4 py-2 flex-1 max-w-xs"
                />
            </div>

            {/* Modal Alert */}
            <WindowAlert
                isOpen={isModalOpen}
                message={modalMessage}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default SnakeGame;
