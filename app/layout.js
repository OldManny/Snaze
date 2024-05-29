// Import global CSS and React
import "/styles/global.css";
import React from 'react';

// Define metadata for the document
export const metadata = {
  title: "AlgoMaze",
  description: "Solving mazes with algorithms",
};

// Define the RootLayout component
const RootLayout = ({ children }) => {
    return (
        // Set the HTML language and body structure
        <html lang="en">
            <body className="flex flex-col min-h-screen">
                {/* Main content area */}
                <main className="flex flex-col flex-grow">
                    {children}
                </main>
            </body>
        </html>
    );
}

// Export the RootLayout component as the default export
export default RootLayout;
