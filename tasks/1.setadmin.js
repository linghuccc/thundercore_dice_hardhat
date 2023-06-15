const { task } = require('hardhat/config');
const { readAddressList } = require('../scripts/helper');

task('1.setadmin', 'Set Admin for TCUSD contract').setAction(async (_, hre) => {
    // Get the current signer's address and balance
    const signer = await hre.ethers.provider.getSigner();
    const signerAddress = await signer.getAddress();
    console.log('Signer address is              : ', signerAddress);

    const balance = await hre.ethers.provider.getBalance(signerAddress);
    const signerBalance = ethers.formatEther(balance);
    console.log('Signer balance is              : ', signerBalance);

    // Get contract addresses from address.json
    const addressList = readAddressList();
    const tcUSDAddress = addressList[hre.network.name].TCUSD;
    const recreationAddress = addressList[hre.network.name].Recreation;
    console.log('TCUSD contract address is      : ', tcUSDAddress);
    console.log('Recreation contract address is : ', recreationAddress);

    // Connect to contract TCUSD
    const TCUSD = await hre.ethers.getContractAt('TCUSD', tcUSDAddress);

    // Get gas price for the network
    // const gasPrice = await ethers.provider.feeData.gasPrice();   // undefnied
    // console.log('Network gas price is          : ', gasPrice.toString());

    // Get network base fee
    // const baseFeePerGas = await ethers.provider.block.baseFeePerGas();   // undefnied
    // console.log('Current base fee per gas      :', baseFeePerGas.toString());

    // Get estimate gas for the transaction
    const transaction = TCUSD.setAdmin(recreationAddress);
    const estimateGas = await ethers.provider.estimateGas(transaction);
    console.log('Estimate gas is                : ', estimateGas.toString());

    // Call setAdmin function
    const tx = await transaction;
    const txHash = tx.hash;
    console.log('Transaction hash is            : ', txHash);

    const receipt = await tx.wait();
    const gasUsed = ethers.formatEther(BigInt(receipt.gasUsed) * BigInt(15e9));
    console.log('Gas used                       : ', gasUsed);
    console.log('Function setAdmin called successfully');
});
