import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "../contexts/MUDContext";
import { GameBoard } from "./GameBoard";
import { MazeGenerator } from "../utils/mazeGenerator";
import { useState, useCallback } from "react";

const DefaultPage = () => {
  const {
    components: { MapConfig, Page },
    systemCalls: { nextPage, prevPage },
    network: { playerEntity },
  } = useMUD();

  const page = Number(useComponentValue(Page, playerEntity)?.value ?? 0);

  return (
    <div className="relative flex flex-col items-center gap-4 bg-green-500 py-6 px-8 rounded-lg">
      <h1 className="text-2xl">Page {page}</h1>
      <div className="flex flex-row items-center gap-4">
        <button
          onClick={() => prevPage()}
          className="py-2 px-8 bg-blue-500 rounded-md hover:bg-blue-100 hover:text-blue-900 border-white border-2"
        >
          Prev
        </button>
        <button
          onClick={() => nextPage()}
          className="py-2 px-8 bg-blue-500 rounded-md hover:bg-blue-100 hover:text-blue-900 border-white border-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const pageContent = [
  <DefaultPage />,
  <GameBoard />,
  <DefaultPage />,
];

export const Game = () => {
  const {
    components: { MapConfig, Page },
    systemCalls: { restartGame },
    network: { playerEntity },
  } = useMUD();

  const mapConfig = useComponentValue(MapConfig, playerEntity);
  const page = Number(useComponentValue(Page, playerEntity)?.value ?? 0);

  const [size, setSize] = useState(14);

  const newMapGenerateLocal = useCallback((_size: number) => {
    let newSize = _size;
    if (_size < 1 || _size > 25) {
      setSize(5);
      newSize = 5;
    }

    const maze = new MazeGenerator(newSize);
    maze.generate();

    while (!maze.isSolvable()) {
      maze.generate();
    }

    restartGame(maze.size, maze.size, maze.bytes());
  }, [restartGame]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
      <div className="absolute flex flex-col items-center gap-4 right-0 top-0">
        {import.meta.env.DEV && (
          <input
            type="number"
            value={size}
            min={1}
            max={25}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="p-2 bg-black rounded-md border-2 border-white"
          />
        )}
        {(!mapConfig || import.meta.env.DEV) && (
          <button
            onClick={() => newMapGenerateLocal(size)}
            className="py-2 px-8 bg-blue-500 rounded-md hover:bg-blue-100 hover:text-blue-900 border-white border-2"
          >
            {mapConfig ? "Restart" : "Start"}
          </button>
        )}
      </div>
      {mapConfig && (pageContent[page] ?? null)}
    </div>
  );
};
