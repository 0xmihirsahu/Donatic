
let web3;
const connectWalletButton = document.getElementById('connect-wallet');
const donationContractAddress = '0x0c4492aE1c52B9Df408489fF4a162ef9dBe6d8Df'; 
const donationContractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "domain",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "donor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "DonationReceived",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "domain",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "ngoAddress",
				"type": "address"
			}
		],
		"name": "NGORegistered",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "domainBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "domainDonationThreshold",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "domain",
				"type": "string"
			}
		],
		"name": "donate",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "domain",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "ngoAddress",
				"type": "address"
			}
		],
		"name": "registerNGO",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "registeredNGOAddresses",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "registeredNGOs",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]; 
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const sendButton = document.getElementById('sendButton');

connectWalletButton.addEventListener('click', connectWallet);

async function connectWallet() {
    const provider = await detectEthereumProvider();

    if (provider) {
    web3 = new Web3(provider);
    try {
        accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        multiSendContract = new web3.eth.Contract(multiSendAbi, multiSendAddress);
    } catch (error) {
        console.error('User rejected wallet connection:', error);
    }

    if (accounts && accounts.length > 0) {
        const userAddress = accounts[0].slice(0, 5) + '...' + accounts[0].slice(-5);
        const userAccount = accounts[0];
        connectWalletButton.innerText = `Connected: ${userAddress.toUpperCase()}`;

        const userAcc = document.getElementById('userAcc');
        userAcc.innerText = `Account: ${userAccount}`;
    }

    } else {
    console.error('No Ethereum provider detected');
    }

}

sendButton.addEventListener('click', async () => {
    try {
        const amount = amountInput.value;
        const category = categorySelect.value;
    
        if (isNaN(amount) || amount <= 0) {
            throw new Error('Invalid amount');
        }
  
        // Get the user's account
        const accounts = await web3.eth.getAccounts();
        const userAccount = accounts[0];
  
        // Initialize the contract
        const DonationContract = new web3.eth.Contract(DonationContractABI, DonationContractAddress);
  
        // Send the donation
        await DonationContract.methods.donate(category).send({
            from: userAccount,
            value: web3.utils.toWei(amount, 'ether'),
            gas: 300000 // Gas limit - this value may need to be adjusted for your specific contract
        });

        // If the transaction succeeds, clear the input field and show a success message
        amountInput.value = '';
        alert(`Donation of ${amount} ETH sent successfully to ${category}`);
    } catch(error) {
        // If the transaction fails, log the error and show an error message
        console.error(error);
        alert('Failed to send donation');
    }
});

