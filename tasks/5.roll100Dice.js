const { task } = require('hardhat/config');
const { readAddressList } = require('../scripts/helper');

task(
    '5.roll100Dice',
    'Run roll100Dice function of Recreation contract'
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

    // Call roll100Dice function
    // make sure gasLimit * gasPrice > actual gas used
    const options = {
        gasLimit: 1e7, // set the gas limit, can not exceed block gas limit
        gasPrice: ethers.parseUnits('900', 'gwei'), // set the gas price to 150 gwei
    };
    const tx = await recreation.roll100Dice(options);
    const txHash = tx.hash;
    console.log('Transaction hash is            : ', txHash);

    const receipt = await tx.wait();
    const gasUsed = ethers.formatEther(BigInt(receipt.gasUsed) * BigInt(15e9));
    console.log('Gas used                       : ', gasUsed);

    const result = await recreation.getResults();
    console.log(`Player ${signerAddress} has won ${result} times.`);
    console.log('Function roll100Dice called successfully');
});
