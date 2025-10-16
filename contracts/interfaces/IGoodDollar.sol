// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IGoodDollar is IERC20 {
    function claim() external returns (uint256);
    function claimFor(address recipient) external returns (uint256);
    function isClaimer(address account) external view returns (bool);
}
