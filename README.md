# 🎮 Procedural Maze Generator

A modern, interactive web application for generating and solving mazes using various algorithms. Built with React, TypeScript, and Tailwind CSS.

![Maze Generator Demo](https://github.com/omsherikar/Maze_Solver/blob/main/demo.gif)

## ✨ Features

- **Multiple Generation Algorithms**
  - Recursive Backtracking
  - Prim's Algorithm
  - Kruskal's Algorithm

- **Various Solving Methods**
  - Breadth-First Search (BFS)
  - A* Search
  - Dijkstra's Algorithm

- **Interactive Controls**
  - Adjustable maze dimensions (5x5 to 100x100)
  - Customizable cell size
  - Animation speed control
  - Start/End point placement
  - Demo mode for quick visualization

- **Visual Features**
  - Real-time maze generation animation
  - Path solving visualization
  - Dark/Light theme support
  - Responsive design
  - Beautiful UI with glass-morphism effects
  - Animated background

- **Performance Metrics**
  - Generation time
  - Solving time
  - Path length
  - Cells explored

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/omsherikar/Maze_Solver.git
   cd Maze_Solver
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🎯 Usage

### Generating a Maze

1. Set the desired dimensions using the width and height sliders
2. Choose a generation algorithm from the dropdown
3. Click "Generate Maze" to create a new maze

### Solving the Maze

1. Click and drag to set the start point (blue)
2. Click and drag to set the end point (red)
3. Select a solving algorithm
4. Click "Solve Maze" to find the path

### Additional Controls

- **Demo Button**: Automatically generates and solves a maze
- **Pause/Resume**: Control the animation
- **Reset**: Clear the current maze
- **Export**: Save the maze as a PNG image
- **Theme Toggle**: Switch between light and dark modes

## 🛠️ Technologies Used

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React Context API
- **Icons**: React Icons
- **Animations**: CSS Transitions and Keyframes
- **Code Quality**: ESLint, TypeScript

## 📁 Project Structure

```
src/
├── algorithms/         # Maze generation and solving algorithms
├── components/         # React components
├── context/           # React context providers
├── styles/            # Global styles and animations
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── App.tsx            # Main application component
```

## 🎨 Customization

### Theme Colors

The application supports both light and dark themes. You can customize the colors by modifying the theme variables in `src/index.css`.

### Animation Speed

Adjust the animation speed using the slider in the controls panel. The speed ranges from 1x (slow) to 10x (fast).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Om Sherikar
- GitHub: [@omsherikar](https://github.com/omsherikar)

## 🙏 Acknowledgments

- Inspired by various maze generation algorithms
- Built with modern web technologies
- Special thanks to the React and Tailwind CSS communities
