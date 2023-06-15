// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TCUSD is ERC20, Ownable {
    address public admin;

    event Mint(address indexed recipient, uint256 amount);

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {}

    /***      只有管理员才能增发      ***/
    function mint(uint256 amount) external {
        require(msg.sender == admin, "Admin Only");

        _mint(admin, amount);

        emit Mint(admin, amount);
    }

    /*** 只有合约所有者才能设定管理员 ***/
    function setAdmin(address newAdmin) external onlyOwner {
        admin = newAdmin;
    }
}
