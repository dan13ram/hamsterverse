import { ReactNode, useEffect, useState } from "react";
import { Entity } from "@latticexyz/recs";
import { twMerge } from "tailwind-merge";
import { useMUD } from "./MUDContext";
import hamsterPNG from "./assets/hamster.png";


type Props = {
  width: number;
  height: number;
  onTileClick?: (x: number, y: number) => void;
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
  encounter?: ReactNode;
};

export const GameMap = ({
  width,
  height,
  onTileClick,
  terrain,
  players,
  encounter,
}: Props) => {
  const {
    network: { playerEntity },
  } = useMUD();

  const rows = new Array(width).fill(0).map((_, i) => i);
  const columns = new Array(height).fill(0).map((_, i) => i);

  //const [showEncounter, setShowEncounter] = useState(false);
  // Reset show encounter when we leave encounter
  //useEffect(() => {
  //  if (!encounter) {
  //    setShowEncounter(false);
  //  }
  //}, [encounter]);

  return (
    <div className="inline-grid p-2 relative">
      {rows.map((y) =>
        columns.map((x) => {
          const terrainEmoji = terrain?.find(
            (t) => t.x === x && t.y === y
          )?.emoji;

          const playersHere = players?.filter((p) => p.x === x && p.y === y);
          const mainPlayerHere = playersHere?.find(
            (p) => p.entity === playerEntity
          );

          return (
            <div
              key={`${x},${y}`}
              className={twMerge(
                "w-10 h-10 flex items-center justify-center bg-green-900",
                onTileClick ? "cursor-pointer hover:ring" : null
              )}
              style={{
                gridColumn: x + 1,
                gridRow: y + 1,
              }}
              onClick={() => {
                onTileClick?.(x, y);
              }}
            >
              {encounter && mainPlayerHere ? (
                <div
                  className="absolute z-10 animate-battle"
                  style={{
                    boxShadow: "0 0 0 100vmax black",
                  }}
                //onAnimationEnd={() => {
                //  setShowEncounter(true);
                //}}
                ></div>
              ) : null}
              <div className="flex flex-wrap gap-1 items-center justify-center relative">
                {terrainEmoji ? (
                  <div className="absolute inset-0 flex items-center justify-center text-3xl pointer-events-none">
                    {terrainEmoji}
                  </div>
                ) : null}
                <div className="relative">
                  {mainPlayerHere && (
                    <div key={mainPlayerHere.entity} className="relative">
                      <img src={hamsterPNG} className="relative w-10 mb-10 z-10" alt="hamster" />
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
            "w-10 h-10 flex items-center justify-center",
            i == width - 2 ? "bg-green-900" : null,
            onTileClick ? "cursor-pointer hover:ring" : null
          )}
          style={{
            gridColumn: i + 1,
            gridRow: height + 1,
          }}
        >
          {i == width - 2 && (
            <div
            >
              🏁
            </div>
          )}
        </div>
      ))
      }

      {/*encounter && showEncounter ? (
        <div
          className="relative z-10 -m-2 bg-black text-white flex items-center justify-center"
          style={{
            gridColumnStart: 1,
            gridColumnEnd: width + 1,
            gridRowStart: 1,
            gridRowEnd: height + 1,
          }}
        >
          {encounter}
        </div>
      ) : null*/}
    </div >
  );
};
