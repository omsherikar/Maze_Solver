import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin, FaHeart } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 mt-16 border-t border-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-500">Maze Generator</h3>
            <p className="text-gray-400 text-sm">
              A powerful tool for generating and visualizing mazes using various algorithms.
              Perfect for learning, teaching, and exploring pathfinding concepts.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-500">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#algorithms" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Algorithms
                </a>
              </li>
              <li>
                <a href="#documentation" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#learning" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Learning Resources
                </a>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-500">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FaGithub className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FaTwitter className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FaLinkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-8 border-t border-gray-800/50 text-center">
          <p className="text-gray-400 text-sm">
            Made with <FaHeart className="inline-block text-red-500 mx-1" /> by{' '}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Om Sherikar
            </a>
          </p>
          <p className="text-gray-500 text-xs mt-2">
            © {new Date().getFullYear()} Maze Generator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 