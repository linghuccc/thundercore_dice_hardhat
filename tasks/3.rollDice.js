const { task } = require('hardhat/config');
const { readAddressList } = require('../scripts/helper');

task('3.rollDice', 'Run rollDice function of Recreation contract').setAction(
    async (_, hre) => {
        // Get the current signer's address and balance
        const signer = await hre.ethers.provider.getSigner();
        const signerAddress = await signer.getAddress();
        console.log('Signer address is              : ', signerAddress);

        const balance = await hre.ethers.provider.getBalance(signerAddress);
        const signerBalance = ethers.formatEther(balance);
        console.log('Signer balance is              : ', signerBalance);

        // Get contract addresses from address.json
        const addressList = readAddressList();
        const recreationAddress = addressList[hre.network.name].Recreation;
        console.log('Recreation contract address is : ', recreationAddress);

        // Connect to contract Recreation
        const recreation = await hre.ethers.getContractAt(
            'Recreation',
            recreationAddress
        );

        // Get estimate gas for the transaction
        const transaction = recreation.rollDice();
        const estimateGas = await ethers.provider.estimateGas(transaction);
        console.log(
            'Estimate gas is                : ',
            estimateGas.toString()
        );

        // Call rollDice function
        // const options = {
        //     gasLimit: 10000000, // set the gas limit to 10,000,000
        //     gasPrice: ethers.parseUnits('15', 'gwei'), // set the gas price to 15 gwei
        // };
        // const tx = await recreation.rollDice(options);
        const tx = await transaction;
        const txHash = tx.hash;
        console.log('Transaction hash is            : ', txHash);

        const receipt = await tx.wait();
        // const receiptLogs = receipt.logs;
        // console.log('Transaction logs are           : ', receiptLogs);   // 只得到 []

        const gasUsed = ethers.formatEther(
            BigInt(receipt.gasUsed) * BigInt(15e9)
        );
        console.log('Gas used                       : ', gasUsed);

        let isFail = false;
        const result = await recreation.getSingleResult();
        if (result === null) {
            isFail = true;
            console.log('Transaction failed...');
        } else if (result === true) {
            console.log(`Player ${signerAddress} has won!`);
        } else {
            console.log(`Player ${signerAddress} has lost.`);
        }
        if (isFail === false) {
            console.log('Function rollDice called successfully.');
        }
    }
);
