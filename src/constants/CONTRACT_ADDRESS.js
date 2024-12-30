export const KIP17TOKEN_ADDRESS =
	"0x728e2bF07469b2d502b4EaED7bf761E2419A8755";
export const MARKET_ADDRESS =
	"0x6e3595a41EfDB8A664153b3f3Cf5B5a87bA28ed8";
export const NEW_MARKET_ADDRESS =
	"0xb0a166F2fdb44Ffef3C8A027fF75bB70d15Bd716";



	import QRCode from "qrcode.react";
	import Caver from "caver-js";
	
	import { privateKey } from 'caver-js/packages/caver-wallet/src/keyring/keyringFactory';
	import React, { useState } from 'react';
	import * as KlipAPI from "./API/UseKlip";
	import "bootstrap/dist/css/bootstrap.min.css";
	import "./App.css";
	import "./market.css";
	import { Alert, Container, Card, Nav, Form, Button, Modal } from "react-bootstrap";
	import KIP17TOKEN_ABI from './constants/KIP17TOKEN_ABI.json';
	import MARKET_ABI from './constants/MARKET_ABI.json';
	import NEW_MARKET_ABI from './constants/NEW_MARKET_ABI.json';
	
	// const MY_CONTRACT_ADDRESS = '0x84370bc1457Aed3D8685727D0C27cba58526AAd3';
	// const MY_CONTRACT_ADDRESS = '0x78134BFeE8FA083f6916a5d5236f704978f0Bd41'; //MAIN
	const KIP17TOKEN_ADDRESS = '0x728e2bF07469b2d502b4EaED7bf761E2419A8755';
	const MARKET_ADDRESS = '0x6e3595a41EfDB8A664153b3f3Cf5B5a87bA28ed8';
	const ACCESS_KEY_ID = 'KASKQYZFY34O2ZIP1A9491D6';
	const SECRET_ACCESS_KEY = '9/Lw/c8uNNJ3HTp0oEpJy2ZRt74qUVYPmCUk568Q';
	// const CHAIN_ID = '1001'; // baobab
	const CHAIN_ID = '8217'; // main net
	
	const DEFAULT_ADDRESS = "0x00";
	
	const option = {
		headers: [
			{
				name: "Authorization",
				value: "Basic " + Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64")
			},
			{name: "x-chain-id", value: CHAIN_ID} //main net, test net
		]
	};
	
	const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option));
	
	// const nft_kms = new caver.contract(KIP17TOKEN_ABI, MY_CONTRACT_ADDRESS); //
	const NFT17 = new caver.contract(KIP17TOKEN_ABI, KIP17TOKEN_ADDRESS);
	const MARKET = new caver.contract(MARKET_ABI, MARKET_ADDRESS);
	const NewMARKET = new caver.contract(NEW_MARKET_ABI, NEW_MARKET_ADDRESS);
	
	const fetchCardsOf = async (address) => {
		// Fetch Balance, IDs, URIs
		try {
			const balance = await NFT17.methods.balanceOf(address).call();
			console.log(`[NFT Balance]${balance}`);
			const tokenIds = [];
			for (let i =0; i<balance; i++)
			{
				const id = await NFT17.methods.tokenOfOwnerByIndex(address, i).call();
				tokenIds.push(id);
			}
			const tokenURIs = [];
			for (let i =0; i<balance; i++)
			{
				const uri = await NFT17.methods.tokenURI(tokenIds[i]).call();
				tokenURIs.push(uri);
			}
	
			const nfts = [];
			for (let i =0; i<balance; i++){
				nfts.push({ uri: tokenURIs[i], id: tokenIds[i] });
			}
			// console.log(`${tokenIds}`);
			// console.log(`${tokenURIs}`);
			console.log(nfts);
			return nfts;
		} catch (e) {
			console.log(`[ERROR떴다요]${e}`);
		}
	};
	
	const getBalance = (address) => {
		return caver.rpc.klay.getBalance(address).then((response) => {
			const _balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response));
			console.log(`BALANCE: ${_balance}`);
			return _balance;
		})
	};
	
	export default App;
	

	import axios from "axios";
