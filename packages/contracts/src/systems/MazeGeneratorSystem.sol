// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";
import { Encounter, EncounterData, Encounterable, EncounterTrigger, MapConfig, Monster, Movable, Obstruction, Player, Position, Winner } from "../codegen/index.sol";

import { addressToEntityKey } from "../addressToEntityKey.sol";
import { TerrainType } from "../codegen/common.sol";

contract MazeGeneratorSystem is System {
  function setMap(uint32 width, uint32 height, bytes memory terrain) public {
    require(width > 0 && height > 0, "MazeGeneratorSystem: Invalid map dimensions");
    require(terrain.length == width * height, "MazeGeneratorSystem: Invalid terrain length");


    bytes32 player = addressToEntityKey(_msgSender());

    MapConfig.set(player, width, height, terrain);
    setPosition(1, 0, player);
  }

  function setPosition(int32 x, int32 y, bytes32 player) internal {
    // Constrain position to map size, wrapping around if necessary
    (uint32 width, uint32 height, ) = MapConfig.get(player);
    x = (x + int32(width)) % int32(width);
    y = (y + int32(height)) % int32(height);

    // bytes32 position = positionToEntityKey(x, y);
    // require(!Obstruction.get(position), "this space is obstructed");

    Player.set(player, true);
    Position.set(player, x, y);
    Movable.set(player, true);
    Winner.set(player, false);
    Encounterable.set(player, false);
  }
}
