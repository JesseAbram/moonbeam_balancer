const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider(process.env.ENDPOINT);

const getReceipt = async (hash) => {
    const receipt = await provider.waitForTransaction(hash)
    return receipt
};

module.exports = {
    getReceipt
}
