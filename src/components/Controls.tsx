import React, { useState, useCallback } from 'react';
import { useMaze } from '../context/MazeContext';
import { useError } from '../context/ErrorContext';
import { GenerationAlgorithm, SolvingAlgorithm } from '../types';
import { createEmptyMaze } from '../utils/mazeUtils';
import toast from 'react-hot-toast';

const generationAlgorithms: { value: GenerationAlgorithm; label: string }[] = [
  { value: 'recursive-backtracking', label: 'Recursive Backtracking' },
  { value: 'prims', label: "Prim's Algorithm" },
  { value: 'kruskals', label: "Kruskal's Algorithm" }
];

const solvingAlgorithms: { value: SolvingAlgorithm; label: string }[] = [
  { value: 'bfs', label: 'Breadth-First Search' },
  { value: 'a-star', label: 'A* Search' },
  { value: 'dijkstra', label: "Dijkstra's Algorithm" }
];

const Controls: React.FC = () => {
  const { 
    state, 
    generateMaze, 
    solveMaze, 
    resetMaze, 
    setCellSize, 
    setAnimationSpeed, 
    setStartPosition, 
    setEndPosition,
    togglePause,
    dispatch
  } = useMaze();
  const { showError } = useError();
  const [dimensions, setDimensions] = useState({ width: 20, height: 20 });

  const handleGenerate = useCallback(async () => {
    if (state.isGenerating || state.isSolving) {
      showError('Please wait for the current operation to complete', 'warning');
      return;
    }

    if (dimensions.width < 5 || dimensions.height < 5) {
      showError('Maze dimensions must be at least 5x5', 'error');
      return;
    }

    if (dimensions.width > 100 || dimensions.height > 100) {
      showError('Maze dimensions cannot exceed 100x100', 'error');
      return;
    }

    try {
      const maze = createEmptyMaze(dimensions.width, dimensions.height);
      await generateMaze(maze);
      setStartPosition(null);
      setEndPosition(null);
    } catch (error) {
      showError('Failed to generate maze', 'error');
    }
  }, [state.isGenerating, state.isSolving, dimensions, generateMaze, setStartPosition, setEndPosition, showError]);

  const handleSolve = useCallback(async () => {
    if (!state.maze) {
      showError('Please generate a maze first', 'error');
      return;
    }

    if (state.isGenerating || state.isSolving) {
      showError('Please wait for the current operation to complete', 'warning');
      return;
    }

    if (!state.startPosition || !state.endPosition) {
      showError('Please set both start and end points', 'error');
      return;
    }

    try {
      await solveMaze(state.startPosition, state.endPosition);
    } catch (error) {
      showError('Failed to solve maze', 'error');
    }
  }, [state.maze, state.isGenerating, state.isSolving, state.startPosition, state.endPosition, solveMaze, showError]);

  const handleReset = useCallback(() => {
    if (state.isGenerating || state.isSolving) {
      showError('Please wait for the current operation to complete', 'warning');
      return;
    }
    resetMaze();
  }, [state.isGenerating, state.isSolving, resetMaze, showError]);

  const handleExport = useCallback(async () => {
    if (!state.maze) {
      showError('Please generate a maze first', 'error');
      return;
    }

    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Set canvas size
      const padding = 20;
      const cellSize = 30;
      canvas.width = state.width * cellSize + padding * 2;
      canvas.height = state.height * cellSize + padding * 2;

      // Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw maze
      for (let y = 0; y < state.height; y++) {
        for (let x = 0; x < state.width; x++) {
          const cell = state.maze[y][x];
          const cellX = x * cellSize + padding;
          const cellY = y * cellSize + padding;

          // Draw cell background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(cellX, cellY, cellSize, cellSize);

          // Draw walls
          ctx.strokeStyle = '#1a1a1a';
          ctx.lineWidth = 2;

          if (cell.walls.top) {
            ctx.beginPath();
            ctx.moveTo(cellX, cellY);
            ctx.lineTo(cellX + cellSize, cellY);
            ctx.stroke();
          }
          if (cell.walls.right) {
            ctx.beginPath();
            ctx.moveTo(cellX + cellSize, cellY);
            ctx.lineTo(cellX + cellSize, cellY + cellSize);
            ctx.stroke();
          }
          if (cell.walls.bottom) {
            ctx.beginPath();
            ctx.moveTo(cellX, cellY + cellSize);
            ctx.lineTo(cellX + cellSize, cellY + cellSize);
            ctx.stroke();
          }
          if (cell.walls.left) {
            ctx.beginPath();
            ctx.moveTo(cellX, cellY);
            ctx.lineTo(cellX, cellY + cellSize);
            ctx.stroke();
          }

          // Draw path if exists
          if (cell.isPath) {
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(cellX + 2, cellY + 2, cellSize - 4, cellSize - 4);
          }

          // Draw start position
          if (state.startPosition?.x === x && state.startPosition?.y === y) {
            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(cellX + 2, cellY + 2, cellSize - 4, cellSize - 4);
          }

          // Draw end position
          if (state.endPosition?.x === x && state.endPosition?.y === y) {
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(cellX + 2, cellY + 2, cellSize - 4, cellSize - 4);
          }
        }
      }

      // Create download link
      const link = document.createElement('a');
      link.download = `maze-${dimensions.width}x${dimensions.height}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      toast.success('Maze exported as PNG!');
    } catch (error) {
      console.error('Export error:', error);
      showError('Failed to export maze', 'error');
    }
  }, [state.maze, state.width, state.height, state.startPosition, state.endPosition, dimensions, showError]);

  const handleCellSizeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value);
    if (size >= 10 && size <= 50) {
      setCellSize(size);
    }
  }, [setCellSize]);

  const handleAnimationSpeedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseInt(e.target.value);
    if (speed >= 1 && speed <= 10) {
      // Convert speed from 1-10 range to milliseconds (1000ms to 50ms)
      const milliseconds = Math.round(1000 / speed);
      setAnimationSpeed(milliseconds);
    }
  }, [setAnimationSpeed]);

  const handlePauseToggle = useCallback(() => {
    if (!state.isGenerating && !state.isSolving) {
      showError('No operation in progress to pause', 'warning');
      return;
    }
    togglePause();
  }, [state.isGenerating, state.isSolving, togglePause, showError]);

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-neutral-900 rounded-xl shadow text-neutral-800 dark:text-neutral-200">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">Maze Controls</h2>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Dimensions</label>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="w-16">Width</span>
              <input
                type="range"
                min="5"
                max="100"
                value={dimensions.width}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setDimensions(prev => ({ ...prev, width: value }));
                  dispatch({ type: 'SET_WIDTH', payload: value });
                }}
                className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                aria-label="Maze width"
              />
              <span className="w-10 text-right font-mono">{dimensions.width}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-16">Height</span>
              <input
                type="range"
                min="5"
                max="100"
                value={dimensions.height}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setDimensions(prev => ({ ...prev, height: value }));
                  dispatch({ type: 'SET_HEIGHT', payload: value });
                }}
                className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                aria-label="Maze height"
              />
              <span className="w-10 text-right font-mono">{dimensions.height}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Generation Algorithm</label>
          <select
            value={state.generationAlgorithm}
            onChange={(e) => dispatch({ type: 'SET_GENERATION_ALGORITHM', payload: e.target.value as GenerationAlgorithm })}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-neutral-800 dark:text-neutral-100"
            disabled={state.isGenerating || state.isSolving}
          >
            {generationAlgorithms.map((algo) => (
              <option key={algo.value} value={algo.value}>
                {algo.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Solving Algorithm</label>
          <select
            value={state.solvingAlgorithm}
            onChange={(e) => dispatch({ type: 'SET_SOLVING_ALGORITHM', payload: e.target.value as SolvingAlgorithm })}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-neutral-800 dark:text-neutral-100"
            disabled={state.isGenerating || state.isSolving}
          >
            {solvingAlgorithms.map((algo) => (
              <option key={algo.value} value={algo.value}>
                {algo.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Cell Size: {state.cellSize}px</label>
          <input
            type="range"
            min="10"
            max="50"
            value={state.cellSize}
            onChange={handleCellSizeChange}
            className="w-full"
          />
        </div>

        <div className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Animation Speed
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="10"
                value={Math.round(1000 / state.animationSpeed)}
                onChange={handleAnimationSpeedChange}
                className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-neutral-600 dark:text-neutral-400 min-w-[3rem] text-right">
                {Math.round(1000 / state.animationSpeed)}x
              </span>
            </div>
            <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleGenerate}
            disabled={state.isGenerating || state.isSolving}
            className="btn-primary"
          >
            {state.isGenerating ? 'Generating...' : 'Generate Maze'}
          </button>
          <button
            onClick={handleSolve}
            disabled={state.isGenerating || state.isSolving || !state.maze || !state.startPosition || !state.endPosition}
            className="btn-secondary"
          >
            {state.isSolving ? 'Solving...' : 'Solve Maze'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handlePauseToggle}
            disabled={!state.isGenerating && !state.isSolving}
            className={`${state.isPaused ? 'btn-warning' : 'btn-info'}`}
          >
            {state.isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={handleReset}
            disabled={state.isGenerating || state.isSolving}
            className="btn-danger"
          >
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={handleExport}
            disabled={!state.maze}
            className="btn-success"
          >
            Export
          </button>
        </div>
      </div>

      {state.performanceMetrics && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
          <div className="space-y-1 text-sm">
            <p>Generation Time: {state.performanceMetrics.generationTime}ms</p>
            <p>Solving Time: {state.performanceMetrics.solvingTime}ms</p>
            <p>Path Length: {state.performanceMetrics.pathLength} cells</p>
            <p>Cells Explored: {state.performanceMetrics.cellsExplored}</p>
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        <p className="font-medium mb-2">Instructions:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Set maze dimensions (5-100)</li>
          <li>Adjust cell size (10-50px)</li>
          <li>Set animation speed (1-10x)</li>
          <li>Click and drag to set start/end points</li>
          <li>Generate and solve the maze</li>
          <li>Export as PNG when done</li>
        </ul>
      </div>
    </div>
  );
};

export default Controls; 