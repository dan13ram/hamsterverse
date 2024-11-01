import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "../contexts/MUDContext";
import { Maze } from "./Maze";
import { MazeGenerator } from "../utils/mazeGenerator";
import { useEffect, useCallback } from "react";
import { Page0 } from "./Pages/Page0";
import { Page1 } from "./Pages/Page1";
import { Page2 } from "./Pages/Page2";
import { Page3 } from "./Pages/Page3";
import { Page4 } from "./Pages/Page4";
import { Page5 } from "./Pages/Page5";
import { TextBox } from "./TextBox";


import { Image } from "./Image";
import { Video } from "./Video";

const pageContent = [
  <Page0 />,
  <Page1 />,
  <Page2 />,
  <Page3 />,
  <Page4 />,
  <Page5 />,
  <Maze />
];

export const Game = () => {
  const {
    components: { MapConfig, Page },
    systemCalls: { restartGame },
    network: { playerEntity },
  } = useMUD();

  const mapConfig = useComponentValue(MapConfig, playerEntity);
  const page = Number(useComponentValue(Page, playerEntity)?.value ?? 0);

  useEffect(() => {
    if (!mapConfig) {
      const maze = new MazeGenerator(14);
      maze.generate();

      while (!maze.isSolvable()) {
        maze.generate();
      }

      restartGame(maze.size, maze.size, maze.bytes());
    }
  }, [mapConfig, restartGame]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
      {!mapConfig && <TextBox text="Loading..." />}
      {mapConfig && (pageContent[page] ?? null)}
    </div>
  );
};
