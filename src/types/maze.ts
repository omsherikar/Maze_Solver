export interface Position {
  x: number;
  y: number;
}

export interface Cell {
  x: number;
  y: number;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean;
  isPath?: boolean;
}

export type Maze = Cell[][];

export type GenerationAlgorithm = 'recursive-backtracking' | 'prims' | 'kruskals';
export type SolvingAlgorithm = 'bfs' | 'a-star' | 'dijkstra';

export type MazeGenerationAlgorithm = 'recursive-backtracking' | 'prims';
export type MazeSolvingAlgorithm = 'bfs' | 'a-star';

export type MazeState = {
  maze: Maze;
  width: number;
  height: number;
  startPosition: Position | null;
  endPosition: Position | null;
  isGenerating: boolean;
  isSolving: boolean;
  generationAlgorithm: MazeGenerationAlgorithm;
  solvingAlgorithm: MazeSolvingAlgorithm;
  isPaused: boolean;
}; 