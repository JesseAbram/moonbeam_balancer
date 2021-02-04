require("dotenv").config();
const ethers = require("ethers");
const data = require("../build/contracts/BFactory.json").bytecode;
const factoryAbi = require("../build/contracts/BFactory.json").abi;
const exchangeAbi = require("../build/contracts/BPool.json").abi;

const tokenData = require("../build/contracts/MockToken.json").bytecode;
const tokenAbi = require("../build/contracts/MockToken.json").abi;

const { getReceipt } = require("./getReceipt");

// Variables definition
const privKey = process.env.PRIVATE_KEY;
const provider = new ethers.providers.JsonRpcProvider(process.env.ENDPOINT);
const wallet = new ethers.Wallet(privKey, provider);

// Create transaction
const deploy = async () => {
  console.log(`Attempting to deploy factory`);

  const tx = await wallet.sendTransaction({
    gasLimit: ethers.BigNumber.from("10000000"),
    data,
  });

  console.log(`Transaction successful with hash: ${tx.hash}`);
  const receipt = await getReceipt(tx.hash);
  console.log(receipt.gasUsed.toString());

  const factoryAddress = receipt.contractAddress;
  const factory = new ethers.Contract(factoryAddress, factoryAbi, provider);
  const factoryInstance = factory.connect(wallet);

  const test = await factoryInstance.getBLabs();
  console.log(test);

  console.log(`Attempting to deploy token1`);

  const tx2 = await wallet.sendTransaction({
    gasLimit: ethers.BigNumber.from("10000000"),
    data: tokenData,
  });

  console.log(`Transaction successful with hash: ${tx2.hash}`);
  const receipt2 = await getReceipt(tx2.hash);
  const token1Address = receipt2.contractAddress;
  console.log(token1Address);

  console.log(`Attempting to deploy token2`);

  const tx3 = await wallet.sendTransaction({
    gasLimit: ethers.BigNumber.from("10000000"),
    data: tokenData,
  });

  console.log(`Transaction successful with hash: ${tx3.hash}`);
  const receipt3 = await getReceipt(tx3.hash);
  const token2Address = receipt3.contractAddress;
  console.log(token2Address);

  const tx4 = await factoryInstance.newBPool({
    gasLimit: ethers.BigNumber.from("10000000"),
  });

  const tx5 = await wallet.sendTransaction({
    gasLimit: ethers.BigNumber.from("10000000"),
    data: tokenData,
  });
  console.log(`Transaction successful with hash: ${tx5.hash}`);
  const receipt5 = await getReceipt(tx5.hash);
  const proxyAddress = receipt5.contractAddress;

  const receipt4 = await getReceipt(tx4.hash);
  const exchangeAddress = receipt4.logs[1].address;

  const token1 = new ethers.Contract(token1Address, tokenAbi, provider);
  const token1Instance = token1.connect(wallet);
  const token2 = new ethers.Contract(token2Address, tokenAbi, provider);
  const token2Instance = token2.connect(wallet);
  const toMint = "1000000000000000000000";
  const denorm = "1000000000000000000";
  await token1Instance.mint(wallet.address, toMint);
  await token1Instance.mint(wallet.address, toMint);
  await token2Instance.mint(wallet.address, toMint);
  await token1Instance.approve(exchangeAddress, toMint);
  const txLast = await token2Instance.approve(exchangeAddress, toMint);
  await getReceipt(txLast.hash);

  const exchange = new ethers.Contract(exchangeAddress, exchangeAbi, provider);
  const exchangeInstance = exchange.connect(wallet);

  await exchangeInstance.bind(token1.address, toMint, denorm, {
    gasLimit: ethers.BigNumber.from("10000000"),
  });
  const final = await exchangeInstance.bind(token2.address, toMint, denorm, {
    gasLimit: ethers.BigNumber.from("10000000"),
  });
  await getReceipt(final.hash);

  const tokensNum = await exchangeInstance.getNumTokens();
  console.log("token num", tokensNum.toString());

  console.log("addresses of interest", {
    exchangeAddress,
    token1Address,
    token2Address,
    factoryAddress,
    proxyAddress,
  });
};

deploy();
