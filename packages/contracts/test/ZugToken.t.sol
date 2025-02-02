// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import { ZugToken } from "../src/ZugToken.sol";

contract ZugTokenTest is Test {
  ZugToken public token;
  address public admin;
  address public treasury;
  address public alice;
  address public bob;

  uint256 public constant INITIAL_MAX_SUPPLY = 1_000_000 ether;
  uint256 public constant INITIAL_PRICE = 0.01 ether;

  function setUp() public {
    admin = makeAddr("admin");
    treasury = makeAddr("treasury");
    alice = makeAddr("alice");
    bob = makeAddr("bob");

    vm.startPrank(admin);
    token = new ZugToken(INITIAL_MAX_SUPPLY, INITIAL_PRICE, treasury);
    vm.stopPrank();
  }

  function testInitialState() public {
    assertEq(token.name(), "Zug");
    assertEq(token.symbol(), "ZUG");
    assertEq(token.maxSupply(), INITIAL_MAX_SUPPLY);
    assertEq(token.price(), INITIAL_PRICE);
    assertEq(token.treasury(), treasury);
    assertEq(token.saleActive(), false);
    assertEq(token.totalSupply(), 0);
  }

  function testMintingByMinter() public {
    vm.startPrank(admin);
    token.mint(alice, 100 ether);
    vm.stopPrank();

    assertEq(token.balanceOf(alice), 100 ether);
    assertEq(token.totalSupply(), 100 ether);
  }

  function testMintingByUnauthorized() public {
    vm.startPrank(alice);
    vm.expectRevert(
      "AccessControl: account 0x328809bc894f92807417d2dad6b7c998c1afdac6 is missing role 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6"
    );
    token.mint(alice, 100 ether);
    vm.stopPrank();
  }

  function testMintingAboveMaxSupply() public {
    vm.startPrank(admin);
    vm.expectRevert("Mint would exceed max supply");
    token.mint(alice, INITIAL_MAX_SUPPLY + 1);
    vm.stopPrank();
  }

  function testBuyingTokens() public {
    vm.startPrank(admin);
    token.setSaleActive(true);
    vm.stopPrank();

    uint256 amount = 100 ether;
    uint256 cost = amount * INITIAL_PRICE;

    vm.deal(alice, cost);

    vm.startPrank(alice);
    token.buy{ value: cost }(alice, amount);
    vm.stopPrank();

    assertEq(token.balanceOf(alice), amount);
    assertEq(treasury.balance, cost);
  }

  function testBuyingWithInsufficientPayment() public {
    vm.startPrank(admin);
    token.setSaleActive(true);
    vm.stopPrank();

    uint256 amount = 100 ether;
    uint256 cost = amount * INITIAL_PRICE;

    vm.deal(alice, cost);

    vm.startPrank(alice);
    vm.expectRevert("Insufficient payment");
    token.buy{ value: cost - 1 }(alice, amount);
    vm.stopPrank();
  }

  function testBuyingWhenSaleInactive() public {
    uint256 amount = 100 ether;
    uint256 cost = amount * INITIAL_PRICE;

    vm.deal(alice, cost);

    vm.startPrank(alice);
    vm.expectRevert("Sale is not active");
    token.buy{ value: cost }(alice, amount);
    vm.stopPrank();
  }

  function testBuyingAboveMaxSupply() public {
    vm.startPrank(admin);
    token.setSaleActive(true);
    vm.stopPrank();

    uint256 amount = INITIAL_MAX_SUPPLY + 1;
    uint256 cost = amount * INITIAL_PRICE;

    vm.deal(alice, cost);

    vm.startPrank(alice);
    vm.expectRevert("Purchase would exceed max supply");
    token.buy{ value: cost }(alice, amount);
    vm.stopPrank();
  }

  function testSettingNewPrice() public {
    uint256 newPrice = 0.02 ether;

    vm.startPrank(admin);
    token.setPrice(newPrice);
    vm.stopPrank();

    assertEq(token.price(), newPrice);
  }

  function testSettingInvalidPrice() public {
    vm.startPrank(admin);
    vm.expectRevert("Price must be greater than 0");
    token.setPrice(0);
    vm.stopPrank();
  }

  function testSettingNewMaxSupply() public {
    uint256 newMaxSupply = 2_000_000 ether;

    vm.startPrank(admin);
    token.setMaxSupply(newMaxSupply);
    vm.stopPrank();

    assertEq(token.maxSupply(), newMaxSupply);
  }

  function testSettingInvalidMaxSupply() public {
    vm.startPrank(admin);
    token.mint(alice, 100 ether);
    vm.expectRevert("New max supply below current supply");
    token.setMaxSupply(50 ether);
    vm.stopPrank();
  }

  function testSettingNewTreasury() public {
    address newTreasury = makeAddr("newTreasury");

    vm.startPrank(admin);
    token.setTreasury(newTreasury);
    vm.stopPrank();

    assertEq(token.treasury(), newTreasury);
  }

  function testSettingInvalidTreasury() public {
    vm.startPrank(admin);
    vm.expectRevert("Treasury address cannot be zero");
    token.setTreasury(address(0));
    vm.stopPrank();
  }

  function testBurning() public {
    vm.startPrank(admin);
    token.mint(alice, 100 ether);
    vm.stopPrank();

    vm.startPrank(alice);
    token.burn(50 ether);
    vm.stopPrank();

    assertEq(token.balanceOf(alice), 50 ether);
    assertEq(token.totalSupply(), 50 ether);
  }
}
