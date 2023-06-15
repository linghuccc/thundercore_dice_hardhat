const { task } = require('hardhat/config');
const { readAddressList } = require('../scripts/helper');

task('0.test', 'Test').setAction(async (_, hre) => {
    // Get the current signer's address and balance
    const signer = await hre.ethers.provider.getSigner();
    const signerAddress = await signer.getAddress();
    console.log('Signer address is              : ', signerAddress);

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
    const tx = await transaction;
    const txHash = tx.hash;
    console.log('Transaction hash is            : ', txHash);

    // const receipt = await tx.wait();
    // const events = receipt.events;
    // console.log('Transaction events are         : ', events);        // undefined

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
});
