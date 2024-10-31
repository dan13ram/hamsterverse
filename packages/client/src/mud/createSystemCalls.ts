import { getComponentValue } from "@latticexyz/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { Direction } from "../utils/direction";
import { Hex } from "viem";
import { hexToArray } from "@latticexyz/utils";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { playerEntity, worldContract, waitForTransaction }: SetupNetworkResult,
  {
    MapConfig,
    Winner,
    Player,
    Position,
  }: ClientComponents
) {
  const wrapPosition = (x: number, y: number) => {
    const mapConfig = getComponentValue(MapConfig, playerEntity);
    if (!mapConfig) {
      throw new Error("mapConfig no yet loaded or initialized");
    }
    return [
      (x + mapConfig.width) % mapConfig.width,
      (y + mapConfig.height) % mapConfig.height,
    ];
  };

  const isObstructed = (x: number, y: number): boolean => {
    const mapConfig = getComponentValue(MapConfig, playerEntity);
    if (!mapConfig) {
      return false;
    }
    const { width, height, terrain: terrainData } = mapConfig;

    return Array.from(hexToArray(terrainData)).some((value, index) => {
      const thisX = index % width;
      const thisY = Math.floor(index / height);
      const isObstruction = value > 0;
      return thisX === x && thisY === y && isObstruction;
    });
  };

  const move = async (direction: Direction) => {
    if (!playerEntity) {
      throw new Error("no player");
    }

    const { width, height } = getComponentValue(MapConfig, playerEntity) ?? {};

    const position = getComponentValue(Position, playerEntity);
    if (!position || !width || !height) {
      console.warn("cannot move without a player position, not yet spawned?");
      return;
    }

    //const inEncounter = !!getComponentValue(Encounter, playerEntity);
    //if (inEncounter) {
    //  console.warn("cannot move while in encounter");
    //  return;
    //}

    let { x: inputX, y: inputY } = position;

    let isWinner = false;
    if (inputY === height - 1 && inputX === width - 2 && direction === Direction.South) {
      isWinner = true;
    }


    if (direction === Direction.North) {
      inputY -= 1;
    } else if (direction === Direction.East) {
      inputX += 1;
    } else if (direction === Direction.South) {
      inputY += 1;
    } else if (direction === Direction.West) {
      inputX -= 1;
    }

    const [x, y] = wrapPosition(inputX, inputY);

    if (!isWinner && isObstructed(x, y)) {
      console.warn("cannot move to obstructed space");
      return;
    }

    const overrideId = uuid();
    if (!isWinner) {
      Position.addOverride(overrideId, {
        entity: playerEntity,
        value: { x, y },
      });
    } else {
      Winner.addOverride(overrideId, {
        entity: playerEntity,
        value: { value: true },
      });
    }

    try {
      const tx = await worldContract.write.move([direction]);
      await waitForTransaction(tx);
    } finally {
      if (!isWinner) {
        Position.removeOverride(overrideId);
      } else {
        Winner.removeOverride(overrideId);
      }
    }
  };

  const spawn = async (inputX: number, inputY: number) => {
    if (!playerEntity) {
      throw new Error("no player");
    }

    const canSpawn = getComponentValue(Player, playerEntity)?.value !== true;
    if (!canSpawn) {
      throw new Error("already spawned");
    }

    const [x, y] = wrapPosition(inputX, inputY);
    if (isObstructed(x, y)) {
      console.warn("cannot spawn on obstructed space");
      return;
    }

    const positionId = uuid();
    Position.addOverride(positionId, {
      entity: playerEntity,
      value: { x, y },
    });
    const playerId = uuid();
    Player.addOverride(playerId, {
      entity: playerEntity,
      value: { value: true },
    });

    try {
      const tx = await worldContract.write.spawn([x, y]);
      await waitForTransaction(tx);
    } finally {
      Position.removeOverride(positionId);
      Player.removeOverride(playerId);
    }
  };

  const setMap = async (width: number, height: number, terrain: Hex) => {
    const tx = await worldContract.write.setMap([width, height, terrain]);
    await waitForTransaction(tx);
  };

  return {
    move,
    spawn,
    setMap,
  };
}
