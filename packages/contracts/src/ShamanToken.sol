// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { IShamanToken } from "./IShamanToken.sol";

contract ShamanToken is IShamanToken, ERC20, AccessControl {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

  constructor() ERC20("Shaman", "SHAMAN") {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
    _mint(to, amount);
  }

  function burn(address from, uint256 amount) public onlyRole(BURNER_ROLE) {
    _burn(from, amount);
  }
}
