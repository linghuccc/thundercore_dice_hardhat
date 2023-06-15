const { task } = require('hardhat/config');
const { readAddressList } = require('../scripts/helper');

task(
    '2.initPricePool',
    'Initialize price pool for Recreation contract'
).setAction(async (_, hre) => {
    // Get the current signer's address and balance
    const signer = await hre.ethers.provider.getSigner();
    const signerAddress = await signer.getAddress();
    console.log('Signer address is              : ', signerAddress);

    const balance = await hre.ethers.provider.getBalance(signerAddress);
    const signerBalance = ethers.formatEther(balance);
    console.log('Signer balance is              : ', signerBalance);

    // Get recreation contract address from address.json
    const addressList = readAddressList();
    const recreationAddress = addressList[hre.network.name].Recreation;
    console.log('Recreation contract address is : ', recreationAddress);

    // Connect to contract Recreation
    const recreation = await hre.ethers.getContractAt(
        'Recreation',
        recreationAddress
    );

    // Get estimate gas for the transaction
    const transaction = recreation.initPricePool();
    const estimateGas = await ethers.provider.estimateGas(transaction);
    console.log('Estimate gas is                : ', estimateGas.toString());

    // Call initPricePool function
    const tx = await transaction;
    const txHash = tx.hash;
    console.log('Transaction hash is            : ', txHash);

    const receipt = await tx.wait();
    const gasUsed = ethers.formatEther(BigInt(receipt.gasUsed) * BigInt(15e9));
    console.log('Gas used                       : ', gasUsed);
    console.log('Function initPricePool called successfully');
});
