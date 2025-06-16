import { useState, useEffect } from 'react';
import { Maze } from './components/Maze';
import Controls from './components/Controls';
import { ThemeToggle } from './components/ThemeToggle';
import { MazeProvider } from './context/MazeContext';
import { ErrorProvider } from './context/ErrorContext';
import AnimatedBackground from './components/AnimatedBackground';
import { FaBook, FaCode, FaChartLine, FaUsers, FaLightbulb, FaGraduationCap, FaPlay, FaGithub, FaStackOverflow } from 'react-icons/fa';
import Footer from './components/Footer';

// Features data
const features = [
  {
    icon: '🎮',
    title: 'Interactive Maze Generation',
    description: 'Create mazes with different algorithms and customize their appearance.'
  },
  {
    icon: '⚡',
    title: 'Multiple Solving Algorithms',
    description: 'Choose from various pathfinding algorithms to solve your mazes.'
  },
  {
    icon: '🎨',
    title: 'Customizable Appearance',
    description: 'Adjust cell size, colors, and animation speed to your preference.'
  },
  {
    icon: '💾',
    title: 'Save & Load Mazes',
    description: 'Save your favorite mazes and load them later to continue working.'
  },
  {
    icon: '📊',
    title: 'Performance Metrics',
    description: 'Track generation time, solving time, and path length.'
  },
  {
    icon: '🖼️',
    title: 'Export Options',
    description: 'Export your mazes as images or JSON files for sharing.'
  }
];

// Algorithm data
const algorithms = [
  {
    icon: '🔄',
    name: 'Recursive Backtracking',
    description: 'A depth-first search algorithm that creates mazes with long, winding paths.',
    complexity: 'O(n)',
    useCase: 'Best for creating complex, winding mazes'
  },
  {
    icon: '🌳',
    name: "Prim's Algorithm",
    description: 'A minimum spanning tree algorithm that creates mazes with many short paths.',
    complexity: 'O(n log n)',
    useCase: 'Best for creating mazes with many short paths'
  },
  {
    icon: '🔗',
    name: "Kruskal's Algorithm",
    description: 'Another minimum spanning tree algorithm that creates mazes with a good mix of paths.',
    complexity: 'O(n log n)',
    useCase: 'Best for creating balanced mazes'
  }
];

// Testimonials
const testimonials = [
  {
    avatar: '👨‍💻',
    quote: 'This maze generator helped me understand pathfinding algorithms better than any tutorial.',
    author: 'Alex Chen',
    role: 'Computer Science Student'
  },
  {
    avatar: '👩‍🏫',
    quote: 'I use this tool in my algorithms class to demonstrate different maze generation techniques.',
    author: 'Sarah Johnson',
    role: 'Computer Science Professor'
  },
  {
    avatar: '👨‍🎨',
    quote: 'The visualizations are beautiful and the export features are perfect for my art projects.',
    author: 'Michael Torres',
    role: 'Digital Artist'
  }
];

