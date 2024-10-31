// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";
import { Encounter, EncounterData, Encounterable, EncounterTrigger, MapConfig, Monster, Movable, Obstruction, Player, Position, Winner } from "../codegen/index.sol";
import { Direction, MonsterType } from "../codegen/common.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";
import { positionToEntityKey } from "../positionToEntityKey.sol";

contract MapSystem is System {
  function spawn(int32 x, int32 y) public {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    require(!Player.get(player), "already spawned");

    // Constrain position to map size, wrapping around if necessary
    (uint32 width, uint32 height, ) = MapConfig.get(player);

    x = (x + int32(width)) % int32(width);
    y = (y + int32(height)) % int32(height);

    bytes32 position = positionToEntityKey(x, y);
    require(!Obstruction.get(position), "this space is obstructed");

    Player.set(player, true);
    Position.set(player, x, y);
    Movable.set(player, true);
    Winner.set(player, false);
    Encounterable.set(player, false);
  }

  function move(Direction direction) public {
    bytes32 player = addressToEntityKey(_msgSender());
    require(Movable.get(player), "cannot move");
    require(!Encounter.getExists(player), "cannot move during an encounter");

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

    // bytes32 position = positionToEntityKey(x, y);
    // require(!Obstruction.get(position), "this space is obstructed");

    Position.set(player, x, y);
  }

  function startEncounter(bytes32 player) internal {
    bytes32 monster = keccak256(abi.encode(player, blockhash(block.number - 1), block.prevrandao));
    MonsterType monsterType = MonsterType((uint256(monster) % uint256(type(MonsterType).max)) + 1);
    Monster.set(monster, monsterType);
    Encounter.set(player, EncounterData({exists: true, monster: monster, catchAttempts: 0}));
  }
}
