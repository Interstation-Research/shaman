// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import "forge-std/Test.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import { GasReporter } from "@latticexyz/gas-report/src/GasReporter.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import { ShamanConfig, Shamans, Roles } from "../src/codegen/index.sol";
import { RoleType } from "../src/codegen/common.sol";
import { IZugToken } from "../src/IZugToken.sol";
contract BaseTest is MudTest, GasReporter {
  // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
  uint256 internal deployerPrivateKey = vm.envUint("PRIVATE_KEY");
  // Load the signer address
  address internal signerAddress = vm.envAddress("SIGNER_ADDRESS");
  // Load the treasury address
  address internal treasury = vm.envAddress("TREASURY_ADDRESS");

  IWorld world;

  // Contracts
  IZugToken token;

  // Creators
  address creatorAlice;
  address creatorBob;
  address creatorCharlie;

  // Mock contract for calldata execution
  address mockContract;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);

    // Fetch contract addresses from the world
    token = IZugToken(ShamanConfig.getTokenAddress());

    // Initialize test accounts
    creatorAlice = makeAddr("alice");
    creatorBob = makeAddr("bob");
    creatorCharlie = makeAddr("charlie");

    console.log("Creator Alice:", creatorAlice);
    console.log("Creator Bob:", creatorBob);
    console.log("Creator Charlie:", creatorCharlie);
  }

  function _mintTokens(address to, uint256 amount) internal {
    vm.prank(signerAddress);
    token.mint(to, amount);
    vm.stopPrank();
  }

  function _increaseAllowance(address creator, uint256 amount) internal {
    vm.prank(creator);
    token.approve(worldAddress, amount);
    vm.stopPrank();
  }

  function _createShaman(
    address creator,
    uint256 initialDeposit,
    string memory metadataURI
  ) internal returns (bytes32 shamanId) {
    vm.recordLogs();

    vm.prank(creator);
    world.createShaman(initialDeposit, metadataURI);
    vm.stopPrank();

    // Get logs and find the ShamanCreated event
    Vm.Log[] memory entries = vm.getRecordedLogs();
    for (uint256 i = 0; i < entries.length; i++) {
      // Check if this is our event
      if (entries[i].topics[0] == keccak256("ShamanCreated(bytes32,address)")) {
        // For indexed parameters, they appear in topics
        // topics[0] is the event signature
        // topics[1] is the first indexed parameter (shamanId)
        shamanId = bytes32(entries[i].topics[1]);
        break;
      }
    }
    require(shamanId != bytes32(0), "Shaman creation failed");

    // Optional: Add debug logging
    console.log("Created shaman with ID:", uint256(shamanId));
  }

  function _depositShaman(
    address creator,
    bytes32 shamanId,
    uint256 amount
  ) internal {
    vm.prank(creator);
    world.depositShaman(shamanId, amount);
    vm.stopPrank();
  }
}
