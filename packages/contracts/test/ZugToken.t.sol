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
    token = new ZugToken(INITIAL_MAX_SUPPLY);
    token.setTreasury(treasury);
    token.setPrice(INITIAL_PRICE);
    token.grantRole(token.MINTER_ROLE(), admin);
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
    assertEq(token.decimals(), 0);
  }

  function testTokenDecimals() public {
    // Test that token has 0 decimals
    assertEq(token.decimals(), 0);

    // Test minting and transferring with whole numbers
    vm.startPrank(admin);
    token.mint(alice, 100); // Mint 100 tokens (no decimals)
    vm.stopPrank();

    assertEq(token.balanceOf(alice), 100);

    // Test transfer with whole numbers
    vm.startPrank(alice);
    token.transfer(bob, 50); // Transfer 50 tokens
    vm.stopPrank();

    assertEq(token.balanceOf(alice), 50);
    assertEq(token.balanceOf(bob), 50);
  }

  function testBuyingWithZeroDecimals() public {
    vm.startPrank(admin);
    token.setSaleActive(true);
    token.setPrice(1 ether); // Set price to 1 ETH per token
    vm.stopPrank();

    uint256 amount = 5; // Buy 5 whole tokens
    uint256 cost = amount * 1 ether;

    vm.deal(alice, cost);

    vm.startPrank(alice);
    token.buy{ value: cost }(alice, amount);
    vm.stopPrank();

    assertEq(token.balanceOf(alice), 5); // Should have exactly 5 tokens
    assertEq(address(token).balance, cost);
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
    bytes32 role = keccak256("MINTER_ROLE");
    vm.expectRevert(
      abi.encodeWithSignature(
        "AccessControlUnauthorizedAccount(address,bytes32)",
        alice,
        role
      )
    );
    token.mint(alice, 100 ether);
    vm.stopPrank();
  }

  function testMintingAboveMaxSupply() public {
    vm.startPrank(admin);
    vm.expectRevert("ZugToken: mint would exceed max supply");
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
    assertEq(address(token).balance, cost);
  }

  function testBuyingWithInsufficientPayment() public {
    vm.startPrank(admin);
    token.setSaleActive(true);
    vm.stopPrank();

    uint256 amount = 100 ether;
    uint256 cost = amount * INITIAL_PRICE;

    vm.deal(alice, cost);

    vm.startPrank(alice);
    vm.expectRevert("ZugToken: insufficient payment");
    token.buy{ value: cost - 1 }(alice, amount);
    vm.stopPrank();
  }

  function testBuyingWhenSaleInactive() public {
    uint256 amount = 100 ether;
    uint256 cost = amount * INITIAL_PRICE;

    vm.deal(alice, cost);

    vm.startPrank(alice);
    vm.expectRevert("ZugToken: sale is not active");
    token.buy{ value: cost }(alice, amount);
    vm.stopPrank();
  }

  function testBuyingWithoutTreasury() public {
    vm.startPrank(admin);
    token.setSaleActive(true);
    vm.expectRevert("ZugToken: treasury address cannot be zero");
    token.setTreasury(address(0));
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
    vm.expectRevert("ZugToken: purchase would exceed max supply");
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
    vm.expectRevert("ZugToken: price must be greater than 0");
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
    vm.expectRevert("ZugToken: new max supply below current supply");
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
    vm.expectRevert("ZugToken: treasury address cannot be zero");
    token.setTreasury(address(0));
    vm.stopPrank();
  }

  function testWithdrawWithoutTreasury() public {
    vm.startPrank(admin);
    vm.expectRevert("ZugToken: treasury address cannot be zero");
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
