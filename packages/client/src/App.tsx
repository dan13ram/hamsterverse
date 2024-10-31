import { useComponentValue } from "@latticexyz/react";
import { SyncStep } from "@latticexyz/store-sync";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { useMUD } from "./MUDContext";
import { GameBoard } from "./GameBoard";
import { MazeGenerator } from "./mazeGenerator";
import { useState } from "react";

export const App = () => {
  const {
    components: { SyncProgress, MapConfig },
    systemCalls: { setMap },
    network: { playerEntity },
  } = useMUD();

  const mapConfig = useComponentValue(MapConfig, playerEntity);

  const loadingState = useComponentValue(SyncProgress, singletonEntity, {
    step: SyncStep.INITIALIZE,
    message: "Connecting",
    percentage: 0,
    latestBlockNumber: 0n,
    lastBlockNumberProcessed: 0n,
  });

  const [size, setSize] = useState(5);

  const newMapGenerateLocal = (_size: number) => {
    let newSize = _size;
    if (_size < 1 || _size > 25) {
      setSize(5);
      newSize = 5;
    }

    const maze = new MazeGenerator(newSize);
    maze.generate();
    setMap(maze.size, maze.size, maze.bytes());
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {loadingState.step !== SyncStep.LIVE ? (
        <div>
          {loadingState.message} ({loadingState.percentage.toFixed(2)}%)
        </div>
      ) : (
        <div className="relative flex flex-col items-center gap-4 bg-green-500 p-8 rounded-lg">
          <input
            type="number"
            value={size}
            min={1}
            max={25}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="p-2 bg-black rounded-md"
          />
          <button
            onClick={() => newMapGenerateLocal(size)}
            className="p-2 bg-blue-500 rounded-md"
          >
            {mapConfig ? "Restart" : "Start"}
          </button>
          {mapConfig &&
            <GameBoard />}
        </div>
      )}
    </div>
  );
};
