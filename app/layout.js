import "/styles/global.css";
import React from 'react';


export const metadata = {
  title: "AlgoMaze",
  description: "Solving mazes with algorithms",
};

const RootLayout = ({ children }) => {
    return (
        <html lang="en">
            <body className="flex flex-col min-h-screen">
                <main className="flex flex-col flex-grow">
                    {children}
                </main>
            </body>
        </html>
    );
}


export default RootLayout;