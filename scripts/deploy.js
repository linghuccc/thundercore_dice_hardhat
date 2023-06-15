const { readAddressList, storeAddressList } = require('./helper');

async function main() {
    // Get deployer wallet address and balance
    const [deployer] = await ethers.getSigners();
    const deployerAddress = deployer.address;
    console.log('Deployer account address       : ', deployerAddress);

    const balance = await ethers.provider.getBalance(deployerAddress);
    const formattedBalance = ethers.formatEther(balance);
    console.log('Deployer account balance       : ', formattedBalance);
    console.log(
        '================================================================================'
    );

    const token = await ethers.deployContract('TCUSD', [
        'ThunderCore USD Token',
        'TCUSD',
    ]);
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log('TCUSD contract address         : ', tokenAddress);

    const recreaton = await ethers.deployContract('Recreation', [tokenAddress]);
    await recreaton.waitForDeployment();
    const recreationAddress = await recreaton.getAddress();
    console.log('Recreation contract address    : ', recreationAddress);
    console.log(
        '================================================================================'
    );

    // 将地址存入address.json
    const addressList = readAddressList();
    addressList[network.name].TCUSD = tokenAddress;
    addressList[network.name].Recreation = recreationAddress;
    storeAddressList(addressList);

    // 验证合约
    // console.log('Waiting for block confirmations...');
    // await recreaton.deployTransaction.wait(6);
    await verify(tokenAddress, ['ThunderCore USD Token', 'TCUSD']);
    console.log(
        '================================================================================'
    );
    await verify(recreationAddress, [tokenAddress]);
    console.log(
        '================================================================================'
    );
}

// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
    console.log('Verifying contract...');
    try {
        await run('verify:verify', {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (
            e.message
                .toLowerCase()
                .includes('already verified' || 'already been verified')
        ) {
            console.log('Already Verified!');
        } else {
            console.log(e);
        }
    }
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
