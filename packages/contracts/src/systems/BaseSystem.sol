// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";
import { IZugToken } from "../IZugToken.sol";
import { Shamans, ShamanConfig, Roles } from "../codegen/index.sol";
import { RoleType } from "../codegen/common.sol";

contract BaseSystem is System {
  modifier onlyOperator() {
    require(Roles.getRole(_msgSender()) == RoleType.Operator, "Not operator");
    _;
  }

  modifier onlyCreator(bytes32 shamanId) {
    require(Shamans.getCreator(shamanId) == _msgSender(), "Not shaman creator");
    _;
  }

  function _token() internal view returns (IZugToken) {
    return IZugToken(ShamanConfig.getTokenAddress());
  }
}
