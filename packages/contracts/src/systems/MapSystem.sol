// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";
import { MapConfig,  Movable, Player, Position, Winner } from "../codegen/index.sol";
import { Direction } from "../codegen/common.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";
import { positionToEntityKey } from "../positionToEntityKey.sol";

contract MapSystem is System {

  function move(Direction direction) public {
    bytes32 player = addressToEntityKey(_msgSender());
    require(Movable.get(player), "cannot move");

    // Constrain position to map size, wrapping around if necessary
    (uint32 width, uint32 height, bytes memory terrain) = MapConfig.get(player);

    (int32 x, int32 y) = Position.get(player);

    if (uint32(x) == width - 2 && uint32(y) == height -1  && direction == Direction.South) {
      Movable.set(player, false);
      Winner.set(player, true);
      return;
    }
    if (direction == Direction.North) {
      if (y == 0) {
        revert("cannot move north");
      }
      y -= 1;
    } else if (direction == Direction.East) {
      if (x == int32(width) - 1) {
        revert("cannot move east");
      }
      x += 1;
    } else if (direction == Direction.South) {
      if (y == int32(height) - 1) {
        revert("cannot move south");
      }
      y += 1;
    } else if (direction == Direction.West) {
      if (x == 0) {
        revert("cannot move west");
      }
      x -= 1;
    }

    x = (x + int32(width)) % int32(width);
    y = (y + int32(height)) % int32(height);

    uint8 terrainType = uint8(terrain[uint256(uint32(x)) + uint256(uint32(y)) * uint256(width)]);

    if (terrainType != 0) {
      revert("cannot move onto non-walkable terrain");
    }

    Position.set(player, x, y);
  }

}
