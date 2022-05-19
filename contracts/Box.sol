// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.9;
import "hardhat/console.sol";
import "./Storage.sol";
import "./interfaces/IBox.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

contract Box is
    Storage,
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable,
    PausableUpgradeable,
    IBox
{
    function __Box_init() internal onlyInitializing {
        set(200);
    }

    function set(uint256 _value) public initializer {
        _secretValue = _value;
        __Ownable_init_unchained();
    }

    function increment() external virtual {
        _secretValue -= 1;
    }

    function get() public view whenNotPaused returns (uint256) {
        return _secretValue;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        virtual
        override
    {
        //todo add hasRole(DEFAULT_ADMIN_ROLE, msg.sender);
        require(_msgSender() == owner(), "Unauthorized access");
        console.log("_authorizeUpgrade executed for admin:", _msgSender());
        console.log("New implementation address:", newImplementation);
    }

    function pause() external override onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function onlyProxyPause() external onlyProxy {
        _pause();
    }
}
