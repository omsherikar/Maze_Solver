import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { Maze, Position, GenerationAlgorithm, SolvingAlgorithm } from '../types/maze';
import { createEmptyMaze } from '../utils/mazeUtils';
import { recursiveBacktracking, primsAlgorithm, kruskalsAlgorithm } from '../algorithms/generation';
import { bfs, aStar, dijkstra } from '../algorithms/solving';

interface MazeState {
  maze: Maze;
  width: number;
  height: number;
  cellSize: number;
  startPosition: Position | null;
  endPosition: Position | null;
  isGenerating: boolean;
  isSolving: boolean;
  isPaused: boolean;
  generationAlgorithm: GenerationAlgorithm;
  solvingAlgorithm: SolvingAlgorithm;
  generationProgress: number;
  solvingProgress: number;
  generationTime: number;
  solvingTime: number;
  animationSpeed: number;
  performanceMetrics: {
    generationTime: number;
    solvingTime: number;
    pathLength: number;
    cellsExplored: number;
  } | null;
}

type MazeAction =
  | { type: 'SET_MAZE'; payload: Maze }
  | { type: 'SET_WIDTH'; payload: number }
  | { type: 'SET_HEIGHT'; payload: number }
  | { type: 'SET_CELL_SIZE'; payload: number }
  | { type: 'SET_START_POSITION'; payload: Position | null }
  | { type: 'SET_END_POSITION'; payload: Position | null }
  | { type: 'SET_IS_GENERATING'; payload: boolean }
  | { type: 'SET_IS_SOLVING'; payload: boolean }
  | { type: 'SET_IS_PAUSED'; payload: boolean }
  | { type: 'SET_GENERATION_ALGORITHM'; payload: GenerationAlgorithm }
  | { type: 'SET_SOLVING_ALGORITHM'; payload: SolvingAlgorithm }
  | { type: 'SET_GENERATION_PROGRESS'; payload: number }
  | { type: 'SET_SOLVING_PROGRESS'; payload: number }
  | { type: 'SET_GENERATION_TIME'; payload: number }
  | { type: 'SET_SOLVING_TIME'; payload: number }
  | { type: 'SET_ANIMATION_SPEED'; payload: number }
  | { type: 'SET_PERFORMANCE_METRICS'; payload: MazeState['performanceMetrics'] }
  | { type: 'RESET_MAZE' };

const initialState: MazeState = {
  maze: createEmptyMaze(20, 20),
  width: 20,
  height: 20,
  cellSize: 30,
  startPosition: null,
  endPosition: null,
  isGenerating: false,
  isSolving: false,
  isPaused: false,
  generationAlgorithm: 'recursive-backtracking',
  solvingAlgorithm: 'bfs',
  generationProgress: 0,
  solvingProgress: 0,
  generationTime: 0,
  solvingTime: 0,
  animationSpeed: 200,
  performanceMetrics: null,
};

function mazeReducer(state: MazeState, action: MazeAction): MazeState {
  switch (action.type) {
    case 'SET_MAZE':
      return { ...state, maze: action.payload };
    case 'SET_WIDTH':
      return { ...state, width: action.payload };
    case 'SET_HEIGHT':
      return { ...state, height: action.payload };
    case 'SET_CELL_SIZE':
      return { ...state, cellSize: action.payload };
    case 'SET_START_POSITION':
      return { ...state, startPosition: action.payload };
    case 'SET_END_POSITION':
      return { ...state, endPosition: action.payload };
    case 'SET_IS_GENERATING':
      return { ...state, isGenerating: action.payload };
    case 'SET_IS_SOLVING':
      return { ...state, isSolving: action.payload };
    case 'SET_IS_PAUSED':
      return { ...state, isPaused: action.payload };
    case 'SET_GENERATION_ALGORITHM':
      return { ...state, generationAlgorithm: action.payload };
    case 'SET_SOLVING_ALGORITHM':
      return { ...state, solvingAlgorithm: action.payload };
    case 'SET_GENERATION_PROGRESS':
      return { ...state, generationProgress: action.payload };
    case 'SET_SOLVING_PROGRESS':
      return { ...state, solvingProgress: action.payload };
    case 'SET_GENERATION_TIME':
      return { ...state, generationTime: action.payload };
    case 'SET_SOLVING_TIME':
      return { ...state, solvingTime: action.payload };
    case 'SET_ANIMATION_SPEED':
      return { ...state, animationSpeed: action.payload };
    case 'SET_PERFORMANCE_METRICS':
      return { ...state, performanceMetrics: action.payload };
    case 'RESET_MAZE':
      return {
        ...initialState,
        width: state.width,
        height: state.height,
        cellSize: state.cellSize,
        generationAlgorithm: state.generationAlgorithm,
        solvingAlgorithm: state.solvingAlgorithm,
        animationSpeed: state.animationSpeed,
      };
    default:
      return state;
  }
}

