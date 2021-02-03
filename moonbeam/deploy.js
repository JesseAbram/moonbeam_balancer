require('dotenv').config()
const ethers = require('ethers');
const data = require('../build/contracts/BFactory.json').bytecode
const factoryAbi = require('../build/contracts/BFactory.json').abi

const tokenData = require('../build/contracts/MockToken.json').bytecode

const {getReceipt} = require('./getReceipt')

// Variables definition
const privKey =process.env.PRIVATE_KEY;
const provider = new ethers.providers.JsonRpcProvider(process.env.ENDPOINT);
const wallet = new ethers.Wallet(privKey, provider);

// Create transaction
const deploy = async () => {
   console.log(
      `Attempting to deploy`
   );

   const tx = await wallet.sendTransaction(
      {
         gasLimit: ethers.BigNumber.from('5100000'),
         data,
      },
      
   );
   // Deploy transaction
   // const tx = await web3.eth.sendSignedTransaction(
   //    createTransaction.rawTransaction
   // );
   console.log(
      `Transaction successful with hash: ${tx.hash}`
   );
   const receipt = await getReceipt(tx.hash)
   console.log({receipt})
   const factortAddress = receipt.contractAddress
   const factory = new ethers.Contract(factortAddress, factoryAbi, provider)
   const factoryInstance = factory.connect(wallet)
   
   const test = await factoryInstance.getBLabs()
   console.log(test)
   // console.log(
   //    `factory address: ${receipt.contractAddress}`
   // );

   // console.log(
   //    `Attempting to deploy`
   // );

   // const createTransaction2 = await web3.eth.accounts.signTransaction(
   //    {
   //       gas: '5100000',
   //       gasPrice: "0",
   //       tokenData
   //    },
   //    privKey
   // );

   // // Deploy transaction
   // const tx2 = await web3.eth.sendSignedTransaction(
   //    createTransaction2.rawTransaction
   // );
   // console.log(
   //    `Transaction successful with hash: ${tx2.transactionHash}`
   // );
   // const receipt2 = await getReceipt(tx2.transactionHash)
   // console.log({receipt2})

   // console.log(
   //    `token1 address: ${receipt2.contractAddress}`
   // );


   // const createTransaction3 = await web3.eth.accounts.signTransaction(
   //    {
   //       gas: '5100000',
   //       gasPrice: "0",
   //       tokenData
   //    },
   //    privKey
   // );
   // // Deploy transaction
   // const tx3 = await web3.eth.sendSignedTransaction(
   //    createTransaction3.rawTransaction
   // );
   // console.log(
   //    `Transaction successful with hash: ${tx3.transactionHash}`
   // );
   // const receipt3 = await getReceipt(tx3.transactionHash)
   // console.log({receipt3})

   // console.log(
   //    `token2 address: ${receipt3.contractAddress}`
   // );
};

deploy();