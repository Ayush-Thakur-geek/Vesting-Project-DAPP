let contractInstance = null
let organizationAddress = 0x0
let registration = document.getElementById("registration")
let s_holder = document.getElementById("addStakeHolder")

let main = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner()
    const contractAddress = "0xB7aA587680008542e9EB6ba6703745e0d7B3529f"
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
                    internalType: "struct Vesting.organization",
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
                    internalType: "struct Vesting.stakeHolder",
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
                    name: "_stakeHolderAddress",
                    type: "address",
                },
            ],
            name: "removeStakeHolder",
            outputs: [{ internalType: "address", name: "", type: "address" }],
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
    organizationAddress = await signer.getAddress()
    console.log(await provider.listAccounts())
}

let checkIfRegisteredOrNot = async () => {
    try {
        let result = await contractInstance.getOrganization(organizationAddress)
        console.log(result)
        registration.style.display = "none"
        s_holder.style.display = "block"
    } catch (error) {
        if (
            error.message.toLowerCase().includes("organization not registered")
        ) {
            console.log("Organization not registered")
            register_func()
        }
    }
}

let register_func = () => {
    let register_submit = document.getElementById("register_submit_btn")
    register_submit.addEventListener("click", async () => {
        let organization_name =
            document.getElementById("registration_name").value
        let t_address = document.getElementById(
            "registration_token_address",
        ).value
        try {
            await contractInstance.registerOrganization(
                organization_name,
                t_address,
            )
            console.log("Successfully registered")
            registration.style.display = "none"
            s_holder.style.display = "block"
        } catch (error) {
            console.log(error)
        }
    })
}

let add_s_holder = () => {
    let submit = document.getElementById("s_holder_submit_btn")
    submit.addEventListener("click", async () => {
        let type = document.getElementById("s_type").value
        let s_address = document.getElementById("s_address").value
        let period = document.getElementById("period").value
        let tokens = document.getElementById("tokens").value
        let whitelist = document.getElementById("whitelist").value
        try {
            await contractInstance.addStakeHolder(
                organizationAddress,
                type,
                s_address,
                period,
                tokens,
                whitelist.toLowerCase(),
            )
            console.log("Success")
        } catch (error) {
            console.log(error)
        }
    })
}

;(async () => {
    console.log("Calling main")
    await main()
    console.log("main finished")
    console.log("Calling checkIfRegisteredOrNot")
    await checkIfRegisteredOrNot()
    console.log("checkIfRegisteredOrNot finished")
})().catch(console.error)
add_s_holder()
