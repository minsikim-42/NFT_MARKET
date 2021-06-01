
import logo from './logo.svg';
import QRCode from "qrcode.react";
import Caver from "caver-js";
import './App.css';
import { privateKey } from 'caver-js/packages/caver-wallet/src/keyring/keyringFactory';
import React, { useState } from 'react';
import * as KlipAPI from "./UseKlip";

// const MY_CONTRACT_ADDRESS = '0x84370bc1457Aed3D8685727D0C27cba58526AAd3';
const MY_CONTRACT_ADDRESS = '0x914Bdb3E825B573b51cE05DD3d19353e330d8F7F'; //MAIN
const ACCESS_KEY_ID = 'KASKQYZFY34O2ZIP1A9491D6';
const SECRET_ACCESS_KEY = '9/Lw/c8uNNJ3HTp0oEpJy2ZRt74qUVYPmCUk568Q';
// const CHAIN_ID = '1001'; // baobab
const CHAIN_ID = '8217'; // main net

const CONTRACT_ABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "set_Id",
				"type": "uint256"
			},
			{
				"name": "set_owner",
				"type": "address"
			},
			{
				"name": "set_URI",
				"type": "string"
			}
		],
		"name": "mint_token",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "from",
				"type": "address"
			},
			{
				"name": "to",
				"type": "address"
			},
			{
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"name": "_data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "setting",
				"type": "uint256"
			}
		],
		"name": "setkms",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "kms",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "kmsowner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ownedTokens",
		"outputs": [
			{
				"name": "",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

const option = {
	headers: [
		// "x-chain-id: 1001", // 1번째 시도
		// "Authorization: Basic S0FTS1FZWkZZMzRPMlpJUDFBOTQ5MUQ2OjkvTHcvYzh1Tk5KM0hUcDBvRXBKeTJaUnQ3NHFVVllQbUNVazU2OFE="

		// {ACCESS_KEY_ID:SECRET_ACCESS_KEY // 2번째 시도

		{ // 보고 따라한 것
			name: "Authorization",
			value: "Basic " + Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64")
		},
		{name: "x-chain-id", value: CHAIN_ID} //main net, test net
	]
}

const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option));

const nft_kms = new caver.contract(CONTRACT_ABI, MY_CONTRACT_ADDRESS); //

const readcontract = async () => { //
	try {
		const _nft = await nft_kms.methods.kmsowner().call(); //
		console.log(`오너:${_nft}`); //
	} catch(e) {
		console.log(`[ERROR떴다요]${e}`);
	}
}

const getBalance = (address) => {
	return caver.rpc.klay.getBalance(address).then((response) => {
		const _balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response));
		console.log(`BALANCE: ${_balance}`);
		return _balance;
	})
}

const mint_token = async (set_Id, set_owner, set_URI) => { //됨!!!!
	// 사용할 계정 설정
	try {
		const privatekey1 = '0x5c77...'; // !!
		const deployer = caver.wallet.keyring.createFromPrivateKey(privatekey1);
		caver.wallet.add(deployer);

		const receipt = await nft_kms.methods.mint_token(set_Id, set_owner, set_URI).send({
			from: deployer.address,
			gas: "0x5555555"
		})
		console.log(`보냈수${receipt}`);
	} catch(e) {
		console.log(`[ERROR_MINT]${e}`);
	}
}

const show = (t_id) => { // 안됨..
	try {
		const result = nft_kms.methods.tokenURI(t_id).call(); //
		console.log(`URI:${result}`); //
	} catch(e) {
		console.log(`[ERROR떴다요ㅜ]${e}`);
	}
}

const DEFAULT_QR_CODE = 'DEFAULT';
function App() {
	readcontract(); //
	getBalance('0xb36229b6eba7980055898d077e53000ff3149463');
	// show(100);

	const [balance, setBalance] = useState("0");
	const [qrValue, setQrvalue] = useState(DEFAULT_QR_CODE);

	const onClickGetAddress = () => {
		KlipAPI.getAddress(setQrvalue);
	};

	const onClickSetKms = () => {
		KlipAPI.setkms(321, setQrvalue);
	};

	const onClickMint = () => {
		KlipAPI.mint_token (321, 0xb36229b6eba7980055898d077e53000ff3149463, "you mint Token in API", setQrvalue);
	};

	return (
		<div className="App">
		<header className="App-header">
		{/* <img src={logo} className="App-logo" alt="logo" /> */}
		{/* <button title={'토큰 발행'} onClick={()=>{mint_token("100", "0xb36229b6eba7980055898d077e53000ff3149463", "mint from caver")}}>눌러</button> */}
		<br />
		<br />
		<button title={'주소 가져오기'} onClick={()=>{
			onClickGetAddress();
		}}>
			주소가져오기
		</button>
		<button title={'setkms321'} onClick={()=>{
			onClickSetKms();
		}}>
			kms321
		</button>
		<button title={'mint_tk'} onClick={()=>{
			onClickMint();
		}}>
			토큰 발행하기
		</button>
		<br />
		<br />
		<QRCode value={qrValue} />
		<p>{balance}</p>
		<a
			className="App-link"
			href="https://reactjs.org"
			target="_blank"
			rel="noopener noreferrer"
		>
			Learn React
		</a>
		</header>
	</div>
	);
}

export default App;
