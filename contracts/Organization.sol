// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.24;

contract Vesting {
    struct organization {
        string name;
        address token;
        address owner;
    }

    struct stakeHolder {
        string stakeHolderType;
        address stakeHolderAddress;
        uint vestingPeriod;
        uint tokens;
        bool whitelisted;
    }

    mapping(address => organization) public organizations;
    mapping(address => stakeHolder[]) public stakeHolders;

    function registerOrganization(string memory _name, address _token) public {
        organizations[msg.sender] = organization(_name, _token, msg.sender);
    }

    function addStakeHolder(
        address _organizationAddress,
        string memory _stakeHolderType,
        address _stakeHolderAddress,
        uint _vestingPeriod,
        uint _tokens,
        bool _whitelisted
    ) public {
        require(
            msg.sender == organizations[msg.sender].owner,
            "Only organization can add stakeholder"
        );
        stakeHolders[_organizationAddress].push(
            stakeHolder(
                _stakeHolderType,
                _stakeHolderAddress,
                _vestingPeriod,
                _tokens,
                _whitelisted
            )
        );
    }

    function removeStakeHolder(
        address _stakeHolderAddress
    ) public returns (address) {
        require(
            msg.sender == organizations[msg.sender].owner,
            "Only organization can remove stakeholder"
        );
        delete stakeHolders[_stakeHolderAddress];
        return _stakeHolderAddress;
    }

    function getStakeHolder(
        address _organizationAddress,
        address _stakeHolderAddress
    ) public view returns (stakeHolder memory) {
        for (uint i = 0; i < stakeHolders[_organizationAddress].length; i++) {
            if (
                stakeHolders[_organizationAddress][i].stakeHolderAddress ==
                _stakeHolderAddress
            ) {
                return stakeHolders[_organizationAddress][i];
            }
        }
        revert("No stake holder of the mentioned address present.");
    }

    function getOrganization(
        address _organizationAddress
    ) public view returns (organization memory) {
        require(
            organizations[_organizationAddress].owner !=
                0x0000000000000000000000000000000000000000,
            "Organization not registered"
        );
        return organizations[_organizationAddress];
    }

    function claimTokens(
        address _organizationAddress,
        address _stakeHolderAddress
    ) public {
        bool isStakeHolder = false;
        for (uint i = 0; i < stakeHolders[_organizationAddress].length; i++) {
            if (
                stakeHolders[_organizationAddress][i].stakeHolderAddress ==
                _stakeHolderAddress
            ) {
                require(
                    stakeHolders[_organizationAddress][i].stakeHolderAddress ==
                        msg.sender,
                    "Only stakeholder can claim tokens"
                );
                require(
                    stakeHolders[_organizationAddress][i].whitelisted == true,
                    "Stake Holder not whitelisted"
                );
                require(
                    stakeHolders[_organizationAddress][i].vestingPeriod <
                        block.number,
                    "Vesting period isn't over"
                );
                isStakeHolder = true;
                stakeHolders[_organizationAddress][i].tokens = 0;
                stakeHolders[_organizationAddress][i].vestingPeriod = 0;
                stakeHolder memory temp = stakeHolders[_organizationAddress][i];
                stakeHolders[_organizationAddress][i] = stakeHolders[
                    _organizationAddress
                ][stakeHolders[_organizationAddress].length - 1];
                stakeHolders[_organizationAddress][
                    stakeHolders[_organizationAddress].length - 1
                ] = temp;
                stakeHolders[_organizationAddress].pop();
                break;
            }
        }
        if (!isStakeHolder) {
            revert("Stakeholder not found");
        }
    }
}
