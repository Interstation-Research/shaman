// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import "forge-std/console.sol";
import { BaseTest } from "./BaseTest.t.sol";
import { Shamans, ShamanTransactions } from "../src/codegen/index.sol";
import { TransactionType } from "../src/codegen/common.sol";

contract ShamanSystemTest is BaseTest {
  function testCreateShaman() public {
    // Alice creates a shaman with an initial deposit of 100 $SHAMAN
    uint256 initialDeposit = 100 ether;
    bytes32 shamanId = _createShaman(creatorAlice, initialDeposit);

    // Verify the shaman was created
    assertEq(Shamans.getCreator(shamanId), creatorAlice);
    assertEq(Shamans.getActive(shamanId), true);
    assertEq(Shamans.getBalance(shamanId), initialDeposit);

    // Verify the deposit transaction was logged
    bytes32 transactionId = keccak256(
      abi.encodePacked(shamanId, block.timestamp)
    );
    assertEq(ShamanTransactions.getShamanId(transactionId), shamanId);
    assertEq(
      uint256(ShamanTransactions.getTransactionType(transactionId)),
      uint256(TransactionType.Deposit)
    );
    assertEq(ShamanTransactions.getAmount(transactionId), initialDeposit);
    assertEq(ShamanTransactions.getSuccess(transactionId), true);
  }

  function testExecuteShaman() public {
    // Alice creates a shaman with an initial deposit of 100 $SHAMAN
    uint256 initialDeposit = 100 ether;
    bytes32 shamanId = _createShaman(creatorAlice, initialDeposit);

    // Fund the shaman with additional $SHAMAN
    uint256 additionalDeposit = 50 ether;
    _fundShaman(creatorAlice, shamanId, additionalDeposit);

    // Execute a transaction on the mock contract
    bytes memory data = abi.encodeWithSignature("mockFunction(uint256)", 42); // Call mockFunction with value 42
    uint256 cost = 10 ether;

    vm.prank(signerAddress); // Admin executes the transaction
    world.executeShaman(shamanId, cost, mockContract, data);
    vm.stopPrank();

    // Verify the shaman's balance was reduced
    assertEq(
      Shamans.getBalance(shamanId),
      initialDeposit + additionalDeposit - cost
    );

    // Verify the execute transaction was logged
    bytes32 transactionId = keccak256(
      abi.encodePacked(shamanId, block.timestamp)
    );
    assertEq(ShamanTransactions.getShamanId(transactionId), shamanId);
    assertEq(
      uint256(ShamanTransactions.getTransactionType(transactionId)),
      uint256(TransactionType.Execute)
    );
    assertEq(ShamanTransactions.getAmount(transactionId), cost);
    assertEq(ShamanTransactions.getSuccess(transactionId), true);
  }
}
