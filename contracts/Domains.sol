//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

// Don't forget to add this import
import { StringUtils } from "./libraries/StringUtils.sol";
import "hardhat/console.sol";

contract Domains {

	// Here's our domain TLD!
	string public tld;
	
	/*
		a map/hash table data type for storing the domain names
	*/
	mapping(string => address) public domains;

	/*
		a map data type that stores the record of the domains
	*/
	mapping(string => string) public records;

	constructor(string memory _tld) payable {
		tld = _tld;
		console.log("%s name service deployed", _tld);
	}

	/*
		This functions gives us the pice of a domain name, based
		on the amount of characters
	*/
	function priceOfDomain(string calldata _newDomainName) public pure returns (uint) {
		uint len = StringUtils.strlen(_newDomainName);
		require(len > 0);
		if (len == 3) {
			return 5 * 10**17; // 5 MATIC = 5 000 000 000 000 000 000 (18 decimals). We're going with 0.5 Matic cause the faucets don't give a lot
		} else if (len == 4) {
			return 3 * 10**17; // 0.3 MATIC
		} else {
			return 1 * 10**17; // 0.1 MATIC
		}
	}

	/*
		A register function for registering a domain, to our mapping domains.
		Calldata is non-persistent and can’t be modified. We like this because 
		it takes the least amount of gas!
	*/
	function register(string calldata _newDomainName) public payable{
		// Check that the name is unregistered
		require(domains[_newDomainName] == address(0));

		uint _price = priceOfDomain(_newDomainName);

		require(msg.value >= _price, "Not enough matic paid");
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