// import {
// 	KIP17TOKEN_ADDRESS,
// 	MARKET_ADDRESS,
// } from '../constants';

const KIP17TOKEN_ADDRESS = '0x728e2bF07469b2d502b4EaED7bf761E2419A8755';
const MARKET_ADDRESS = '0x6e3595a41EfDB8A664153b3f3Cf5B5a87bA28ed8';
// const MY_CONTRACT_ADDRESS = '0x914Bdb3E825B573b51cE05DD3d19353e330d8F7F';
const A2P_API_PREPARE_URL = "https://a2a-api.klipwallet.com/v2/a2a/prepare";
const isMobile = window.screen.width >= 1280 ? false : true;

const getKlipAccessUrl = (method, request_key) => {
	if (method === "QR") {
		return `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
	}
	return `kakaotalk://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
};

export const buyCard = async (
	tokenId,
	setQrvalue,
	callback
) => {
	const functionAbi = // buyNFT
		'{ "constant": false, "inputs": [ { "name": "tokenId", "type": "uint256" }, { "name": "NFTaddress", "type": "address" } ], "name": "buyNFT", "outputs": [ { "name": "", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }';
	executeContract(
		MARKET_ADDRESS,
		functionAbi,
		"10000000000000000",
		`["${tokenId}","${KIP17TOKEN_ADDRESS}"]`,
		setQrvalue,
		callback
	);
};

export const displayCard = async (
	fromAddress,
	tokenId,
	setQrvalue,
	callback
) => {
	const functionAbi = // safeTransferFrom
		'{ "constant": false, "inputs": [ { "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" } ], "name": "safeTransferFrom", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }';
	executeContract(
		KIP17TOKEN_ADDRESS,
		functionAbi,
		"0",
		`["${fromAddress}","${MARKET_ADDRESS}","${tokenId}"]`,
		setQrvalue,
		callback
	);
};

export const mintCardWithURI = async (
	toAddress,
	tokenId,
	uri,
	setQrvalue,
	callback
) => {
	const functionAbi =
		'{ "constant": false, "inputs": [ { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" }, { "name": "tokenURI", "type": "string" } ], "name": "mintWithTokenURI", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }';
	executeContract(
		KIP17TOKEN_ADDRESS,
		functionAbi,
		"0",
		`["${toAddress}","${tokenId}","${uri}"]`,
		setQrvalue,
		callback
	);
};

export const executeContract = (
	txTo,
	functionAbi,
	value,
	params,
	setQrvalue,
	callback
) => {
	axios
	.post(A2P_API_PREPARE_URL,{
			bapp: {
				name: 'KLAY_MARKET'
			},
			type: "execute_contract",
			transaction: {
				to: txTo,
				abi: functionAbi,
				value: value,
				params: params,
			},
		})
		.then((response) => {
		const { request_key } = response.data;
		if (isMobile) {
			window.location.href = getKlipAccessUrl("android", request_key);
		} else {
			getKlipAccessUrl("QR", request_key);
		}
		// const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
		let timerId = setInterval(()=> {
			axios
				.get(
					`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`
				)
				.then((res) => {
					if (res.data.result) { //왔따!!!
						console.log(`[kms321 Result] ${JSON.stringify(res.data.result)}`);
						callback(res.data.result);
						clearInterval(timerId);
						setQrvalue("DEFAULT");
					}
				});
		}, 1000)
	});
};

export const getAddress = (setQrvalue, callback) => {

	axios.post(
		A2P_API_PREPARE_URL,{
			bapp: {
				name: 'KLAY_MARKET'
			},
			type: "auth"
		}
	).then((response) => {
		const { request_key } = response.data;
		const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
		setQrvalue(qrcode);
		let timerId = setInterval(()=> {
			axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then((res)=> {
				if (res.data.result) { //왔따!!!
					console.log(`[Address Result] ${JSON.stringify(res.data.result)}`);
					callback(res.data.result.klaytn_address);
					clearInterval(timerId);
					setQrvalue("DEFAULT");
				}
			})
		}, 1000)
	})
}
