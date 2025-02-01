// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import "forge-std/Test.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import { GasReporter } from "@latticexyz/gas-report/src/GasReporter.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import { ShamanConfig, Shamans, ShamanTransactions, Roles } from "../src/codegen/index.sol";
import { RoleType } from "../src/codegen/common.sol";
import { IShamanToken } from "../src/IShamanToken.sol";

contract BaseTest is MudTest, GasReporter {
  // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
  uint256 internal deployerPrivateKey = vm.envUint("PRIVATE_KEY");
  // Load the signer address
  address internal signerAddress = vm.envAddress("SIGNER_ADDRESS");
  // Load the treasury address
  address internal treasury = vm.envAddress("TREASURY_ADDRESS");

  IWorld world;

  // Contracts
  IShamanToken shamanToken;

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
    shamanToken = IShamanToken(ShamanConfig.getTokenAddress());

    // Deploy a mock contract for calldata execution
    mockContract = address(new MockContract());

    // Initialize test accounts
    creatorAlice = makeAddr("alice");
    creatorBob = makeAddr("bob");
    creatorCharlie = makeAddr("charlie");

    console.log("Creator Alice:", creatorAlice);
    console.log("Creator Bob:", creatorBob);
    console.log("Creator Charlie:", creatorCharlie);

    // Mint $SHAMAN tokens to the creators
    uint256 initialBalance = 1000 ether;
    // Admin mints tokens
    vm.prank(signerAddress);
    shamanToken.mint(creatorAlice, initialBalance);
    shamanToken.mint(creatorBob, initialBalance);
    shamanToken.mint(creatorCharlie, initialBalance);
    vm.stopPrank();

    // Approve the ShamanSystem to spend tokens on behalf of the creators
    vm.prank(creatorAlice);
    shamanToken.approve(address(world), type(uint256).max);
    vm.stopPrank();

    vm.prank(creatorBob);
    shamanToken.approve(address(world), type(uint256).max);
    vm.stopPrank();

    vm.prank(creatorCharlie);
    shamanToken.approve(address(world), type(uint256).max);
    vm.stopPrank();
  }

  function _createShaman(
    address creator,
    uint256 initialDeposit
  ) internal returns (bytes32 shamanId) {
    vm.prank(creator);
    world.createShaman(initialDeposit);
    vm.stopPrank();

    // Retrieve the shamanId from the event
    vm.recordLogs();
    world.createShaman(initialDeposit);
    Vm.Log[] memory entries = vm.getRecordedLogs();
    for (uint256 i = 0; i < entries.length; i++) {
      if (entries[i].topics[0] == keccak256("ShamanCreated(bytes32,address)")) {
        shamanId = abi.decode(entries[i].data, (bytes32));
        break;
      }
    }
    require(shamanId != bytes32(0), "Shaman creation failed");
  }

  function _fundShaman(
    address creator,
    bytes32 shamanId,
    uint256 amount
  ) internal {
    vm.prank(creator);
    world.fundShaman(shamanId, amount);
    vm.stopPrank();
  }
}

// Mock contract for testing calldata execution
contract MockContract {
  event MockFunctionCalled(uint256 value);

  function mockFunction(uint256 value) public {
    emit MockFunctionCalled(value);
  }
}
