// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Token.sol";

interface ThunderRandomLibraryInterface {
    function rand() external returns (uint256);
}

contract Recreation is Ownable {
    /***     产生随机数的固定参数     ***/
    address public constant RANDOM_NUMBER_CONTRACT =
        0x8cC9C2e145d3AA946502964B1B69CE3cD066A9C7;
    ThunderRandomLibraryInterface internal RNGLibrary;

    /***     奖励代币的相关参数       ***/
    // TCUSDInterface internal TCUSD;
    TCUSD internal tcUSD;
    uint8 public immutable DIGITS;

    /***     作业要求中指定的参数     ***/
    uint256 public constant JACKPOT = 10000;
    uint256 public constant BONUS = 10;

    /***    hardhat task 相关参数    ***/
    uint8 private winCondition = 0; // 0 为 未赋值；1 为 Win；2为 Lose
    uint8 private winNumber = 101; // 101 为 未赋值

    /***     获奖者名单的相关参数     ***/
    address[] private winners;
    mapping(address => bool) private isWinner;
    mapping(address => uint256) private winCount;

    /***            事件            ***/
    event Win(address, uint8);
    event Lose(address, uint8);
    event WinTimes(address, uint8);

    /***          构造函数          ***/
    /*** 先置条件: 已部署 TCUSD 合约 ***/
    constructor(address addrTCUSD) {
        RNGLibrary = ThunderRandomLibraryInterface(RANDOM_NUMBER_CONTRACT);
        tcUSD = TCUSD(addrTCUSD);
        DIGITS = tcUSD.decimals();
    }

    /***       第一步: 初始化奖金池         ***/
    /*** 按作业要求，给自己分配 10000 TCUSD ***/
    function initPricePool() external onlyOwner {
        tcUSD.mint(JACKPOT * 10 ** DIGITS);
    }

    /***    得到获奖用户及次数的相关函数    ***/
    function getWinners() external view returns (address[] memory) {
        return winners;
    }

    function getWinCount(address _winner) external view returns (uint256) {
        return winCount[_winner];
    }

    /***      hardhat task 相关函数       ***/
    function getSingleResult() external view returns (uint8) {
        return winCondition;
    }

    function getResults() external view returns (uint8) {
        return winNumber;
    }

    /***        主要函数：掷骰子           ***/
    function rollDice() external {
        // 只允许外部账户调用本函数，不允许合约账户调用
        require(msg.sender == tx.origin, "No contract address allowed");

        // 当奖金用完时，游戏结束
        uint256 reward = BONUS * 10 ** DIGITS;
        require(tcUSD.balanceOf(address(this)) >= reward, "Game over");

        // 重置 winCondition
        winCondition = 0;

        // 从 ThunderCore 随机数合约得到随机数，并将其转换为 1~6 之间的一个数
        uint8 diceNumber = uint8((RNGLibrary.rand() % 6) + 1);

        // 如果该数为 4, 5, 6
        // 1. 查看发起账户是否已在 Winners 数组中, 如不在, 则将其加入 Winners 数组；
        // 2. 将该账户的获奖记录 +1 ；
        // 3. 给该账户发送奖励（10 TCUSD）；
        // 4. 发送 Win/Lose 事件；
        // 5. 返回 true/false。
        if (diceNumber > 3) {
            if (!isWinner[msg.sender]) {
                winners.push(msg.sender);
                isWinner[msg.sender] = true;
            }
            winCount[msg.sender]++;
            tcUSD.transfer(msg.sender, reward);

            winCondition = 1;
            emit Win(msg.sender, diceNumber);
            // 如果该数为 1, 2, 3, 则发送 Lose 事件
        } else {
            winCondition = 2;
            emit Lose(msg.sender, diceNumber);
        }
    }

    /***      测试用函数：掷骰子10次      ***/
    function roll10Dice() external {
        // 只允许外部账户调用本函数，不允许合约账户调用
        require(msg.sender == tx.origin, "No contract address allowed");

        // 当奖金不够时，不可调用此函数
        uint256 rewardMax = 10 * BONUS * 10 ** DIGITS;
        require(
            tcUSD.balanceOf(address(this)) >= rewardMax,
            "Not enough reward"
        );

        // 重置 winNumber
        winNumber = 101;

        uint8 winTimes = 0;
        for (uint i = 0; i < 10; i++) {
            // 从 ThunderCore 随机数合约得到随机数，并将其转换为 1~6 之间的一个数
            uint8 diceNumber = uint8((RNGLibrary.rand() % 6) + 1);

            // 如果该数为 4, 5, 6
            // 1. 查看发起账户是否已在 Winners 数组中, 如不在, 则将其加入 Winners 数组；
            // 2. 将该账户的获奖记录 +1 ；
            // 3. 将该账户的本次获奖记录 +1 ；
            if (diceNumber > 3) {
                if (!isWinner[msg.sender]) {
                    winners.push(msg.sender);
                    isWinner[msg.sender] = true;
                }
                winCount[msg.sender]++;
                winTimes++;
            }
        }

        // 根据本次获奖记录发送奖励。
        if (winTimes != 0) {
            uint reward = winTimes * BONUS * 10 ** DIGITS;
            tcUSD.transfer(msg.sender, reward);
        }

        winNumber = winTimes;
        emit Win(msg.sender, winTimes);
    }

    /***      测试用函数：掷骰子100次      ***/
    function roll100Dice() external {
        // 只允许外部账户调用本函数，不允许合约账户调用
        require(msg.sender == tx.origin, "No contract address allowed");

        // 当奖金不够时，不可调用此函数
        uint256 rewardMax = 100 * BONUS * 10 ** DIGITS;
        require(
            tcUSD.balanceOf(address(this)) >= rewardMax,
            "Not enough reward"
        );

        // 重置 winNumber
        winNumber = 101;

        uint8 winTimes = 0;
        for (uint i = 0; i < 100; i++) {
            // 从 ThunderCore 随机数合约得到随机数，并将其转换为 1~6 之间的一个数
            uint8 diceNumber = uint8((RNGLibrary.rand() % 6) + 1);

            // 如果该数为 4, 5, 6
            // 1. 查看发起账户是否已在 Winners 数组中, 如不在, 则将其加入 Winners 数组；
            // 2. 将该账户的获奖记录 +1 ；
            // 3. 将该账户的本次获奖记录 +1 ；
            if (diceNumber > 3) {
                if (!isWinner[msg.sender]) {
                    winners.push(msg.sender);
                    isWinner[msg.sender] = true;
                }
                winCount[msg.sender]++;
                winTimes++;
            }
        }

        // 根据本次获奖记录发送奖励。
        if (winTimes != 0) {
            uint reward = winTimes * BONUS * 10 ** DIGITS;
            tcUSD.transfer(msg.sender, reward);
        }

        winNumber = winTimes;
        emit Win(msg.sender, winTimes);
    }
}
