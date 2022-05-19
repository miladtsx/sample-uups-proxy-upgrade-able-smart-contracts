// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.9;

// add increment() (a buggy one)
interface IBox {
    function pause() external;

    function unpause() external;

    function onlyProxyPause() external;

    // Initialize
    // function __Box_init() internal;

    // introduced a buggy method
    function increment() external;
}
