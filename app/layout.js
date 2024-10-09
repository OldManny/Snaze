import "/styles/global.css";
import React from 'react';

// Define metadata for the document
export const metadata = {
  title: "Snaze",
  description: "Solving mazes with algorithms and playing snake with AI",
};

// Define the RootLayout component
const RootLayout = ({ children }) => {
    return (
        <html lang="en">
            <body className="flex flex-col min-h-screen">
                <main className="flex flex-col flex-grow">
                    {children} {/* Render child components passed into the layout */}
                </main>
            </body>
        </html>
    );
}

export default RootLayout;
