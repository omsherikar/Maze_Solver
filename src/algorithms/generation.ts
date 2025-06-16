import { Maze } from '../types/maze';

export function* recursiveBacktracking(maze: Maze): Generator<Maze> {
  const height = maze.length;
  const width = maze[0].length;
  const visited = new Set<string>();
  const stack: [number, number][] = [];

  // Start from a random cell
  const startX = Math.floor(Math.random() * width);
  const startY = Math.floor(Math.random() * height);
  stack.push([startX, startY]);
  visited.add(`${startX},${startY}`);
  maze[startY][startX].visited = true;

  while (stack.length > 0) {
    const [x, y] = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(maze, x, y, visited);

    if (neighbors.length === 0) {
      stack.pop();
      continue;
    }

    const [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)];
    visited.add(`${nx},${ny}`);
    maze[ny][nx].visited = true;

    // Remove wall between current cell and chosen neighbor
    if (nx === x) {
      if (ny > y) {
        maze[y][x].walls.bottom = false;
        maze[ny][nx].walls.top = false;
      } else {
        maze[y][x].walls.top = false;
        maze[ny][nx].walls.bottom = false;
      }
    } else {
      if (nx > x) {
        maze[y][x].walls.right = false;
        maze[ny][nx].walls.left = false;
      } else {
        maze[y][x].walls.left = false;
        maze[ny][nx].walls.right = false;
      }
    }

    stack.push([nx, ny]);
    yield maze;
  }
}

export function* primsAlgorithm(maze: Maze): Generator<Maze> {
  const height = maze.length;
  const width = maze[0].length;
  const visited = new Set<string>();
  const walls: [number, number, number, number][] = [];

  // Start from a random cell
  const startX = Math.floor(Math.random() * width);
  const startY = Math.floor(Math.random() * height);
  visited.add(`${startX},${startY}`);
  maze[startY][startX].visited = true;

  // Add walls of the starting cell
  addWalls(startX, startY, walls);

  while (walls.length > 0) {
    const wallIndex = Math.floor(Math.random() * walls.length);
    const [x1, y1, x2, y2] = walls[wallIndex];
    walls.splice(wallIndex, 1);

    const cell1 = `${x1},${y1}`;
    const cell2 = `${x2},${y2}`;
    const visited1 = visited.has(cell1);
    const visited2 = visited.has(cell2);

    if (visited1 !== visited2) {
      // Remove wall
      if (x1 === x2) {
        if (y1 < y2) {
          maze[y1][x1].walls.bottom = false;
          maze[y2][x2].walls.top = false;
        } else {
          maze[y1][x1].walls.top = false;
          maze[y2][x2].walls.bottom = false;
        }
      } else {
        if (x1 < x2) {
          maze[y1][x1].walls.right = false;
          maze[y2][x2].walls.left = false;
        } else {
          maze[y1][x1].walls.left = false;
          maze[y2][x2].walls.right = false;
        }
      }

      // Add unvisited cell to visited set
      const newCell = visited1 ? cell2 : cell1;
      visited.add(newCell);
      const [nx, ny] = newCell.split(',').map(Number);
      maze[ny][nx].visited = true;

      // Add walls of the new cell
      addWalls(nx, ny, walls);
    }

    yield maze;
  }
}

export function* kruskalsAlgorithm(maze: Maze): Generator<Maze> {
  const height = maze.length;
  const width = maze[0].length;
  const edges: [number, number, number, number][] = [];
  const sets = new Map<number, Set<number>>();

  // Initialize sets for each cell
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cellId = y * width + x;
      sets.set(cellId, new Set([cellId]));
      maze[y][x].visited = false;
    }
  }

  // Collect all possible edges
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x < width - 1) edges.push([x, y, x + 1, y]);
      if (y < height - 1) edges.push([x, y, x, y + 1]);
    }
  }

  // Shuffle edges
  for (let i = edges.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [edges[i], edges[j]] = [edges[j], edges[i]];
  }

  // Process edges
  for (const [x1, y1, x2, y2] of edges) {
    const cell1 = y1 * width + x1;
    const cell2 = y2 * width + x2;
    const set1 = sets.get(cell1)!;
    const set2 = sets.get(cell2)!;

    if (set1 !== set2) {
      // Remove wall between cells
      if (x1 === x2) {
        maze[y1][x1].walls.bottom = false;
        maze[y2][x2].walls.top = false;
      } else {
        maze[y1][x1].walls.right = false;
        maze[y2][x2].walls.left = false;
      }

      // Mark cells as visited
      maze[y1][x1].visited = true;
      maze[y2][x2].visited = true;

      // Merge sets
      const newSet = new Set([...set1, ...set2]);
      for (const cellId of newSet) {
        sets.set(cellId, newSet);
      }

      yield maze;
    }
  }
}

function getUnvisitedNeighbors(maze: Maze, x: number, y: number, visited: Set<string>): [number, number][] {
  const neighbors: [number, number][] = [];
  const height = maze.length;
  const width = maze[0].length;

  if (y > 0 && !visited.has(`${x},${y - 1}`)) neighbors.push([x, y - 1]);
  if (x < width - 1 && !visited.has(`${x + 1},${y}`)) neighbors.push([x + 1, y]);
  if (y < height - 1 && !visited.has(`${x},${y + 1}`)) neighbors.push([x, y + 1]);
  if (x > 0 && !visited.has(`${x - 1},${y}`)) neighbors.push([x - 1, y]);

  return neighbors;
}

function addWalls(x: number, y: number, walls: [number, number, number, number][]) {
  if (y > 0) walls.push([x, y, x, y - 1]);
  if (x < walls[0].length - 1) walls.push([x, y, x + 1, y]);
  if (y < walls.length - 1) walls.push([x, y, x, y + 1]);
  if (x > 0) walls.push([x, y, x - 1, y]);
} 