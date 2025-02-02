// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { IAccessControl } from "@openzeppelin/contracts/access/IAccessControl.sol";

import { ShamanConfig, Roles } from "../src/codegen/index.sol";
import { ShamanToken } from "../src/ShamanToken.sol";
import { RoleType } from "../src/codegen/common.sol";

contract PostDeploy is Script {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  function run(address worldAddress) external {
    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    // Load the signer address
    address signerAddress = vm.envAddress("SIGNER_ADDRESS");
    // Load the treasury address
    address treasuryAddress = vm.envAddress("TREASURY_ADDRESS");

    // Start broadcasting transactions from the deployer account
    vm.startBroadcast(deployerPrivateKey);

    // Deploy the ShamanToken contract
    uint256 maxSupply = 1_000_000 ether; // Example max supply
    uint256 price = 0.01 ether; // Example price per token
    ShamanToken shamanToken = new ShamanToken(
      maxSupply,
      price,
      treasuryAddress
    );

    console.log("ShamanToken deployed at:", address(shamanToken));

    // Grant roles to the signer address
    IAccessControl(address(shamanToken)).grantRole(MINTER_ROLE, signerAddress);

    console.log("Minter Role granted to signer address:", signerAddress);

    // Set the store address to the world address
    StoreSwitch.setStoreAddress(worldAddress);

    console.log("Store address set to:", worldAddress);

    // Configure ShamanConfig
    ShamanConfig.setTokenAddress(address(shamanToken));

    console.log("ShamanConfig token address set to:", address(shamanToken));

    // Grant operator role to signer address
    console.log("Operator role granted to: %s", signerAddress);
    Roles.setRole(signerAddress, RoleType.Operator);

    // Optionally, initialize other configurations or fixtures here
    // Example: Set initial token sale parameters
    // shamanToken.setSaleActive(true);
    // shamanToken.setPrice(0.01 ether);
    // shamanToken.setMaxSupply(maxSupply);

    vm.stopBroadcast();
  }
}
