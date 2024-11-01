import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "../contexts/MUDContext";
import { Maze } from "./Maze";
import { MazeGenerator } from "../utils/mazeGenerator";
import { useState, useCallback } from "react";

export const GameControls = () => {
  const {
    components: { MapConfig, Page },
    systemCalls: { restartGame, nextPage, prevPage },
    network: { playerEntity },
  } = useMUD();

  const [size, setSize] = useState(14);

  const page = Number(useComponentValue(Page, playerEntity)?.value ?? 0);

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

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="absolute flex flex-col gap-4 right-0 top-0 p-8">
      <p className="text-sm md:text-2xl">Hamsterverse Admin</p>
      <p>Small screens not supported</p>
      <p> Page {page} </p>
      <input
        type="number"
        value={size}
        min={1}
        max={25}
        onChange={(e) => setSize(parseInt(e.target.value))}
        className="p-2 bg-black rounded-md border-2 border-white"
      />
      <button
        onClick={() => newMapGenerateLocal(size)}
        className="py-2 px-8 bg-blue-500 rounded-md hover:bg-blue-100 hover:text-blue-900 border-white border-2"
      >
        Restart
      </button>
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
  );
};
