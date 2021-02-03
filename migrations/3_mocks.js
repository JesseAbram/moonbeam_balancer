const MockToken = artifacts.require('MockToken');

module.exports = async function (deployer) {
    await deployer.deploy(MockToken, "test", "one");
    await deployer.deploy(MockToken, "test2", "two");
};
