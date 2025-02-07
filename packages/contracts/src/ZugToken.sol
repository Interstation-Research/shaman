// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { IZugToken } from "./IZugToken.sol";

contract ZugToken is IZugToken, ERC20, AccessControl {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

  address public treasury;
  uint256 public maxSupply;
  uint256 public price;
  bool public saleActive;

  constructor(uint256 _maxSupply) ERC20("Zug", "ZUG") {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    maxSupply = _maxSupply;
    saleActive = false;
  }

  function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
    require(
      totalSupply() + amount <= maxSupply,
      "ZugToken: mint would exceed max supply"
    );
    _mint(to, amount);
  }

  function buy(address to, uint256 amount) public payable {
    require(saleActive, "ZugToken: sale is not active");
    require(amount > 0, "ZugToken: quantity must be greater than 0");
    uint256 totalCost = amount * price;
    require(msg.value >= totalCost, "ZugToken: insufficient payment");
    require(
      totalSupply() + amount <= maxSupply,
      "ZugToken: purchase would exceed max supply"
    );
    require(treasury != address(0), "ZugToken: treasury not set");

    _mint(to, amount);
  }

  function burn(uint256 amount) public onlyRole(BURNER_ROLE) {
    _burn(_msgSender(), amount);
  }

  function setPrice(uint256 _price) public onlyRole(DEFAULT_ADMIN_ROLE) {
    require(_price > 0, "ZugToken: price must be greater than 0");
    price = _price;
  }

  function setMaxSupply(
    uint256 _maxSupply
  ) public onlyRole(DEFAULT_ADMIN_ROLE) {
    require(
      _maxSupply >= totalSupply(),
      "ZugToken: new max supply below current supply"
    );
    maxSupply = _maxSupply;
  }

  function setSaleActive(bool _saleActive) public onlyRole(DEFAULT_ADMIN_ROLE) {
    saleActive = _saleActive;
  }

  function setTreasury(address _treasury) public onlyRole(DEFAULT_ADMIN_ROLE) {
    require(
      _treasury != address(0),
      "ZugToken: treasury address cannot be zero"
    );
    treasury = _treasury;
  }

  function withdraw() public onlyRole(DEFAULT_ADMIN_ROLE) {
    require(address(this).balance > 0, "ZugToken: insufficient balance");
    require(treasury != address(0), "ZugToken: treasury not set");
    payable(treasury).transfer(address(this).balance);
  }
}
