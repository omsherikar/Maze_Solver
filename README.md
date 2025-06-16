# Procedural Maze Generator

A React-based web application that generates and solves mazes using various algorithms. The application features a responsive design with light/dark theme support and allows users to visualize the maze generation and solving process step by step.

## Features

- Generate mazes with adjustable dimensions (width and height)
- Choose between two maze generation algorithms:
  - Recursive Backtracking
  - Prim's Algorithm
- Visualize maze generation and solving process with animations
- Solve mazes using two different algorithms:
  - Breadth-First Search (BFS)
  - A* Search
- Control maze generation and solving with Start, Pause, and Reset functionality
- Set custom start and end points
- Export mazes as PNG images
- Responsive design for both desktop and mobile devices
- Light/dark theme support
- Keyboard accessibility and ARIA attributes

## Technologies Used

- React with TypeScript
- Tailwind CSS for styling
- Vite for build tooling
- HTML-to-Image for maze export
- Heroicons for UI icons

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Adjust the maze dimensions using the width and height inputs
2. Select a maze generation algorithm
3. Click "Generate Maze" to create a new maze
4. Set start and end points by clicking on the maze cells
5. Choose a solving algorithm
6. Click "Solve Maze" to find the path
7. Use the Pause button to pause/resume the generation or solving process
8. Export the maze as a PNG image using the Export button
9. Toggle between light and dark themes using the theme button

## Project Structure

```
src/
├── components/
│   ├── Controls.tsx      # Maze generation and solving controls
│   ├── Maze.tsx         # Maze visualization component
│   └── ThemeToggle.tsx  # Theme switching component
├── context/
│   └── MazeContext.tsx  # Global state management
├── utils/
│   ├── mazeGenerators.ts # Maze generation algorithms
│   ├── mazeSolvers.ts   # Maze solving algorithms
│   └── mazeUtils.ts     # Utility functions
├── types/
│   └── maze.ts         # TypeScript type definitions
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
