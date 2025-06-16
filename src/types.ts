export interface Cell {
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  isPath?: boolean;
  isStart?: boolean;
  isEnd?: boolean;
}

export type Maze = Cell[][];

export type Position = {
  x: number;
  y: number;
};

export type GenerationAlgorithm = 'recursive-backtracking' | 'prims' | 'kruskals';
export type SolvingAlgorithm = 'bfs' | 'a-star' | 'dijkstra'; 