const { ethers } = require("hardhat")

async function main() {

    [owner] = await hre.ethers.getSigners()

    const TestNFT = await ethers.getContractFactory("MovieTokens", owner)
    const testNFT = await TestNFT.deploy(1,"C:/Users/kkdee/Documents/movie-nft-token-project/token-metadata/")

    // Wait for the contract to be deployed
    await testNFT.deployed();

    // Log the contract address
    console.log("Contract deployed to address:", testNFT.address);
    process.env.CONTRACT_ADDRESS=testNFT.address;
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })