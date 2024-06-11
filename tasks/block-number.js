const {task} = require("hardhat/config")

task("block-number", "Prints the current block number").setAction(
    async (taskArgs, hre) => {
        await hre.ethers.provider.getBlockNumber()
        .then((getBlockNumber) => console.log(`Current block number: ${getBlockNumber}`))
    }
)

module.exports = {}