interface MazeContextType {
  state: MazeState;
  dispatch: React.Dispatch<MazeAction>;
  generateMaze: (maze: Maze) => void;
  solveMaze: (start: Position, end: Position) => Promise<void>;
  resetMaze: () => void;
  setCellSize: (size: number) => void;
  setAnimationSpeed: (speed: number) => void;
  setStartPosition: (position: Position | null) => void;
  setEndPosition: (position: Position | null) => void;
  togglePause: () => void;
}

const MazeContext = createContext<MazeContextType | undefined>(undefined);

export function MazeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(mazeReducer, initialState);
  const generatorRef = React.useRef<Generator<Maze, void, unknown> | null>(null);
  const solverRef = React.useRef<Generator<Position[], void, unknown> | null>(null);
  const isRunningRef = React.useRef<boolean>(false);
  const speedRef = React.useRef<number>(state.animationSpeed);
  const runGenerationStartTimeRef = React.useRef<number | null>(null);
  const runGenerationStepsRef = React.useRef<number>(0);
  const runSolvingStartTimeRef = React.useRef<number | null>(null);
  const runSolvingStepsRef = React.useRef<number>(0);

  // Update speedRef when animationSpeed changes
  React.useEffect(() => {
    speedRef.current = state.animationSpeed;
  }, [state.animationSpeed]);

  const runGeneration = useCallback(() => {
    if (!generatorRef.current || !isRunningRef.current) return;

    // Track start time and steps
    if (!runGenerationStartTimeRef.current) runGenerationStartTimeRef.current = Date.now();
    if (!runGenerationStepsRef.current) runGenerationStepsRef.current = 0;

    try {
      const result = generatorRef.current.next();
      if (!result.done) {
        dispatch({ type: 'SET_MAZE', payload: result.value });
        runGenerationStepsRef.current++;
        dispatch({ type: 'SET_GENERATION_PROGRESS', payload: runGenerationStepsRef.current });
        dispatch({ type: 'SET_GENERATION_TIME', payload: Date.now() - runGenerationStartTimeRef.current });
        // Use the current speed from the ref
        const currentSpeed = speedRef.current;
        if (isRunningRef.current) {
          setTimeout(runGeneration, currentSpeed);
        }
      } else {
        isRunningRef.current = false;
        dispatch({ type: 'SET_IS_GENERATING', payload: false });
        dispatch({ type: 'SET_IS_PAUSED', payload: false });
        dispatch({ type: 'SET_GENERATION_TIME', payload: Date.now() - (runGenerationStartTimeRef.current || 0) });
        dispatch({ type: 'SET_GENERATION_PROGRESS', payload: runGenerationStepsRef.current });
        runGenerationStartTimeRef.current = null;
        runGenerationStepsRef.current = 0;
        generatorRef.current = null;
      }
    } catch (error) {
      console.error('Error in generation:', error);
      isRunningRef.current = false;
      dispatch({ type: 'SET_IS_GENERATING', payload: false });
      dispatch({ type: 'SET_IS_PAUSED', payload: false });
      generatorRef.current = null;
    }
  }, []);

  const runSolving = useCallback(() => {
    if (!solverRef.current || !state.maze || !isRunningRef.current) return;

    // Track start time and steps
    if (!runSolvingStartTimeRef.current) runSolvingStartTimeRef.current = Date.now();
    if (!runSolvingStepsRef.current) runSolvingStepsRef.current = 0;

    try {
      const result = solverRef.current.next();
      if (!result.done) {
        const path = result.value;
        const newMaze = state.maze.map((row, y) =>
          row.map((cell, x) => ({
            ...cell,
            isPath: path.some(pos => pos.x === x && pos.y === y)
          }))
        );
        dispatch({ type: 'SET_MAZE', payload: newMaze });
        runSolvingStepsRef.current++;
        dispatch({ type: 'SET_SOLVING_PROGRESS', payload: runSolvingStepsRef.current });
        dispatch({ type: 'SET_SOLVING_TIME', payload: Date.now() - runSolvingStartTimeRef.current });
        // Use the current speed from the ref
        const currentSpeed = speedRef.current;
        if (isRunningRef.current) {
          setTimeout(runSolving, currentSpeed);
        }
      } else {
        isRunningRef.current = false;
        dispatch({ type: 'SET_IS_SOLVING', payload: false });
        dispatch({ type: 'SET_IS_PAUSED', payload: false });
        dispatch({ type: 'SET_SOLVING_TIME', payload: Date.now() - (runSolvingStartTimeRef.current || 0) });
        dispatch({ type: 'SET_SOLVING_PROGRESS', payload: runSolvingStepsRef.current });
        // Set path length in performanceMetrics
        const finalPath = solverRef.current && solverRef.current.next().value;
        dispatch({ type: 'SET_PERFORMANCE_METRICS', payload: {
          generationTime: state.generationTime,
          solvingTime: Date.now() - (runSolvingStartTimeRef.current || 0),
          pathLength: Array.isArray(finalPath) ? finalPath.length : 0,
          cellsExplored: runSolvingStepsRef.current,
        }});
        runSolvingStartTimeRef.current = null;
        runSolvingStepsRef.current = 0;
        solverRef.current = null;
      }
    } catch (error) {
      console.error('Error in solving:', error);
      isRunningRef.current = false;
      dispatch({ type: 'SET_IS_SOLVING', payload: false });
      dispatch({ type: 'SET_IS_PAUSED', payload: false });
      solverRef.current = null;
    }
  }, [state.maze]);

  const togglePause = useCallback(() => {
    if (!state.isGenerating && !state.isSolving) return;
    
    if (state.isPaused) {
      // Resume
      isRunningRef.current = true;
      dispatch({ type: 'SET_IS_PAUSED', payload: false });
      if (state.isGenerating) {
        runGeneration();
      } else if (state.isSolving) {
        runSolving();
      }
    } else {
      // Pause
      isRunningRef.current = false;
      dispatch({ type: 'SET_IS_PAUSED', payload: true });
    }
  }, [state.isGenerating, state.isSolving, state.isPaused, runGeneration, runSolving]);

  const generateMaze = useCallback(async (maze: Maze) => {
    if (state.isGenerating) return;

    dispatch({ type: 'SET_IS_GENERATING', payload: true });
    dispatch({ type: 'SET_IS_PAUSED', payload: false });
    isRunningRef.current = true;

    switch (state.generationAlgorithm) {
      case 'recursive-backtracking':
        generatorRef.current = recursiveBacktracking(maze);
        break;
      case 'prims':
        generatorRef.current = primsAlgorithm(maze);
        break;
      case 'kruskals':
        generatorRef.current = kruskalsAlgorithm(maze);
        break;
      default:
        generatorRef.current = recursiveBacktracking(maze);
    }

    runGeneration();
  }, [state.isGenerating, state.generationAlgorithm, runGeneration]);

  const solveMaze = useCallback(async (start: Position, end: Position) => {
    if (!state.maze) return;

    dispatch({ type: 'SET_IS_SOLVING', payload: true });
    dispatch({ type: 'SET_IS_PAUSED', payload: false });
    isRunningRef.current = true;

    switch (state.solvingAlgorithm) {
      case 'bfs':
        solverRef.current = bfs(state.maze, start, end);
        break;
      case 'a-star':
        solverRef.current = aStar(state.maze, start, end);
        break;
      case 'dijkstra':
        solverRef.current = dijkstra(state.maze, start, end);
        break;
      default:
        solverRef.current = bfs(state.maze, start, end);
      }

    runSolving();
  }, [state.maze, state.solvingAlgorithm, runSolving]);

  const setAnimationSpeed = useCallback((speed: number) => {
    dispatch({ type: 'SET_ANIMATION_SPEED', payload: speed });
  }, []);

  const value = {
      state,
      dispatch,
      generateMaze,
      solveMaze,
    resetMaze: () => dispatch({ type: 'RESET_MAZE' }),
    setCellSize: (size: number) => dispatch({ type: 'SET_CELL_SIZE', payload: size }),
      setAnimationSpeed,
    setStartPosition: (position: Position | null) => dispatch({ type: 'SET_START_POSITION', payload: position }),
    setEndPosition: (position: Position | null) => dispatch({ type: 'SET_END_POSITION', payload: position }),
    togglePause
  };

  return (
    <MazeContext.Provider value={value}>
      {children}
    </MazeContext.Provider>
  );
}

export function useMaze() {
  const context = useContext(MazeContext);
  if (context === undefined) {
    throw new Error('useMaze must be used within a MazeProvider');
  }
  return context;
} 