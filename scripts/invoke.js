const {Web3} = require('web3');
const fs = require("fs");
require('dotenv').config();


// Create a Web3 instance
const web3 = new Web3('http://localhost:8545'); 

// ABI (Application Binary Interface) of the contract
const { abi } = JSON.parse(fs.readFileSync("./artifacts/contracts/MovieTokens.sol/MovieTokens.json"));

// Address of the deployed contract
const contractAddress = process.env.CONTRACT_ADDRESS; 
console.log(contractAddress);

// Connect to the contract
const contract = new web3.eth.Contract(abi, contractAddress);

// Private key of the account
const privateKey = process.env.PRIVATE_KEY;


async function callContractMethod() {
    const accounts = await web3.eth.getAccounts();
    const default_account = accounts[0];

    console.log("Owner and user1",default_account,accounts[1]);

    try {
        const nonce = await web3.eth.getTransactionCount(default_account);
        const gasPrice = await web3.eth.getGasPrice();
        const gasLimit = 3000000;

        const txObject = {
            from: default_account,
            to: contractAddress,
            data: contract.methods.mintMovieTokens().encodeABI(),
            nonce: nonce,
            gasPrice: gasPrice,
            gasLimit: gasLimit,
        };
        const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);
        const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        
        console.log('Transaction receipt:', txReceipt);

        const nonce1 = await web3.eth.getTransactionCount(default_account);
        const gasPrice1 = await web3.eth.getGasPrice();
        const gasLimit1 = 3000000;

        const txObject1 = {
            from: default_account,
            to: contractAddress,
            data: contract.methods.transferTicketNFT(accounts[1]).encodeABI(),
            nonce: nonce1,
            gasPrice: gasPrice1,
            gasLimit: gasLimit1,
        };

        const signedTx1 = await web3.eth.accounts.signTransaction(txObject1, privateKey);
        const txReceipt1 = await web3.eth.sendSignedTransaction(signedTx1.rawTransaction);
        
        console.log('Transaction receipt:', txReceipt1);


        // Capture events emitted from the contract
        const events = contract.events.successfulTicketTransfer({
            fromBlock: txReceipt1.blockNumber,
            toBlock: 'latest'
        });
        events.on('data', function(event) {
            console.log('Event captured:', event);
        });
        events.on('error', function(error) {
            console.error('Error capturing event:', error);
        });
    } catch (error) {
        console.error('Error calling method:', error);
    }
}

callContractMethod();
