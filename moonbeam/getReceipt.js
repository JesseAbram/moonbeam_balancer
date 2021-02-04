const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider(process.env.ENDPOINT);

const getReceipt = async (hash) => {
    const receipt = await provider.waitForTransaction(hash)
    console.log({receipt})
    return receipt
};

module.exports = {
    getReceipt
}
