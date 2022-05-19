// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.9;

import "./Storage.sol";

contract StorageV2 is Storage {
    mapping(address => uint256) internal depositedTokens; // Added at V2
}
