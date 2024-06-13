let contractInstance = 0
let verify_page = document.getElementById("verify")
let claim_page = document.getElementById("claim_page")
let claim_btn = document.getElementById("claim_btn")
let stakeHolderAddress = 0x0

let main = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner()
    const contractAddress = "0x77F449057ff9f81c7B17Ea0B33d4ffCc5B8F8071"
    const contractAbi = [
        {
            inputs: [
                {
                    internalType: "address",
                    name: "_organizationAddress",
                    type: "address",
                },
                {
                    internalType: "string",
                    name: "_stakeHolderType",
                    type: "string",
                },
                {
                    internalType: "address",
                    name: "_stakeHolderAddress",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "_vestingPeriod",
                    type: "uint256",
                },
                { internalType: "uint256", name: "_tokens", type: "uint256" },
                { internalType: "bool", name: "_whitelisted", type: "bool" },
            ],
            name: "addStakeHolder",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "_organizationAddress",
                    type: "address",
                },
                {
                    internalType: "address",
                    name: "_stakeHolderAddress",
                    type: "address",
                },
            ],
            name: "claimTokens",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "_organizationAddress",
                    type: "address",
                },
            ],
            name: "getOrganization",
            outputs: [
                {
                    components: [
                        {
                            internalType: "string",
                            name: "name",
                            type: "string",
                        },
                        {
                            internalType: "address",
                            name: "token",
                            type: "address",
                        },
                        {
                            internalType: "address",
                            name: "owner",
                            type: "address",
                        },
                    ],
                    internalType: "struct Vesting.Organization",
                    name: "",
                    type: "tuple",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "_organizationAddress",
                    type: "address",
                },
                {
                    internalType: "address",
                    name: "_stakeHolderAddress",
                    type: "address",
                },
            ],
            name: "getStakeHolder",
            outputs: [
                {
                    components: [
                        {
                            internalType: "string",
                            name: "stakeHolderType",
                            type: "string",
                        },
                        {
                            internalType: "address",
                            name: "stakeHolderAddress",
                            type: "address",
                        },
                        {
                            internalType: "uint256",
                            name: "vestingPeriod",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "tokens",
                            type: "uint256",
                        },
                        {
                            internalType: "bool",
                            name: "whitelisted",
                            type: "bool",
                        },
                    ],
                    internalType: "struct Vesting.StakeHolder",
                    name: "",
                    type: "tuple",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [{ internalType: "address", name: "", type: "address" }],
            name: "organizations",
            outputs: [
                { internalType: "string", name: "name", type: "string" },
                { internalType: "address", name: "token", type: "address" },
                { internalType: "address", name: "owner", type: "address" },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                { internalType: "string", name: "_name", type: "string" },
                { internalType: "address", name: "_token", type: "address" },
            ],
            name: "registerOrganization",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "_organizationAddress",
                    type: "address",
                },
                {
                    internalType: "address",
                    name: "_stakeHolderAddress",
                    type: "address",
                },
            ],
            name: "removeStakeHolder",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                { internalType: "address", name: "", type: "address" },
                { internalType: "uint256", name: "", type: "uint256" },
            ],
            name: "stakeHolders",
            outputs: [
                {
                    internalType: "string",
                    name: "stakeHolderType",
                    type: "string",
                },
                {
                    internalType: "address",
                    name: "stakeHolderAddress",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "vestingPeriod",
                    type: "uint256",
                },
                { internalType: "uint256", name: "tokens", type: "uint256" },
                { internalType: "bool", name: "whitelisted", type: "bool" },
            ],
            stateMutability: "view",
            type: "function",
        },
    ]
    contractInstance = await new ethers.Contract(
        contractAddress,
        contractAbi,
        signer,
    )
    stakeHolderAddress = await signer.getAddress()
    console.log(await provider.listAccounts())
}
document.getElementById("verify_btn").addEventListener("click", async () => {
    const organizationAddress =
        document.querySelector("#verify .in input").value

    const claim_msg1 = document.getElementById("claim_msg1")
    const claim_msg2 = document.getElementById("claim_msg2")
    const claim_msg3 = document.getElementById("claim_msg3")
    const claim_msg4 = document.getElementById("claim_msg4")
    const verify_msg1 = document.getElementById("verify_msg1")
    const verify_msg2 = document.getElementById("verify_msg2")
    try {
        await contractInstance.getOrganization(organizationAddress)
        verify_msg1.style.transition = "ease 0.5s"
        verify_msg1.style.top = "0"
        setTimeout(() => {
            verify_msg1.style.top = "-100%"
        }, 3000)
        setTimeout(() => {
            verify_page.style.display = "none"
            claim_page.style.display = "block"
        }, 3500)
    } catch (error) {
        console.log(error.message)
        verify_msg2.style.position = "relative"
        verify_msg2.style.transition = "ease 0.5s"
        verify_msg2.style.top = "0"
        setTimeout(() => {
            verify_msg2.style.top = "-100%"
        }, 3000)
    }
    claim_btn.addEventListener("click", async () => {
        try {
            await contractInstance.claimTokens(
                organizationAddress,
                stakeHolderAddress,
            )
            claim_msg1.style.transition = "ease 0.5s"
            claim_msg1.style.top = "0"
            setInterval(() => {
                claim_msg1.style.top = "-100%"
            }, 3000)
        } catch (error) {
            if (
                error.message
                    .toLowerCase()
                    .includes("only stakeholder can claim tokens")
            ) {
                claim_msg4.style.transition = "ease 0.5s"
                claim_msg4.style.top = "0"
                setInterval(() => {
                    claim_msg4.style.top = "-100%"
                }, 3000)
            } else if (
                error.message
                    .toLowerCase()
                    .includes("stakeholder not whitelisted")
            ) {
                claim_msg3.style.transition = "ease 0.5s"
                claim_msg3.style.top = "0"
                setInterval(() => {
                    claim_msg3.style.top = "-100%"
                }, 3000)
            } else if (
                error.message
                    .toLowerCase()
                    .includes("vesting period isn't over")
            ) {
                claim_msg2.style.transition = "ease 0.5s"
                claim_msg2.style.top = "0"
                setInterval(() => {
                    claim_msg2.style.top = "-100%"
                }, 3000)
            } else {
                console.log(error)
            }
        }
    })
})

main()
