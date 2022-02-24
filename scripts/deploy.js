const main = async () => {
	const domainContractFactory = await hre.ethers.getContractFactory('Domains');
	const domainContract = await domainContractFactory.deploy("avocado");
	await domainContract.deployed();
	console.log('Deployed contract to:', domainContract.address);
	console.log('Deployed by:', owner.address);

	let txn = await domainContract.register("coding",  {value: hre.ethers.utils.parseEther('0.1')});
	await txn.wait();
	console.log("Minted domain coding.avocado");

	txn = await domainContract.setRecord('coding', 'I am a coding avocado!');
	await txn.wait();
	console.log('Set record for coding.avocado');

	const domainOwner = await domainContract.getDomainOwnerAddress("coding");
	console.log("Owner of domain:", domainOwner);

	const balance = await hre.ethers.provider.getBalance(domainContract.address);
	console.log("Contract balance:", hre.ethers.utils.formatEther(balance));  
}

const runMain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
}

runMain();