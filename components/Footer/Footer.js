import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa'; 

const Footer = () => (
    <div className="footer w-full p-4 flex justify-between items-center absolute bottom-0 left-0 text-center">
        <span></span>
        <div className="flex items-center">
            <a 
                href="https://www.linkedin.com/in/emanuel-florea-4a44bb299/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xl mx-2">
                <FaLinkedin />
            </a> 
            <a 
                href="https://github.com/OldManny" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xl mx-2">
                <FaGithub />
            </a>
        </div>
    </div>
);

export default Footer;
