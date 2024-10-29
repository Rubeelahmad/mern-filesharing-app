import React from 'react';

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from 'react-icons/fa';

const Footer = () => {
  const socialMediaLink = "https://www.linkedin.com/in/rubeel-ahmed-32944b199/";

  return (
    <footer className="bg-gray-800 text-white text-center p-4">
      <p className="mb-2">&copy; 2024 MERN File Sharing App By Rubeel Ahmed.</p>
      <p className="mb-4">Made by Rubeel Ahmed</p>
      <div className="flex justify-center space-x-4">
        <a href={socialMediaLink} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <FaInstagram className="text-2xl hover:text-blue-500 transition-colors duration-300" />
        </a>
        <a href={socialMediaLink} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FaLinkedin className="text-2xl hover:text-blue-500 transition-colors duration-300" />
        </a>
        <a href={socialMediaLink} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <FaFacebook className="text-2xl hover:text-blue-500 transition-colors duration-300" />
        </a>
        <a href={socialMediaLink} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
          <FaTwitter className="text-2xl hover:text-blue-500 transition-colors duration-300" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
