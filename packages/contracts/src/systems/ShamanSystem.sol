// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { BaseSystem } from "./BaseSystem.sol";
import { Shamans, ShamanConfig, ShamanLogs, Roles } from "../codegen/index.sol";
import { LogType, RoleType } from "../codegen/common.sol";

contract ShamanSystem is BaseSystem {
  event ShamanCreated(bytes32 indexed shamanId, address indexed creator);

  function createShaman(uint256 initialDeposit, string memory metadata) public {
    require(bytes(metadata).length > 0, "Metadata cannot be empty");

    bytes32 shamanId = keccak256(
      abi.encodePacked(_msgSender(), block.timestamp, block.prevrandao)
    );
    Shamans.setCreator(shamanId, _msgSender());
    Shamans.setActive(shamanId, true);
    Shamans.setCreatedAt(shamanId, block.timestamp);
    Shamans.setBalance(shamanId, initialDeposit);
    Shamans.setMetadata(shamanId, metadata);

    if (initialDeposit > 0) {
      _token().transferFrom(_msgSender(), address(this), initialDeposit);

      bytes32 logId = keccak256(
        abi.encodePacked(shamanId, block.timestamp, block.prevrandao)
      );
      ShamanLogs.setShamanId(logId, shamanId);
      ShamanLogs.setLogType(logId, LogType.Deposit);
      ShamanLogs.setAmount(logId, initialDeposit);
      ShamanLogs.setSuccess(logId, true);
      ShamanLogs.setCreatedAt(logId, block.timestamp);
    }

    emit ShamanCreated(shamanId, _msgSender());
  }

  function updateShamanMetadata(
    bytes32 shamanId,
    string memory metadata
  ) public onlyCreator(shamanId) {
    require(bytes(metadata).length > 0, "Metadata cannot be empty");
    require(Shamans.getActive(shamanId), "Shaman is not active");

    Shamans.setMetadata(shamanId, metadata);
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
      bytes32 logId = keccak256(
        abi.encodePacked(shamanId, block.timestamp, block.prevrandao)
      );
      ShamanLogs.setShamanId(logId, shamanId);
      ShamanLogs.setLogType(logId, LogType.Refund);
      ShamanLogs.setAmount(logId, remainingBalance);
      ShamanLogs.setSuccess(logId, true);
      ShamanLogs.setCreatedAt(logId, block.timestamp);
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

    bytes32 logId = keccak256(
      abi.encodePacked(shamanId, block.timestamp, block.prevrandao)
    );

    Shamans.setBalance(shamanId, Shamans.getBalance(shamanId) - cost);

    ShamanLogs.setShamanId(logId, shamanId);
    ShamanLogs.setLogType(logId, LogType.Execution);
    ShamanLogs.setAmount(logId, cost);
    ShamanLogs.setCreatedAt(logId, block.timestamp);
    ShamanLogs.setSuccess(logId, success);

    // burn $ZUG regardless of success
    _token().burn(cost);
  }

  // add deposit and withdraw functions
  function depositShaman(bytes32 shamanId, uint256 amount) public {
    require(Shamans.getActive(shamanId), "Shaman is not active");
    require(amount > 0, "Amount must be greater than 0");
    _token().transferFrom(_msgSender(), address(this), amount);

    Shamans.setBalance(shamanId, Shamans.getBalance(shamanId) + amount);

    bytes32 logId = keccak256(abi.encodePacked(shamanId, block.timestamp));

    ShamanLogs.setShamanId(logId, shamanId);
    ShamanLogs.setLogType(logId, LogType.Deposit);
    ShamanLogs.setAmount(logId, amount);
    ShamanLogs.setSuccess(logId, true);
    ShamanLogs.setCreatedAt(logId, block.timestamp);
  }

  function withdrawShaman(bytes32 shamanId, uint256 amount) public {
    require(Shamans.getActive(shamanId), "Shaman is not active");
    require(amount > 0, "Amount must be greater than 0");
    require(Shamans.getBalance(shamanId) >= amount, "Insufficient balance");

    Shamans.setBalance(shamanId, Shamans.getBalance(shamanId) - amount);
    _token().transfer(_msgSender(), amount);

    bytes32 logId = keccak256(abi.encodePacked(shamanId, block.timestamp));

    ShamanLogs.setShamanId(logId, shamanId);
    ShamanLogs.setLogType(logId, LogType.Withdraw);
    ShamanLogs.setAmount(logId, amount);
    ShamanLogs.setSuccess(logId, true);
    ShamanLogs.setCreatedAt(logId, block.timestamp);
  }

  function getShamanMetadata(
    bytes32 shamanId
  ) public view returns (string memory) {
    return Shamans.getMetadata(shamanId);
  }

  function getShamanBalance(bytes32 shamanId) public view returns (uint256) {
    return Shamans.getBalance(shamanId);
  }

  function getShamanActive(bytes32 shamanId) public view returns (bool) {
    return Shamans.getActive(shamanId);
  }

  function getShamanCreator(bytes32 shamanId) public view returns (address) {
    return Shamans.getCreator(shamanId);
  }

  function getTokenAddress() public view returns (address) {
    return address(_token());
  }
}
