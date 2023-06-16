const { task } = require('hardhat/config');
const { readAddressList } = require('../scripts/helper');

task(
    '4.roll10Dice',
    'Run roll10Dice function of Recreation contract'
).setAction(async (_, hre) => {
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
    const transaction = recreation.roll10Dice();
    const estimateGas = await ethers.provider.estimateGas(transaction);
    console.log('Estimate gas is                : ', estimateGas.toString());

    // Call roll10Dice function
    const tx = await transaction;
    // const options = {
    //     gasLimit: 10000000, // set the gas limit to 10,000,000
    //     gasPrice: ethers.parseUnits('15', 'gwei'), // set the gas price to 15 gwei
    // };
    // const tx = await recreation.rollDice(options);
    const txHash = tx.hash;
    console.log('Transaction hash is            : ', txHash);

    const receipt = await tx.wait();
    const gasUsed = ethers.formatEther(BigInt(receipt.gasUsed) * BigInt(15e9));
    console.log('Gas used                       : ', gasUsed);

    const result = await recreation.getResults();
    console.log(`Player ${signerAddress} has won ${result} times.`);
    console.log('Function roll10Dice called successfully');
});
