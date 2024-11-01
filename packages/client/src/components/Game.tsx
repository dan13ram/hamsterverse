import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "../contexts/MUDContext";
import { GameBoard } from "./GameBoard";
import { MazeGenerator } from "../utils/mazeGenerator";
import { useState, useCallback } from "react";

export const Game = () => {
  const {
    components: { MapConfig },
    systemCalls: { setMap },
    network: { playerEntity },
  } = useMUD();

  const mapConfig = useComponentValue(MapConfig, playerEntity);

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

    setMap(maze.size, maze.size, maze.bytes());
  }, [setMap]);

  return (
    <div className="relative flex flex-col items-center gap-4">
      <div className="relative flex flex-row items-center gap-4">
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
            className="p-2 bg-blue-500 rounded-md"
          >
            {mapConfig ? "Restart" : "Start"}
          </button>
        )}
      </div>
      <div className="relative flex flex-col items-center gap-4 bg-green-500 py-6 px-8 rounded-lg">
        {mapConfig && <GameBoard />}
      </div>
    </div>
  );
};
