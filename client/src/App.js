import React, { useEffect, useState } from 'react';
import './styles/App.css';
import config from './utils/config';
import { ethers } from 'ethers';

// Constants
const tld = ".avocado";

const App = () => {

	//Just a state variable we use to store our user's public wallet. Don't forget to import useState at the top.
	const [currentAccount, setCurrentAccount] = useState('');
	// Add some state data propertie
	const [domain, setDomain] = useState('');
  	const [record, setRecord] = useState('');

	// Implement your connectWallet method here
	const connectWallet = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				alert("Get MetaMask -> https://metamask.io/");
				return;
			}

			// Fancy method to request access to account.
			const accounts = await ethereum.request({ method: "eth_requestAccounts" });
		
			// Boom! This should print out public address once we authorize Metamask.
			console.log("Connected", accounts[0]);
			setCurrentAccount(accounts[0]);
		} catch (error) {
			console.log(error)
		}
	}

	const checkIfWalletIsConnected = async () => {
		const { ethereum } = window;

		if (!ethereum) {
			console.log('Make sure you have metamask!');
			return;
		} else {
			console.log('We have the ethereum object', ethereum);
		}

		// Check if we're authorized to access the user's wallet
		const accounts = await ethereum.request({ method: 'eth_accounts' });

		// Users can have multiple authorized accounts, we grab the first one if its there!
		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log('Found an authorized account:', account);
			setCurrentAccount(account);
		} else {
			console.log('No authorized account found');
		}
	};

	// Create a function to render if wallet is not connected yet
	const renderNotConnectedContainer = () => (
		<div className="connect-wallet-container">
			<img src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif" alt="Ninja gif" />
			{/* Call the connectWallet function we just wrote when the button is clicked */}
			<button onClick={connectWallet} className="cta-button connect-wallet-button">
				Connect Wallet
			</button>
		</div>
	);

	const renderInputForm = () => {
		return (
			<div className="form-container">
				<div className='first-row'>
					<input 
						type="text"
						value={domain}
						placeholder='domain'
						onChange={(e) => setDomain(e.target.value)}
					/>
					<p className='tld'> {tld} </p>
				</div>
				<input
					type="text"
					value={record}
					placeholder='whats your avocado power'
					onChange={e => setRecord(e.target.value)}
				/>

				<div className="button-container">
					<button className='cta-button mint-button' disabled={null} onClick={mintDomain}>
						Mint
					</button>  
					<button className='cta-button mint-button' disabled={null} onClick={null}>
						Set data
					</button>  
				</div>
			</div>
		)
	}

	const mintDomain = async () => {
		if (!domain) { return }

		if (domain.length < 3) {
			alert('Domain must be at least 3 characters long');
			return ;
		}

		// Calculate price based on length of domain (change this to match your contract)	
		// 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
		const price = domain.length ===  3 ? '0.5' : domain.length === 4 ? '0.3' : '0.1';
		console.log("Minting domain", domain, "with price", price);
		try {
			const { ethereum } = window;
			if (ethereum) {
			  const provider = new ethers.providers.Web3Provider(ethereum);
			  const signer = provider.getSigner();
			  const contract = new ethers.Contract(config.contractAddress, config.contractABI, signer);
		
					console.log("Going to pop wallet now to pay gas...")
			  let tx = await contract.register(domain, {value: ethers.utils.parseEther(price)});
			  // Wait for the transaction to be mined
					const receipt = await tx.wait();
		
					// Check if the transaction was successfully completed
					if (receipt.status === 1) {
						console.log("Domain minted! https://mumbai.polygonscan.com/tx/"+tx.hash);
						
						// Set the record for the domain
						tx = contract.setRecord(domain, record);
						await tx.wait();
		
						console.log("Record set! https://mumbai.polygonscan.com/tx/"+tx.hash);
						
						setRecord('');
						setDomain('');
					}
					else {
						alert("Transaction failed! Please try again");
					}
			}
		  }
		catch (error) {
			console.log(error);
	}
}

	// This runs our function when the page loads.
	useEffect(() => {
		checkIfWalletIsConnected();
	}, [])

	return (
			<div className="App">
				<div className="container">

					<div className="header-container">
						<header>
							<div className="left">
								<p className="title">🐱‍👤 Avocado Name Service</p>
								<p className="subtitle">Your immortal API on the blockchain!</p>
							</div>
						</header>
					</div>

					{/* Hide the connect button if currentAccount isn't empty*/}
					{!currentAccount && renderNotConnectedContainer()}
					{/* Render the input form if an account is connected */}
					{currentAccount && renderInputForm()}

					<div className='footer-container'></div>
				</div>
			</div>
	);
}

export default App;
