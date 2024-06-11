const { ethers, run, network } = require("hardhat")

async function main() {
    const vestingFactory = await ethers.getContractFactory("Vesting")
    console.log("Deploying Contract...")
    const vesting = await vestingFactory.deploy()
    await vesting.waitForDeployment()
    console.log("Contract deployed to:", vesting.target)
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block confirmations...")
        await vesting.deploymentTransaction().wait(6)
        await verify(vesting.target, [])
    }
}

async function verify(contractAddress, args) {
    console.log("Verifying Contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (error) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Contract already verified")
        } else {
            console.log("Error verifying contract:", error)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch(() => {
        console.log("error")
        process.exit(1)
    })
