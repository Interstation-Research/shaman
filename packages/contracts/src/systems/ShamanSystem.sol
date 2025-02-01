// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { BaseSystem } from "./BaseSystem.sol";
import { Shamans, ShamanConfig, ShamanTransactions } from "../codegen/index.sol";
import { TransactionType } from "../codegen/common.sol";
import { IShamanToken } from "../IShamanToken.sol";

contract ShamanSystem is BaseSystem {
  function createShaman(uint256 initialDeposit) public {
    bytes32 shamanId = keccak256(
      abi.encodePacked(_msgSender(), block.timestamp, block.prevrandao)
    );
    Shamans.setCreator(shamanId, _msgSender());
    Shamans.setActive(shamanId, true);
    Shamans.setCreatedAt(shamanId, block.timestamp);
    Shamans.setBalance(shamanId, initialDeposit);

    if (initialDeposit > 0) {
      require(
        _token().transferFrom(_msgSender(), address(this), initialDeposit),
        "Transfer failed"
      );

      bytes32 transactionId = keccak256(
        abi.encodePacked(shamanId, block.timestamp)
      );
      ShamanTransactions.setShamanId(transactionId, shamanId);
      ShamanTransactions.setTransactionType(
        transactionId,
        TransactionType.Deposit
      );
      ShamanTransactions.setAmount(transactionId, initialDeposit);
      ShamanTransactions.setSuccess(transactionId, true);
      ShamanTransactions.setCreatedAt(transactionId, block.timestamp);
    }
  }

  function executeShaman(
    bytes32 shamanId,
    uint256 cost,
    address target,
    bytes memory data
  ) public onlyAdmin {
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

    ShamanTransactions.setShamanId(transactionId, shamanId);
    ShamanTransactions.setTransactionType(
      transactionId,
      TransactionType.Execute
    );
    ShamanTransactions.setAmount(transactionId, cost);
    ShamanTransactions.setCreatedAt(transactionId, block.timestamp);
    ShamanTransactions.setSuccess(transactionId, success);

    // burn $SHAMAN regardless of success
    _token().burn(address(this), cost);
  }

  function fundShaman(bytes32 shamanId, uint256 amount) public {
    require(Shamans.getActive(shamanId), "Shaman is not active");
    require(
      _token().transferFrom(_msgSender(), address(this), amount),
      "Transfer failed"
    );

    Shamans.setBalance(shamanId, Shamans.getBalance(shamanId) + amount);

    bytes32 transactionId = keccak256(
      abi.encodePacked(shamanId, block.timestamp)
    );

    ShamanTransactions.setShamanId(transactionId, shamanId);
    ShamanTransactions.setTransactionType(
      transactionId,
      TransactionType.Deposit
    );
    ShamanTransactions.setAmount(transactionId, amount);
    ShamanTransactions.setSuccess(transactionId, true);
    ShamanTransactions.setCreatedAt(transactionId, block.timestamp);
  }
}
