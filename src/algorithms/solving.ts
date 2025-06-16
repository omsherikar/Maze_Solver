import { Maze, Position } from '../types';

function getNeighbors(maze: Maze, pos: Position): Position[] {
  const neighbors: Position[] = [];
  const { x, y } = pos;
  const cell = maze[y][x];

  if (!cell.walls.top && y > 0) neighbors.push({ x, y: y - 1 });
  if (!cell.walls.right && x < maze[0].length - 1) neighbors.push({ x: x + 1, y });
  if (!cell.walls.bottom && y < maze.length - 1) neighbors.push({ x, y: y + 1 });
  if (!cell.walls.left && x > 0) neighbors.push({ x: x - 1, y });

  return neighbors;
}

function heuristic(a: Position, b: Position): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function* bfs(maze: Maze, start: Position, end: Position): Generator<Position[]> {
  const queue: Position[][] = [[start]];
  const visited = new Set<string>();
  visited.add(`${start.x},${start.y}`);

  while (queue.length > 0) {
    const path = queue.shift()!;
    const current = path[path.length - 1];

    if (current.x === end.x && current.y === end.y) {
      yield path;
      return;
    }

    const neighbors = getNeighbors(maze, current);
    for (const neighbor of neighbors) {
      const key = `${neighbor.x},${neighbor.y}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push([...path, neighbor]);
        yield path;
      }
    }
  }

  throw new Error('No path found');
}

export function* aStar(maze: Maze, start: Position, end: Position): Generator<Position[]> {
  const openSet = new Set<string>([`${start.x},${start.y}`]);
  const cameFrom = new Map<string, Position | null>();
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();

  gScore.set(`${start.x},${start.y}`, 0);
  fScore.set(`${start.x},${start.y}`, heuristic(start, end));

  while (openSet.size > 0) {
    let current: Position | null = null;
    let lowestFScore = Infinity;
    let currentKey = '';

    for (const key of openSet) {
      const score = fScore.get(key) ?? Infinity;
      if (score < lowestFScore) {
        lowestFScore = score;
        const [x, y] = key.split(',').map(Number);
        current = { x, y };
        currentKey = key;
      }
    }

    if (!current) break;

    if (current.x === end.x && current.y === end.y) {
      const path = reconstructPath(cameFrom, current);
      yield path;
      return;
    }

    openSet.delete(currentKey);

    const neighbors = getNeighbors(maze, current);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.x},${neighbor.y}`;
      const tentativeGScore = (gScore.get(currentKey) ?? Infinity) + 1;

      if (tentativeGScore < (gScore.get(neighborKey) ?? Infinity)) {
        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, tentativeGScore);
        fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, end));
        openSet.add(neighborKey);
      }
    }

    const currentPath = reconstructPath(cameFrom, current);
    yield currentPath;
  }

  throw new Error('No path found');
}

export function* dijkstra(maze: Maze, start: Position, end: Position): Generator<Position[]> {
  const distances = new Map<string, number>();
  const previous = new Map<string, Position | null>();
  const unvisited = new Set<string>();

  // Initialize distances and unvisited set
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[0].length; x++) {
      const key = `${x},${y}`;
      distances.set(key, Infinity);
      previous.set(key, null);
      unvisited.add(key);
    }
  }

  // Set start distance to 0
  const startKey = `${start.x},${start.y}`;
  distances.set(startKey, 0);

  while (unvisited.size > 0) {
    // Find unvisited node with smallest distance
    let minDist = Infinity;
    let current: Position | null = null;
    let currentKey = '';

    for (const key of unvisited) {
      const dist = distances.get(key)!;
      if (dist < minDist) {
        minDist = dist;
        const [x, y] = key.split(',').map(Number);
        current = { x, y };
        currentKey = key;
      }
    }

    if (!current || minDist === Infinity) break;

    // If we reached the end, reconstruct and yield the path
    if (current.x === end.x && current.y === end.y) {
      const path = reconstructPath(previous, current);
      yield path;
      return;
    }

    unvisited.delete(currentKey);

    // Check all neighbors
    const neighbors = getNeighbors(maze, current);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.x},${neighbor.y}`;
      if (!unvisited.has(neighborKey)) continue;

      const alt = distances.get(currentKey)! + 1;
      if (alt < distances.get(neighborKey)!) {
        distances.set(neighborKey, alt);
        previous.set(neighborKey, current);
      }
    }

    // Yield current path
    const currentPath = reconstructPath(previous, current);
    yield currentPath;
  }

  throw new Error('No path found');
}

function reconstructPath(cameFrom: Map<string, Position | null>, current: Position): Position[] {
  const path: Position[] = [current];
  let currentKey = `${current.x},${current.y}`;
  let previous = cameFrom.get(currentKey);

  while (previous) {
    path.unshift(previous);
    currentKey = `${previous.x},${previous.y}`;
    previous = cameFrom.get(currentKey);
  }

  return path;
}

// ... existing code ... 