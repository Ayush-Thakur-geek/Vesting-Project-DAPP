// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.24;

contract Vesting {
    struct Organization {
        string name;
        address token;
        address owner;
    }

    struct StakeHolder {
        string stakeHolderType;
        address stakeHolderAddress;
        uint vestingPeriod;
        uint tokens;
        bool whitelisted;
    }

    mapping(address => Organization) public organizations;
    mapping(address => StakeHolder[]) public stakeHolders;

    modifier onlyOrganizationOwner(address _organizationAddress) {
        require(
            msg.sender == organizations[_organizationAddress].owner,
            "Only organization owner can call this function"
        );
        _;
    }

    function registerOrganization(string memory _name, address _token) public {
        require(
            organizations[msg.sender].owner == address(0),
            "Organization already registered"
        );
        organizations[msg.sender] = Organization(_name, _token, msg.sender);
    }

    function addStakeHolder(
        address _organizationAddress,
        string memory _stakeHolderType,
        address _stakeHolderAddress,
        uint _vestingPeriod,
        uint _tokens,
        bool _whitelisted
    ) public onlyOrganizationOwner(_organizationAddress) {
        StakeHolder memory newStakeHolder = StakeHolder({
            stakeHolderType: _stakeHolderType,
            stakeHolderAddress: _stakeHolderAddress,
            vestingPeriod: _vestingPeriod,
            tokens: _tokens,
            whitelisted: _whitelisted
        });
        stakeHolders[_organizationAddress].push(newStakeHolder);
    }

    function removeStakeHolder(
        address _organizationAddress,
        address _stakeHolderAddress
    ) public onlyOrganizationOwner(_organizationAddress) {
        uint index;
        bool found = false;

        for (uint i = 0; i < stakeHolders[_organizationAddress].length; i++) {
            if (
                stakeHolders[_organizationAddress][i].stakeHolderAddress ==
                _stakeHolderAddress
            ) {
                index = i;
                found = true;
                break;
            }
        }

        require(found, "Stakeholder not found");

        // Move the last element to the position to delete and pop the array
        stakeHolders[_organizationAddress][index] = stakeHolders[
            _organizationAddress
        ][stakeHolders[_organizationAddress].length - 1];
        stakeHolders[_organizationAddress].pop();
    }

    function getStakeHolder(
        address _organizationAddress,
        address _stakeHolderAddress
    ) public view returns (StakeHolder memory) {
        for (uint i = 0; i < stakeHolders[_organizationAddress].length; i++) {
            if (
                stakeHolders[_organizationAddress][i].stakeHolderAddress ==
                _stakeHolderAddress
            ) {
                return stakeHolders[_organizationAddress][i];
            }
        }
        revert("Stakeholder not found");
    }

    function getOrganization(
        address _organizationAddress
    ) public view returns (Organization memory) {
        require(
            organizations[_organizationAddress].owner != address(0),
            "Organization not registered"
        );
        return organizations[_organizationAddress];
    }

    function claimTokens(
        address _organizationAddress,
        address _stakeHolderAddress
    ) public {
        uint index;
        bool found = false;

        for (uint i = 0; i < stakeHolders[_organizationAddress].length; i++) {
            if (
                stakeHolders[_organizationAddress][i].stakeHolderAddress ==
                _stakeHolderAddress
            ) {
                index = i;
                found = true;
                break;
            }
        }

        require(found, "Stakeholder not found");
        StakeHolder storage stakeHolder = stakeHolders[_organizationAddress][
            index
        ];

        require(
            stakeHolder.stakeHolderAddress == msg.sender,
            "Only stakeholder can claim tokens"
        );
        require(stakeHolder.whitelisted, "Stakeholder not whitelisted");
        require(
            stakeHolder.vestingPeriod < block.number,
            "Vesting period not over"
        );

        // Reset stakeholder data
        stakeHolder.tokens = 0;
        stakeHolder.vestingPeriod = 0;

        // Remove the stakeholder by moving the last element to this position and popping the array
        stakeHolders[_organizationAddress][index] = stakeHolders[
            _organizationAddress
        ][stakeHolders[_organizationAddress].length - 1];
        stakeHolders[_organizationAddress].pop();
    }
}
