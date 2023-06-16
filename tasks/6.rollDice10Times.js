const { task } = require('hardhat/config');
const { readAddressList } = require('../scripts/helper');

task(
    '6.rollDice10Times',
    'Run rollDice function of Recreation contract for 10 times'
).setAction(async (_, hre) => {
    // Get the current player's address
    const signer = await hre.ethers.provider.getSigner();
    const signerAddress = await signer.getAddress();
    console.log('Player address is              : ', signerAddress);

    // Get contract addresses from address.json
    const addressList = readAddressList();
    const recreationAddress = addressList[hre.network.name].Recreation;
    console.log('Recreation contract address is : ', recreationAddress);
    console.log(
        '================================================================================'
    );

    // Connect to contract Recreation
    const recreation = await hre.ethers.getContractAt(
        'Recreation',
        recreationAddress
    );

    let runTimes = 10;
    let failTimes = 0;
    let winTimes = 0;
    let totalGas = 0;
    for (i = 0; i < runTimes; i++) {
        console.log('Roll dice round                : ', i + 1);

        // Check if player balance is less than 1 ether
        const balance = await hre.ethers.provider.getBalance(signerAddress);
        const signerBalance = ethers.formatEther(balance);
        console.log('Player balance is              : ', signerBalance);

        if (parseFloat(signerBalance) < 1) {
            runTimes = i;
            console.log('Player balance is less than 1 TST. Exit loop.');
            console.log(`Player ${signerAddress} has rolled dice ${i} times.`);
            console.log(
                '================================================================================'
            );
            break;
        }

        // Call rollDice function
        // const tx = await recreation.rollDice();    // 不指定 gas 会出错
        const options = {
            gasLimit: 1e7, // set the gas limit to 10,000,000
            gasPrice: ethers.parseUnits('15', 'gwei'), // set the gas price to 15 gwei
        };
        const tx = await recreation.rollDice(options);
        const txHash = tx.hash;
        console.log('Transaction hash is            : ', txHash);

        const receipt = await tx.wait();
        const gasUsed = ethers.formatEther(
            BigInt(receipt.gasUsed) * BigInt(15e9)
        );
        console.log('Gas used                       : ', gasUsed);
        totalGas += parseFloat(gasUsed);

        const result = await recreation.getSingleResult();

        if (result === null) {
            failTimes++;
            console.log('Transaction failed...');
        } else if (result === true) {
            winTimes++;
            console.log(`Player ${signerAddress} has won!`);
        } else {
            console.log(`Player ${signerAddress} has lost.`);
        }
        console.log(
            '================================================================================'
        );
    }
    console.log(
        `Function rollDice successfully called ${runTimes - failTimes} times.`
    );
    console.log(`Player ${signerAddress} has won ${winTimes} times.`);
    console.log('Total gas used                 : ', totalGas);
});
