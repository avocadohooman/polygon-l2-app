//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "hardhat/console.sol";

contract Domains {

	/*
		a map/hash table data type for storing the domain names
	*/
	mapping(string => address) public domains;

	constructor() {
		console.log('This is my domain contract');
	}

	/*
		A register function for registering a domain, to our mapping domains
	*/
	function register(string calldata _newDomainName) public {
		domains[_newDomainName] = msg.sender;
		console.log("%s has registered a domain!", msg.sender);
	}

	/*
		This function will return the owner of a domain
	*/
	function getDomainOwnerAddress(string calldata _domainName) public view returns (address) {
		return domains[_domainName];
	}
}
