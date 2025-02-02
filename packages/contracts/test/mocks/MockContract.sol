// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

contract MockContract {
  event MockFunctionCalled(uint256 value);

  function mockFunction(uint256 value) public {
    emit MockFunctionCalled(value);
  }

  function mockFunctionWithRevert(uint256 value) public {
    emit MockFunctionCalled(value);
    revert("Mock revert");
  }
}
