import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full p-2 border-t text-center text-sm text-gray-500">
      <p>&copy; {new Date().getFullYear()} Twitter Bot Detector. All rights reserved.</p>
    </footer>
  );
};

export default Footer;