// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { Shamans } from "../codegen/index.sol";

contract ShamanSystem is System {
  function createShaman(address creator) public {
    bytes32 shamanId = keccak256(
      abi.encodePacked(creator, block.timestamp, block.prevrandao)
    );
    Shamans.setCreator(shamanId, creator);
    Shamans.setActive(shamanId, true);
  }
}
