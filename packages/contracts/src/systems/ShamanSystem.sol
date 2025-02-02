// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { BaseSystem } from "./BaseSystem.sol";
import { Shamans, ShamanConfig, ShamanLogs, Roles } from "../codegen/index.sol";
import { TransactionType, RoleType } from "../codegen/common.sol";

contract ShamanSystem is BaseSystem {
  event ShamanCreated(bytes32 indexed shamanId, address indexed creator);

  function createShaman(
    uint256 initialDeposit,
    string memory metadataURI
  ) public {
    require(bytes(metadataURI).length > 0, "Metadata URI cannot be empty");

    bytes32 shamanId = keccak256(
      abi.encodePacked(_msgSender(), block.timestamp, block.prevrandao)
    );
    Shamans.setCreator(shamanId, _msgSender());
    Shamans.setActive(shamanId, true);
    Shamans.setCreatedAt(shamanId, block.timestamp);
    Shamans.setBalance(shamanId, initialDeposit);
    Shamans.setMetadataURI(shamanId, metadataURI);

    if (initialDeposit > 0) {
      _token().transferFrom(_msgSender(), address(this), initialDeposit);

      bytes32 transactionId = keccak256(
        abi.encodePacked(shamanId, block.timestamp)
      );
      ShamanLogs.setShamanId(transactionId, shamanId);
      ShamanLogs.setTransactionType(transactionId, TransactionType.Deposit);
      ShamanLogs.setAmount(transactionId, initialDeposit);
      ShamanLogs.setSuccess(transactionId, true);
      ShamanLogs.setCreatedAt(transactionId, block.timestamp);
    }

    emit ShamanCreated(shamanId, _msgSender());
  }

  function updateShamanMetadata(
    bytes32 shamanId,
    string memory metadataURI
  ) public onlyCreator(shamanId) {
    require(bytes(metadataURI).length > 0, "Metadata URI cannot be empty");
    require(Shamans.getActive(shamanId), "Shaman is not active");

    Shamans.setMetadataURI(shamanId, metadataURI);
  }

  function cancelShaman(bytes32 shamanId) public onlyCreator(shamanId) {
    require(Shamans.getActive(shamanId), "Shaman is not active");

    uint256 remainingBalance = Shamans.getBalance(shamanId);
    address creator = Shamans.getCreator(shamanId);

    // Set shaman as inactive
    Shamans.setActive(shamanId, false);

    // Refund remaining balance to creator if any
    if (remainingBalance > 0) {
      Shamans.setBalance(shamanId, 0);
      _token().transfer(creator, remainingBalance);

      // Log the refund
      bytes32 transactionId = keccak256(
        abi.encodePacked(shamanId, block.timestamp)
      );
      ShamanLogs.setShamanId(transactionId, shamanId);
      ShamanLogs.setTransactionType(transactionId, TransactionType.Deposit);
      ShamanLogs.setAmount(transactionId, remainingBalance);
      ShamanLogs.setSuccess(transactionId, true);
      ShamanLogs.setCreatedAt(transactionId, block.timestamp);
    }
  }

  function executeShaman(
    bytes32 shamanId,
    uint256 cost,
    address target,
    bytes memory data
  ) public onlyOperator {
    require(Shamans.getActive(shamanId), "Shaman is not active");
    require(
      Shamans.getBalance(shamanId) >= cost,
      "Insufficient balance in shaman"
    );
    require(
      _token().balanceOf(address(this)) >= cost,
      "Insufficient balance in contract"
    );

    // execute the calldata
    (bool success, ) = target.call(data);

    bytes32 transactionId = keccak256(
      abi.encodePacked(shamanId, block.timestamp)
    );

    Shamans.setBalance(shamanId, Shamans.getBalance(shamanId) - cost);

    ShamanLogs.setShamanId(transactionId, shamanId);
    ShamanLogs.setTransactionType(transactionId, TransactionType.Execute);
    ShamanLogs.setAmount(transactionId, cost);
    ShamanLogs.setCreatedAt(transactionId, block.timestamp);
    ShamanLogs.setSuccess(transactionId, success);

    // burn $ZUG regardless of success
    _token().burn(cost);
  }

  function fundShaman(bytes32 shamanId, uint256 amount) public {
    require(Shamans.getActive(shamanId), "Shaman is not active");
    require(amount > 0, "Amount must be greater than 0");
    _token().transferFrom(_msgSender(), address(this), amount);

    Shamans.setBalance(shamanId, Shamans.getBalance(shamanId) + amount);

    bytes32 transactionId = keccak256(
      abi.encodePacked(shamanId, block.timestamp)
    );

    ShamanLogs.setShamanId(transactionId, shamanId);
    ShamanLogs.setTransactionType(transactionId, TransactionType.Deposit);
    ShamanLogs.setAmount(transactionId, amount);
    ShamanLogs.setSuccess(transactionId, true);
    ShamanLogs.setCreatedAt(transactionId, block.timestamp);
  }
}
