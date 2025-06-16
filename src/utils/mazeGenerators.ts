import type { Maze, Cell } from '../types/maze';
import { getNeighbors, removeWall } from './mazeUtils';

export async function* recursiveBacktracking(maze: Maze): AsyncGenerator<Maze, void, unknown> {
  const stack: Cell[] = [];
  const startCell = maze[0][0];
  startCell.visited = true;
  stack.push(startCell);

  while (stack.length > 0) {
    const currentCell = stack[stack.length - 1];
    const neighbors = getNeighbors(currentCell, maze);

    if (neighbors.length === 0) {
      stack.pop();
      continue;
    }

    const nextCell = neighbors[Math.floor(Math.random() * neighbors.length)];
    nextCell.visited = true;
    removeWall(currentCell, nextCell);
    stack.push(nextCell);

    yield maze;
  }
}

export async function* primsAlgorithm(maze: Maze): AsyncGenerator<Maze, void, unknown> {
  const walls: Array<[Cell, Cell]> = [];
  const startCell = maze[0][0];
  startCell.visited = true;

  // Add initial walls
  const initialNeighbors = getNeighbors(startCell, maze);
  initialNeighbors.forEach(neighbor => {
    walls.push([startCell, neighbor]);
  });

  while (walls.length > 0) {
    const randomIndex = Math.floor(Math.random() * walls.length);
    const [cell1, cell2] = walls[randomIndex];
    walls.splice(randomIndex, 1);

    if (cell2.visited) continue;

    cell2.visited = true;
    removeWall(cell1, cell2);

    // Add new walls
    const newNeighbors = getNeighbors(cell2, maze);
    newNeighbors.forEach(neighbor => {
      walls.push([cell2, neighbor]);
    });

    yield maze;
  }
} 