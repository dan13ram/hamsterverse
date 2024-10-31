import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "../contexts/MUDContext";
import { GameBoard } from "./GameBoard";
import { MazeGenerator } from "../utils/mazeGenerator";
import { useState } from "react";

//import { ConnectButton } from '@rainbow-me/rainbowkit';
//import { useAccount } from 'wagmi';

export const Game = () => {
  const {
    components: { MapConfig, Movable },
    systemCalls: { setMap },
    network: { playerEntity },
  } = useMUD();

  const mapConfig = useComponentValue(MapConfig, playerEntity);

  const [size, setSize] = useState(19);

  const newMapGenerateLocal = (_size: number) => {
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
  };

  //const { isConnected } = useAccount();
  //
  //if (!isConnected) {
  //  return (
  //    <div className="flex flex-col items-center gap-4 bg-green-500 p-8 rounded-lg">
  //      <ConnectButton />
  //    </div>
  //  );
  //}

  return (
    <div className="relative flex flex-col items-center gap-4 bg-green-500 p-8 rounded-lg">
      {/*
      <div className="mb-4">
        <ConnectButton
          accountStatus="full"
          chainStatus="full"
          showBalance={false}
        /> 
      </div>*/}
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
      {mapConfig && <GameBoard />}
    </div>
  );
};
