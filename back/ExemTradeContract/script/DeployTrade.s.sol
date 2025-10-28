// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../src/TradeContract.sol";

contract DeployTrade is Script {
    function run() external {
        vm.startBroadcast();
        new TradeContract{value: 10 ether}();
        vm.stopBroadcast();
    }
}