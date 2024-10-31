import { getComponentValue } from "@latticexyz/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { Direction } from "../utils/direction";
import { Hex } from "viem";
import { hexToArray } from "@latticexyz/utils";
import { resourceToHex } from "@latticexyz/common";
import { BatchProcessingQueue } from "./BatchProcessingQueue";
import { encodeFunctionData } from "viem";

export type SystemCalls = ReturnType<typeof createSystemCalls>;



export function createSystemCalls(
  { playerEntity, worldContract, waitForTransaction }: SetupNetworkResult,
  {
    MapConfig,
    Winner,
    Player,
    Movable,
    Position,
  }: ClientComponents
) {


  const moveBatchQueue = new BatchProcessingQueue<Direction>(1000, async (batch: Direction[]) => {

    const resourceId = resourceToHex({
      type: "system",
      namespace: "",
      name: "MapSystem",
    });

    const tasks = batch.map((direction) => {
      const data = encodeFunctionData({
        abi: worldContract.abi,
        functionName: "move",
        args: [direction],
      });

      return [resourceId, data];
    });

    try {
      const tx = worldContract.write.batchCall([tasks]);
      await waitForTransaction(tx);
    } finally {
      //batch.forEach(([direction, overrideId, isWinner]) => {
      //  Position.removeOverride(overrideId);
      //});
    }

  });

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


    try {
      if (!isWinner) {
        const overrideId = uuid();
        Position.addOverride(overrideId, {
          entity: playerEntity,
          value: { x, y },
        });
      }
      moveBatchQueue.addItem(direction);
      //const tx = await worldContract.write.move([direction]);
      //await waitForTransaction(tx);
      console.log("Added to batch queue: ", direction);
    } finally {
    }
  };

  const setMap = async (width: number, height: number, terrain: Hex) => {
    const tx = await worldContract.write.setMap([width, height, terrain]);
    await waitForTransaction(tx);
    Position.addOverride(uuid(), {
      entity: playerEntity,
      value: { x: 1, y: 0 },
    });
  };

  return {
    move,
    setMap,
  };
}
