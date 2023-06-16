const { task } = require('hardhat/config');
const { readAddressList } = require('../scripts/helper');

task(
    '8.getWinnerMetrics',
    'Get winners metrics of Recreation contract'
).setAction(async (_, hre) => {
    // Get contract addresses from address.json
    const addressList = readAddressList();
    const recreationAddress = addressList[hre.network.name].Recreation;
    console.log('Recreation contract address is : ', recreationAddress);

    // Connect to contract Recreation
    const recreation = await hre.ethers.getContractAt(
        'Recreation',
        recreationAddress
    );

    // Get address array winners[]
    const winners = await recreation.getWinners();
    // Check if the winners array is not null
    if (winners && winners.length > 0) {
        console.log('Total number of winners        : ', winners.length);

        // Define an async function to fetch the win count for an address
        const getWinCount = async (address) => {
            return await recreation.getWinCount(address);
        };

        // Fetch all the getWinCount values for the winners
        const winCountsPromises = winners.map((address) =>
            getWinCount(address)
        );
        const winCounts = await Promise.all(winCountsPromises);

        // Combine the addresses and their win counts
        const addressWinCounts = winners.map((address, index) => ({
            address,
            winCount: winCounts[index],
        }));

        // Sort the results by win count in descending order
        addressWinCounts.sort(
            (a, b) => Number(b.winCount) - Number(a.winCount)
        );

        // Print the results
        addressWinCounts.forEach((entry) => {
            console.log(
                `Address: ${entry.address}, Win Count: ${entry.winCount}`
            );
        });
    } else {
        console.log('No winners found.');
    }
});
