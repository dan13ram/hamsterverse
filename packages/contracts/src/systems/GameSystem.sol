// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";
import { Page, Movable } from "../codegen/index.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";

uint256 constant PAGE_SIZE = 7;

// movable at the end of the pages

contract GameSystem is System {

  function nextPage() public {
    bytes32 player = addressToEntityKey(_msgSender());

    uint256 page = Page.get(player);

    if (page == PAGE_SIZE - 1) {
      return;
    }

    if (page == PAGE_SIZE - 2) {
       Movable.set(player, true);
    }
    page += 1 % PAGE_SIZE;

    Page.set(player, page);
  }

  function prevPage() public {
    bytes32 player = addressToEntityKey(_msgSender());

    uint256 page = Page.get(player);
    if (page == 0) {
      Movable.set(player, false);
      return;
    }

    page -= 1 % PAGE_SIZE;

    Page.set(player, page);
  }

}
