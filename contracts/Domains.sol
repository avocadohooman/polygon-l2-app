//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "hardhat/console.sol";

contract Domains {

	/*
		a map/hash table data type for storing the domain names
	*/
	mapping(string => address) public domains;

	/*
		a map data type that stores the record of the domains
	*/
	mapping(string => string) public records;

	constructor() {
		console.log('This is my domain contract');
	}

	/*
		A register function for registering a domain, to our mapping domains.
		Calldata is non-persistent and can’t be modified. We like this because 
		it takes the least amount of gas!
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

	/*
		storing a new record and checking if the caller of this function,
		is the owner of the requested domain
	*/
	function setRecord(string calldata _domainName, string calldata _newRecord) public {
		require(domains[_domainName] == msg.sender);
		records[_domainName] = _newRecord;
	}

	function getRecord(string calldata _requestedRecord) public view returns (string memory) {
		return records[_requestedRecord];
	}
}
