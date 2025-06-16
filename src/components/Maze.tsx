import { useMaze } from '../context/MazeContext';
import { Position } from '../types';

interface MazeProps {
  colors?: {
    background?: string;
    walls?: string;
    path?: string;
    start?: string;
    end?: string;
    hover?: string;
  };
}

export function Maze({ colors = {} }: MazeProps) {
  const { state, dispatch } = useMaze();
  const {
    background = 'bg-white',
    walls = 'bg-gray-900',
    path = 'bg-green-500',
    start = 'bg-blue-500',
    end = 'bg-red-500',
    hover = 'bg-gray-200'
  } = colors;

  const handleCellClick = (x: number, y: number) => {
    if (state.isGenerating || state.isSolving) return;

    const position: Position = { x, y };
    if (!state.startPosition) {
      dispatch({ type: 'SET_START_POSITION', payload: position });
    } else if (!state.endPosition) {
      dispatch({ type: 'SET_END_POSITION', payload: position });
    } else {
      dispatch({ type: 'SET_START_POSITION', payload: position });
      dispatch({ type: 'SET_END_POSITION', payload: null });
    }
  };

  // Set max container size
  const maxContainerWidth = window.innerWidth * 0.8;
  const maxContainerHeight = window.innerHeight * 0.8;
  const mazePixelWidth = state.width * state.cellSize;
  const mazePixelHeight = state.height * state.cellSize;

  // Calculate scale so maze fits within container
  const scale = Math.min(
    maxContainerWidth / mazePixelWidth,
    maxContainerHeight / mazePixelHeight,
    1 // Never scale up, only down
  );

  return (
    <div className="w-full flex justify-center">
      <div
        className="flex flex-col items-center w-full max-w-4xl mx-auto"
      >
        {/* Status & Stats Section */}
        <div className="w-full max-w-4xl mx-auto mb-6 flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-neutral-800 rounded-lg shadow text-neutral-800 dark:text-neutral-200">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <span className="text-neutral-500 dark:text-neutral-400">Status:</span>
            <span className={
              state.isGenerating ? 'text-cyan-600 dark:text-cyan-400' :
              state.isSolving ? 'text-green-600 dark:text-green-400' :
              state.isPaused ? 'text-yellow-600 dark:text-yellow-400' :
              state.performanceMetrics ? 'text-pink-600 dark:text-pink-400' :
              'text-neutral-800 dark:text-neutral-300'
            }>
              {state.isGenerating ? 'Generating' :
               state.isSolving ? 'Solving' :
               state.isPaused ? 'Paused' :
               state.performanceMetrics ? 'Complete' :
               'Ready'}
            </span>
          </div>
          <div className="flex flex-wrap gap-8 text-sm">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-cyan-700 dark:text-cyan-300">Generation</span>
              <span>Steps: <span className="font-mono text-cyan-700 dark:text-cyan-200">{state.generationProgress}</span></span>
              <span>Time: <span className="font-mono text-green-700 dark:text-green-200">{state.generationTime}ms</span></span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-green-700 dark:text-green-300">Solving</span>
              <span>Steps: <span className="font-mono text-green-700 dark:text-green-200">{state.solvingProgress}</span></span>
              <span>Time: <span className="font-mono text-cyan-700 dark:text-cyan-200">{state.solvingTime}ms</span></span>
              <span>Path Length: <span className="font-mono text-pink-700 dark:text-pink-200">{state.performanceMetrics?.pathLength ?? '-'}</span></span>
              <span>Cells Explored: <span className="font-mono text-yellow-700 dark:text-yellow-200">{state.performanceMetrics?.cellsExplored ?? '-'}</span></span>
            </div>
          </div>
        </div>
        <div
          className="flex justify-center items-center w-full h-full min-h-[60vh] bg-neutral-900 rounded-xl shadow-lg p-4"
          style={{
            maxWidth: '90vw',
            maxHeight: '70vh',
            margin: '0 auto',
            boxSizing: 'border-box',
            overflow: 'auto',
          }}
        >
          <div
            className="flex items-center justify-center relative"
            style={{
              width: '100%',
              height: '100%',
              maxWidth: maxContainerWidth,
              maxHeight: maxContainerHeight,
              overflow: 'hidden',
            }}
          >
            <div
              className="absolute"
              style={{
                width: mazePixelWidth,
                height: mazePixelHeight,
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                left: '50%',
                top: '50%',
                translate: '-50% -50%',
              }}
            >
              {state.maze.map((row, y) =>
                row.map((cell, x) => {
                  const isStart = state.startPosition?.x === x && state.startPosition?.y === y;
                  const isEnd = state.endPosition?.x === x && state.endPosition?.y === y;
                  return (
                    <div
                      key={`${x}-${y}`}
                      className={`absolute ${background} transition-all duration-300 ease-in-out cursor-pointer
                        ${isStart ? 'ring-2 ring-blue-400 shadow-lg shadow-blue-500/30 z-10' : ''}
                        ${isEnd ? 'ring-2 ring-red-400 shadow-lg shadow-red-500/30 z-10' : ''}
                        hover:scale-105 hover:z-20
                      `}
                      style={{
                        width: state.cellSize,
                        height: state.cellSize,
                        left: x * state.cellSize,
                        top: y * state.cellSize,
                        zIndex: 1,
                        backgroundColor: 'white',
                      }}
                      onClick={() => handleCellClick(x, y)}
                    >
                      {cell.walls.top && (
                        <div
                          className={`absolute top-0 left-0 right-0 h-1 ${walls} transition-all duration-300 ease-in-out`}
                          style={{ zIndex: 2, backgroundColor: '#1a1a1a' }}
                        />
                      )}
                      {cell.walls.right && (
                        <div
                          className={`absolute top-0 right-0 bottom-0 w-1 ${walls} transition-all duration-300 ease-in-out`}
                          style={{ zIndex: 2, backgroundColor: '#1a1a1a' }}
                        />
                      )}
                      {cell.walls.bottom && (
                        <div
                          className={`absolute bottom-0 left-0 right-0 h-1 ${walls} transition-all duration-300 ease-in-out`}
                          style={{ zIndex: 2, backgroundColor: '#1a1a1a' }}
                        />
                      )}
                      {cell.walls.left && (
                        <div
                          className={`absolute top-0 left-0 bottom-0 w-1 ${walls} transition-all duration-300 ease-in-out`}
                          style={{ zIndex: 2, backgroundColor: '#1a1a1a' }}
                        />
                      )}
                      {cell.isPath && (
                        <div
                          className={`absolute inset-1 ${path} transition-all duration-300 ease-in-out`}
                          style={{ zIndex: 1, backgroundColor: '#22c55e' }}
                        />
                      )}
                      {state.startPosition?.x === x && state.startPosition?.y === y && (
                        <div
                          className={`absolute inset-1 ${start} transition-all duration-300 ease-in-out`}
                          style={{ zIndex: 1, backgroundColor: '#3b82f6' }}
                        />
                      )}
                      {state.endPosition?.x === x && state.endPosition?.y === y && (
                        <div
                          className={`absolute inset-1 ${end} transition-all duration-300 ease-in-out`}
                          style={{ zIndex: 1, backgroundColor: '#ef4444' }}
                        />
                      )}
                      <div
                        className={`absolute inset-0 opacity-0 hover:opacity-100 ${hover} transition-all duration-300 ease-in-out`}
                        style={{ zIndex: 0, backgroundColor: '#e5e7eb' }}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        {/* Divider */}
        <div className="w-full flex justify-center my-4">
          <div className="h-0.5 w-2/3 bg-neutral-700 rounded-full opacity-40" />
        </div>
        {/* Legend below the maze */}
        <div className="flex flex-wrap gap-4 justify-center items-center p-3 bg-neutral-800 rounded-lg shadow text-sm text-neutral-200 w-fit mx-auto">
          <div className="flex items-center gap-2"><span className="inline-block w-5 h-5 bg-white border border-neutral-400 rounded" /> Unvisited</div>
          <div className="flex items-center gap-2"><span className="inline-block w-5 h-5 bg-green-500 border border-green-600 rounded" /> Path</div>
          <div className="flex items-center gap-2"><span className="inline-block w-5 h-5 bg-blue-500 border border-blue-600 rounded" /> Start</div>
          <div className="flex items-center gap-2"><span className="inline-block w-5 h-5 bg-red-500 border border-red-600 rounded" /> End</div>
          <div className="flex items-center gap-2"><span className="inline-block w-5 h-5 bg-neutral-900 border border-neutral-600 rounded" /> Wall</div>
        </div>
      </div>
    </div>
  );
} 