import { useEffect } from "react";
import { useMUD } from "./MUDContext";
import { Direction } from "./direction";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { GameMap } from "./GameMap";
import { hexToArray } from "@latticexyz/utils";
import { TerrainType, terrainTypes } from "./terrainTypes";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { Entity, Has, getComponentValueStrict } from "@latticexyz/recs";
import { EncounterScreen } from "./EncounterScreen";
import { MonsterType, monsterTypes } from "./monsterTypes";
import { MazeGenerator } from "./mazeGenerator";
import { useState } from "react";

export const useKeyboardMovement = () => {
  const {
    components: { Encounter, MapConfig, Monster, Player, Position, Winner, Movable },
    network: { playerEntity },
    systemCalls: { move },
  } = useMUD();;

  const mapConfig = useComponentValue(MapConfig, playerEntity);
  if (mapConfig == null) {
    throw new Error(
      "map config not set or not ready, only use this hook after loading state === LIVE"
    );
  }

  const { width, height } = mapConfig;

  const position = useComponentValue(Position, playerEntity);

  const movable = useComponentValue(Movable, playerEntity);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (movable?.value === false) {
        return;
      }
      if (e.key === "ArrowUp" || e.key === "w") {
        move(Direction.North);
      }
      if (e.key === "ArrowDown" || e.key === "s") {
        if (position?.y === height - 1 && position?.x === width - 2) {
          console.log("win");
        }
        move(Direction.South);
      }
      if (e.key === "ArrowLeft" || e.key === "a") {
        move(Direction.West);
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        move(Direction.East);
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [move, position]);
};
