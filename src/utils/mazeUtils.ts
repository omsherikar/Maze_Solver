import type { Maze, Cell, Position } from '../types/maze';

export function createEmptyMaze(width: number, height: number): Maze {
  return Array(height).fill(null).map((_, y) =>
    Array(width).fill(null).map((_, x) => ({
      x,
      y,
      walls: {
        top: true,
        right: true,
        bottom: true,
        left: true,
      },
      visited: false,
    }))
  );
}

export function getNeighbors(cell: Cell, maze: Maze): Cell[] {
  const neighbors: Cell[] = [];
  const { x, y } = cell;

  // Check all four directions
  if (y > 0) neighbors.push(maze[y - 1][x]); // Top
  if (x < maze[0].length - 1) neighbors.push(maze[y][x + 1]); // Right
  if (y < maze.length - 1) neighbors.push(maze[y + 1][x]); // Bottom
  if (x > 0) neighbors.push(maze[y][x - 1]); // Left

  return neighbors.filter(neighbor => !neighbor.visited);
}

export function removeWall(cell1: Cell, cell2: Cell): void {
  const dx = cell2.x - cell1.x;
  const dy = cell2.y - cell1.y;

  if (dx === 1) {
    cell1.walls.right = false;
    cell2.walls.left = false;
  } else if (dx === -1) {
    cell1.walls.left = false;
    cell2.walls.right = false;
  }

  if (dy === 1) {
    cell1.walls.bottom = false;
    cell2.walls.top = false;
  } else if (dy === -1) {
    cell1.walls.top = false;
    cell2.walls.bottom = false;
  }
}

export function getRandomPosition(maze: Maze): Position {
  return {
    x: Math.floor(Math.random() * maze[0].length),
    y: Math.floor(Math.random() * maze.length),
  };
}

export function isValidPosition(pos: Position, maze: Maze): boolean {
  return pos.x >= 0 && pos.x < maze[0].length && pos.y >= 0 && pos.y < maze.length;
}

export function getCellAtPosition(pos: Position, maze: Maze): Cell | null {
  if (!isValidPosition(pos, maze)) return null;
  return maze[pos.y][pos.x];
}

export function canMove(from: Cell, to: Cell): boolean {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (dx === 1) return !from.walls.right && !to.walls.left;
  if (dx === -1) return !from.walls.left && !to.walls.right;
  if (dy === 1) return !from.walls.bottom && !to.walls.top;
  if (dy === -1) return !from.walls.top && !to.walls.bottom;

  return false;
} 