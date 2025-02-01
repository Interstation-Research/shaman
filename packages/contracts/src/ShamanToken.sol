// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { IShamanToken } from "./IShamanToken.sol";

contract ShamanToken is IShamanToken, ERC20, AccessControl {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

  address public treasury;
  uint256 public maxSupply;
  uint256 public price;
  bool public saleActive;

  constructor(
    uint256 _maxSupply,
    uint256 _price,
    address _treasury
  ) ERC20("Shaman", "SHAMAN") {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    treasury = _treasury;
    maxSupply = _maxSupply;
    price = _price;
    saleActive = true;
  }

  function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
    _mint(to, amount);
  }

  function buy(uint256 quantity, address recipient) public payable {
    require(saleActive, "Sale is not active");
    require(quantity > 0, "Quantity must be greater than 0");
    uint256 totalCost = quantity * price;
    require(msg.value >= totalCost, "Insufficient funds");
    require(totalSupply() + quantity <= maxSupply, "Exceeds max supply");

    _mint(recipient, quantity);
  }

  function burn(address from, uint256 amount) public onlyRole(BURNER_ROLE) {
    _burn(from, amount);
  }

  function setPrice(uint256 _price) public onlyRole(DEFAULT_ADMIN_ROLE) {
    price = _price;
  }

  function setMaxSupply(
    uint256 _maxSupply
  ) public onlyRole(DEFAULT_ADMIN_ROLE) {
    maxSupply = _maxSupply;
  }

  function setSaleActive(bool _saleActive) public onlyRole(DEFAULT_ADMIN_ROLE) {
    saleActive = _saleActive;
  }

  function setTreasury(address _treasury) public onlyRole(DEFAULT_ADMIN_ROLE) {
    treasury = _treasury;
  }

  function withdraw() public onlyRole(DEFAULT_ADMIN_ROLE) {
    require(address(this).balance > 0, "Insufficient balance");
    payable(treasury).transfer(address(this).balance);
  }
}
