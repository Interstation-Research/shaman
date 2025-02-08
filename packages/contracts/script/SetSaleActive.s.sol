// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { ZugToken } from "../src/ZugToken.sol";
import { ShamanConfig } from "../src/codegen/index.sol";

contract SetSaleActive is Script {
  function run() external {
    console.log("Starting Script.");

    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    address worldAddress = vm.envAddress("WORLD_ADDRESS");

    vm.startBroadcast(deployerPrivateKey);

    StoreSwitch.setStoreAddress(worldAddress);
    address tokenAddress = ShamanConfig.getTokenAddress();

    ZugToken zugToken = ZugToken(tokenAddress);

    zugToken.setSaleActive(true);

    vm.stopBroadcast();
  }
}
