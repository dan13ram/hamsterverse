import { useComponentValue } from "@latticexyz/react";
import { Entity } from "@latticexyz/recs";
import { twMerge } from "tailwind-merge";
import { useMUD } from "../contexts/MUDContext";
import hamsterPNG from "../assets/hamster.png";
import startEmoji from "../assets/start.png";
import finishEmoji from "../assets/finish.png"

type Props = {
  width: number;
  height: number;
  terrain?: {
    x: number;
    y: number;
    emoji: string;
  }[];
  players?: {
    x: number;
    y: number;
    emoji: string;
    entity: Entity;
  }[];
};

export const GameMap = ({
  width,
  height,
  terrain,
}: Props) => {
  const {
    network: { playerEntity },
    components: { Position, Movable, Winner },
  } = useMUD();

  const rows = new Array(width).fill(0).map((_, i) => i);
  const columns = new Array(height).fill(0).map((_, i) => i);

  const position = useComponentValue(Position, playerEntity);
  const movable = useComponentValue(Movable, playerEntity);
  const winner = useComponentValue(Winner, playerEntity);

  return (
    <div className="inline-grid p-2 relative">
      {Array.from({ length: width }).map((_, i) => (
        <div
          key={i}
          className={twMerge(
            "w-12 h-12 flex items-center justify-center p-1",
          )}
          style={{
            gridColumn: i + 1,
            gridRow: 1,
          }}
        >
          {i == 1 && (
            <img src={startEmoji} className="relative" alt="hamster" />
          )}
        </div>
      ))
      }
      {rows.map((y) =>
        columns.map((x) => {
          const terrainEmoji = terrain?.find(
            (t) => t.x === x && t.y === y
          )?.emoji;

          const mainPlayerHere = position?.x === x && position?.y === y;

          const isWinningPosition = x === width - 2 && y === height - 1 && mainPlayerHere && movable?.value === false && winner?.value === false;

          return (
            <div
              key={`${x},${y}`}
              className={twMerge(
                "w-12 h-12 flex items-center justify-center bg-green-900",
              )}
              style={{
                gridColumn: x + 1,
                gridRow: y + 2,
              }}
            >
              <div className="flex flex-wrap gap-1 items-center justify-center relative">
                {terrainEmoji ? (
                  <div className="inset-0 flex items-center justify-center text-3xl pointer-events-none">
                    <img src={terrainEmoji} className="relative" alt="hamster" />
                  </div>
                ) : null}
                <div className="relative">
                  {mainPlayerHere && (
                    <div key={playerEntity} className="relative">
                      <img src={hamsterPNG} className={twMerge("relative w-10 mb-10 z-10", isWinningPosition ? "animate-win" : null)} alt="hamster" />
                      <div className="absolute pointer-events-none rounded-full bg-blackAlpha w-9 h-4 left-0 -bottom-1 z-0" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
      {Array.from({ length: width }).map((_, i) => (
        <div
          key={i}
          className={twMerge(
            "w-12 h-12 flex items-center justify-center p-1",
          )}
          style={{
            gridColumn: i + 1,
            gridRow: height + 2,
          }}
        >
          {i == width - 2 && (
            <img src={finishEmoji} className="relative" alt="hamster" />
          )}
        </div>
      ))
      }

    </div >
  );
};