export default function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <ErrorProvider>
      <MazeProvider>
        <div className="min-h-screen relative overflow-hidden">
          {/* Animated Background */}
          <AnimatedBackground />
          
          {/* 3D Mouse Follow Effect */}
          <div 
            className="fixed w-[500px] h-[500px] rounded-full pointer-events-none transition-transform duration-200 ease-out"
            style={{
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 70%)',
              transform: `translate(${mousePosition.x - 250}px, ${mousePosition.y - 250}px)`,
              zIndex: 0
            }}
          />

          {/* Header */}
          <header className="glass-card sticky top-0 z-50 w-full">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <h1 className="text-2xl font-bold gradient-text">
                    Procedural Maze Generator
                  </h1>
                  <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full hover-card">
                    v1.0.0
                  </span>
                </div>
                <nav className="hidden md:flex items-center space-x-8">
                  {['Features', 'Algorithms', 'Demo', 'Testimonials'].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-all duration-300 relative group"
                    >
                      {item}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
                    </a>
                  ))}
                </nav>
                <div className="flex items-center space-x-4">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="w-full px-4 sm:px-6 lg:px-8 py-8 relative z-10">
            {/* Hero Section */}
            <section className="text-center mb-16 hover-card">
              <h2 className="text-5xl font-bold mb-6 gradient-text">
                Create Beautiful Procedural Mazes
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Generate, solve, and visualize mazes with advanced algorithms
              </p>
            </section>

            {/* Features Section */}
            <section id="features" className="mb-16">
              <h3 className="text-3xl font-bold text-center mb-8 gradient-text">Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="glass-card p-6 hover-card">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Maze Section */}
            <section className="mb-16">
              <div className="glass-card p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Maze Display */}
                  <div className="flex-1 flex justify-center items-center min-h-[400px] bg-white/5 dark:bg-black/5 rounded-lg p-4">
                    <Maze />
              </div>
                  
                  {/* Controls */}
                  <div className="w-full lg:w-80 flex-shrink-0">
                  <Controls />
                  </div>
                </div>
              </div>
            </section>

            {/* Algorithms Section */}
            <section id="algorithms" className="mb-16">
              <h3 className="text-3xl font-bold text-center mb-8 gradient-text">Generation Algorithms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {algorithms.map((algorithm, index) => (
                  <div key={index} className="glass-card p-6 hover-card">
                    <div className="text-4xl mb-4">{algorithm.icon}</div>
                    <h4 className="text-xl font-semibold mb-2">{algorithm.name}</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{algorithm.description}</p>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <p>Complexity: {algorithm.complexity}</p>
                      <p>{algorithm.useCase}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="mb-16">
              <h3 className="text-3xl font-bold text-center mb-8 gradient-text">What Users Say</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="glass-card p-6 hover-card">
                    <div className="text-4xl mb-4">{testimonial.avatar}</div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{testimonial.quote}</p>
                    <div className="text-sm">
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Documentation Section */}
            <section id="documentation" className="mb-16">
              <h3 className="text-3xl font-bold text-center mb-8 gradient-text">Documentation</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Algorithm Documentation */}
                <div className="glass-card p-6 hover-card">
                  <div className="flex items-center gap-4 mb-4">
                    <FaCode className="text-4xl text-blue-500" />
                    <h4 className="text-xl font-semibold">Algorithm Guide</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <h5 className="font-semibold mb-2">Recursive Backtracking</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        A depth-first search algorithm that builds the maze by carving paths through the grid.
                      </p>
                      <div className="bg-gray-800 text-gray-200 p-3 rounded-lg text-sm font-mono overflow-x-auto">
                        <pre>{`function recursiveBacktracking(maze, x, y) {
  // Mark current cell as visited
  maze[y][x].visited = true;
  
  // Get unvisited neighbors
  const neighbors = getUnvisitedNeighbors(maze, x, y);
  
  // While there are unvisited neighbors
  while (neighbors.length > 0) {
    // Pick random neighbor
    const next = neighbors.pop();
    
    // Remove wall between current and next
    removeWall(maze, x, y, next.x, next.y);
    
    // Recursively visit next cell
    recursiveBacktracking(maze, next.x, next.y);
  }
}`}</pre>
                      </div>
                    </div>
                    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <h5 className="font-semibold mb-2">Prim's Algorithm</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        A minimum spanning tree algorithm that creates mazes with a more uniform distribution.
                      </p>
                      <div className="bg-gray-800 text-gray-200 p-3 rounded-lg text-sm font-mono overflow-x-auto">
                        <pre>{`function primsAlgorithm(maze) {
  // Initialize with random cell
  const start = getRandomCell(maze);
  const frontier = new Set();
  
  // Add neighbors to frontier
  addToFrontier(maze, start, frontier);
  
  while (frontier.size > 0) {
    // Pick random cell from frontier
    const cell = getRandomFromFrontier(frontier);
    
    // Connect to maze
    connectToMaze(maze, cell);
    
    // Add new neighbors to frontier
    addToFrontier(maze, cell, frontier);
  }
}`}</pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Analysis */}
                <div className="glass-card p-6 hover-card">
                  <div className="flex items-center gap-4 mb-4">
                    <FaChartLine className="text-4xl text-purple-500" />
                    <h4 className="text-xl font-semibold">Performance Analysis</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <h5 className="font-semibold mb-2">Time Complexity</h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          Recursive Backtracking: O(n²)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                          Prim's Algorithm: O(n² log n)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          Kruskal's Algorithm: O(n² log n)
                      </li>
                      </ul>
                      <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                        <p className="text-sm text-gray-300">
                          n = number of cells in maze
                          <br />
                          log n = height of binary tree
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <h5 className="font-semibold mb-2">Memory Usage</h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li>Recursive Backtracking: O(n) - Call stack</li>
                        <li>Prim's Algorithm: O(n) - Priority queue</li>
                        <li>Kruskal's Algorithm: O(n) - Disjoint set</li>
                  </ul>
                    </div>
                  </div>
                </div>

                {/* Best Practices */}
                <div className="glass-card p-6 hover-card">
                  <div className="flex items-center gap-4 mb-4">
                    <FaLightbulb className="text-4xl text-yellow-500" />
                    <h4 className="text-xl font-semibold">Best Practices</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <h5 className="font-semibold mb-2">Maze Design</h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></span>
                          <span>Keep dimensions reasonable (5-100) for optimal performance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></span>
                          <span>Choose algorithm based on desired maze characteristics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></span>
                          <span>Balance between complexity and solvability</span>
                        </li>
                      </ul>
                    </div>
                    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <h5 className="font-semibold mb-2">Performance Tips</h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500 mt-2"></span>
                          <span>Use animation speed control for larger mazes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500 mt-2"></span>
                          <span>Adjust cell size based on maze dimensions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500 mt-2"></span>
                          <span>Consider memory constraints for very large mazes</span>
                        </li>
                  </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Learning Resources */}
            <section id="learning" className="mb-16">
              <h3 className="text-3xl font-bold text-center mb-8 gradient-text">Learning Resources</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tutorials */}
                <div className="glass-card p-6 hover-card">
                  <div className="flex items-center gap-4 mb-4">
                    <FaGraduationCap className="text-4xl text-green-500" />
                    <h4 className="text-xl font-semibold">Tutorials</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <h5 className="font-semibold mb-2">Getting Started</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        Learn the basics of maze generation and solving algorithms.
                      </p>
                      <div className="flex gap-2">
                        <button className="btn-primary text-sm flex items-center gap-2">
                          <FaPlay className="text-xs" />
                          Start Tutorial
                        </button>
                        <button className="btn-secondary text-sm flex items-center gap-2">
                          <FaBook className="text-xs" />
                          Read Guide
                        </button>
                      </div>
                    </div>
                    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <h5 className="font-semibold mb-2">Advanced Concepts</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        Dive deep into algorithm implementations and optimizations.
                      </p>
                      <div className="flex gap-2">
                        <button className="btn-primary text-sm flex items-center gap-2">
                          <FaCode className="text-xs" />
                          View Examples
                        </button>
                        <button className="btn-secondary text-sm flex items-center gap-2">
                          <FaStackOverflow className="text-xs" />
                          Q&A
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Community */}
                <div className="glass-card p-6 hover-card">
                  <div className="flex items-center gap-4 mb-4">
                    <FaUsers className="text-4xl text-red-500" />
                    <h4 className="text-xl font-semibold">Community</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <h5 className="font-semibold mb-2">Share Your Mazes</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        Export and share your creations with the community.
                      </p>
                      <div className="flex gap-2">
                        <button className="btn-success text-sm flex items-center gap-2">
                          <FaGithub className="text-xs" />
                          GitHub
                        </button>
                        <button className="btn-info text-sm flex items-center gap-2">
                          <FaUsers className="text-xs" />
                          Community
                        </button>
                      </div>
                    </div>
                    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <h5 className="font-semibold mb-2">Contribute</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        Help improve the project by contributing new features or algorithms.
                      </p>
                      <div className="flex gap-2">
                        <button className="btn-primary text-sm flex items-center gap-2">
                          <FaCode className="text-xs" />
                          Contribute
                        </button>
                        <button className="btn-secondary text-sm flex items-center gap-2">
                          <FaBook className="text-xs" />
                          Guidelines
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </MazeProvider>
    </ErrorProvider>
  );
}
