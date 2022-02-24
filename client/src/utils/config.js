import abi from './Domains.json';

/*
	Contract variables needed to communicating, and interacting with the contract
*/
const contractAddress = '0x03875d57164d473592AFDbd24DD48552F8dC3E30';
const contractABI = abi.abi;

console.log('contractAddress', contractAddress);

const config = {
	contractAddress,
	contractABI,
}

export default config;