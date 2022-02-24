import abi from './Domains.json';

/*
	Contract variables needed to communicating, and interacting with the contract
*/
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = abi.abi;


const config = {
	contractAddress,
	contractABI,
}

export default config;