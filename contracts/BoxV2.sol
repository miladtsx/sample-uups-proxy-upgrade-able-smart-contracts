// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.9;

import "./Box.sol";
import "./interfaces/IBoxV2.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract BoxV2 is Box, IBoxV2 {
    function increment() external override(IBoxV2, Box) whenNotPaused {
        _secretValue += 1; // bug is fixed here
    }
}
