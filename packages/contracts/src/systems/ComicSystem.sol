// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";
import { Page } from "../codegen/index.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";

uint256 constant PAGE_SIZE = 10;

contract ComicSystem is System {

  function nextPage() public {
    bytes32 player = addressToEntityKey(_msgSender());

    uint256 page = Page.get(player);

    page += 1 % PAGE_SIZE;

    Page.set(player, page);
  }

  function prevPage() public {
    bytes32 player = addressToEntityKey(_msgSender());

    uint256 page = Page.get(player);

    page -= 1 % PAGE_SIZE;

    Page.set(player, page);
  }

}
