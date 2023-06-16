require('@nomicfoundation/hardhat-toolbox');

const dotenv = require('dotenv');
dotenv.config();

// Customized tasks
require('./tasks/0.test');
require('./tasks/1.setadmin');
require('./tasks/2.initPricePool');
require('./tasks/3.rollDice');
require('./tasks/4.roll10Dice');
require('./tasks/5.roll100Dice');
require('./tasks/6.rollDice10Times');
require('./tasks/7.rollDice100Times');
require('./tasks/8.getWinnerMetrics');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: '0.8.18',
    networks: {
        'thunder-testnet': {
            url: 'https://testnet-rpc.thundercore.com',
            chainId: 18,
            gasPrice: 15e9,
            accounts: process.env.ACCOUNT2_PRIVATE_KEY
                ? [process.env.ACCOUNT2_PRIVATE_KEY]
                : [],
        },
        'thunder-mainnet': {
            url: 'https://mainnet-rpc.thundercore.com',
            chainId: 108,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
    },
    etherscan: {
        apiKey: {
            'thunder-testnet': 'unused',
        },
        customChains: [
            {
                network: 'thunder-testnet',
                chainId: 18,
                urls: {
                    apiURL: 'https://explorer-testnet.thundercore.com/api',
                    browserURL: 'https://explorer-testnet.thundercore.com',
                },
            },
        ],
    },
};
