import type { Maze, Cell, Position } from '../types/maze';
import { getCellAtPosition, canMove } from './mazeUtils';

type QueueItem = {
  cell: Cell;
  path: Cell[];
};

function getNeighborsForSolving(cell: Cell, maze: Maze): Cell[] {
  const neighbors: Cell[] = [];
  const { x, y } = cell;

  const directions = [
    { dx: 0, dy: -1 }, // Top
    { dx: 1, dy: 0 },  // Right
    { dx: 0, dy: 1 },  // Bottom
    { dx: -1, dy: 0 }, // Left
  ];

  for (const { dx, dy } of directions) {
    const newPos: Position = { x: x + dx, y: y + dy };
    const neighbor = getCellAtPosition(newPos, maze);
    if (neighbor && canMove(cell, neighbor)) {
      neighbors.push(neighbor);
    }
  }

  return neighbors;
}

export async function* bfs(
  maze: Maze,
  start: Position,
  end: Position
): AsyncGenerator<Cell[], void, unknown> {
  const startCell = getCellAtPosition(start, maze);
  const endCell = getCellAtPosition(end, maze);
  
  if (!startCell || !endCell) return;

  const queue: QueueItem[] = [{ cell: startCell, path: [startCell] }];
  const visited = new Set<Cell>();

  while (queue.length > 0) {
    const { cell, path } = queue.shift()!;
    
    if (cell === endCell) {
      yield path;
      return;
    }

    if (visited.has(cell)) continue;
    visited.add(cell);

    const neighbors = getNeighborsForSolving(cell, maze);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push({ cell: neighbor, path: [...path, neighbor] });
      }
    }

    yield path;
  }
}

function heuristic(a: Position, b: Position): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export async function* aStar(
  maze: Maze,
  start: Position,
  end: Position
): AsyncGenerator<Cell[], void, unknown> {
  const startCell = getCellAtPosition(start, maze);
  const endCell = getCellAtPosition(end, maze);
  
  if (!startCell || !endCell) return;

  const openSet = new Set<Cell>([startCell]);
  const cameFrom = new Map<Cell, Cell>();
  const gScore = new Map<Cell, number>();
  const fScore = new Map<Cell, number>();

  gScore.set(startCell, 0);
  fScore.set(startCell, heuristic(start, end));

  while (openSet.size > 0) {
    let current = Array.from(openSet).reduce((a, b) => 
      (fScore.get(a) ?? Infinity) < (fScore.get(b) ?? Infinity) ? a : b
    );

    if (current === endCell) {
      const path: Cell[] = [];
      while (current) {
        path.unshift(current);
        current = cameFrom.get(current)!;
      }
      yield path;
      return;
    }

    openSet.delete(current);
    const neighbors = getNeighborsForSolving(current, maze);

    for (const neighbor of neighbors) {
      const tentativeGScore = (gScore.get(current) ?? Infinity) + 1;

      if (tentativeGScore < (gScore.get(neighbor) ?? Infinity)) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeGScore);
        fScore.set(neighbor, tentativeGScore + heuristic(
          { x: neighbor.x, y: neighbor.y },
          end
        ));

        if (!openSet.has(neighbor)) {
          openSet.add(neighbor);
        }
      }
    }

    const path: Cell[] = [];
    let temp = current;
    while (temp) {
      path.unshift(temp);
      temp = cameFrom.get(temp)!;
    }
    yield path;
  }
} 