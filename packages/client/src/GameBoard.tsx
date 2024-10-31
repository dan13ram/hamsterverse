import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { GameMap } from "./GameMap";
import { useMUD } from "./MUDContext";
import { useKeyboardMovement } from "./useKeyboardMovement";
import { hexToArray } from "@latticexyz/utils";
import { TerrainType, terrainTypes } from "./terrainTypes";
import { Entity, Has, getComponentValueStrict } from "@latticexyz/recs";
import { EncounterScreen } from "./EncounterScreen";
import { MonsterType, monsterTypes } from "./monsterTypes";
import { MazeGenerator } from "./mazeGenerator";
import { useState } from "react";

export const GameBoard = () => {
  useKeyboardMovement();

  const {
    components: { Encounter, MapConfig, Monster, Player, Position, Winner },
    network: { playerEntity },
    systemCalls: { spawn, setMap },
  } = useMUD();

  const canSpawn = useComponentValue(Player, playerEntity)?.value !== true;

  const players = useEntityQuery([Has(Player), Has(Position)]).map((entity) => {
    const position = getComponentValueStrict(Position, entity);
    return {
      entity,
      x: position.x,
      y: position.y,
      emoji: entity === playerEntity ? "🤠" : "🥸",
    };
  });

  const mapConfig = useComponentValue(MapConfig, playerEntity);
  if (mapConfig == null) {
    throw new Error(
      "map config not set or not ready, only use this hook after loading state === LIVE"
    );
  }

  const { width, height, terrain: terrainData } = mapConfig;

  const terrain = Array.from(hexToArray(terrainData)).map((value, index) => {
    const { emoji } =
      value in TerrainType ? terrainTypes[value as TerrainType] : { emoji: "" };

    return {
      x: index % width,
      y: Math.floor(index / width),
      emoji,
    };
  });

  const encounter = useComponentValue(Encounter, playerEntity);

  const winner = useComponentValue(Winner, playerEntity);

  const monsterType = useComponentValue(
    Monster,
    encounter ? (encounter.monster as Entity) : undefined
  )?.value;

  const monster =
    monsterType != null && monsterType in MonsterType
      ? monsterTypes[monsterType as MonsterType]
      : null;


  return (
    <div className="relative flex flex-col items-center gap-4 bg-green-500 p-8 rounded-lg">
      {winner?.value === true ? (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl">You Win!</h1>
        </div>
      ) : (
        <GameMap
          width={width}
          height={height}
          terrain={terrain}
          onTileClick={canSpawn ? spawn : undefined}
          players={players}
          encounter={
            encounter ? (
              <EncounterScreen
                monsterName={monster?.name ?? "MissingNo"}
                monsterEmoji={monster?.emoji ?? "💱"}
              />
            ) : undefined
          }
        />
      )}
    </div>
  );
};
