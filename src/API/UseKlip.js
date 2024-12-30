import axios from "axios";
// import {
// 	KIP17TOKEN_ADDRESS,
// 	MARKET_ADDRESS,
// } from '../constants';

const KIP17TOKEN_ADDRESS = '0x728e2bF07469b2d502b4EaED7bf761E2419A8755';
const MARKET_ADDRESS = '0x6e3595a41EfDB8A664153b3f3Cf5B5a87bA28ed8';
// const MY_CONTRACT_ADDRESS = '0x914Bdb3E825B573b51cE05DD3d19353e330d8F7F';
const A2P_API_PREPARE_URL = "https://a2a-api.klipwallet.com/v2/a2a/prepare";
//                          "https://a2a-api.klipwallet.com/v2/a2a/prepare"
const isMobile = window.screen.width >= 1280 ? false : true;

const getKlipAccessUrl = (method, request_key) => {
	if (method === "QR") {
		return `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
		//     "https://klipwallet.com/?target=/a2a?request_key={request_key}"
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
		"10000000000000000", // 0.01KLAY
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
			// const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
			// setQrvalue(qrcode);
			setQrvalue(getKlipAccessUrl("QR", request_key));
		}
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
	}).catch((error) => {
		console.error("excute::API 요청 실패:", error.response?.data || error.message);
		
		// 응답 상태 코드에 따라 다른 처리
		if (error.response?.status === 401) {
			alert("API 인증에 실패했습니다. 클라이언트 설정을 확인하세요.");
		} else if (error.response?.status === 403) {
			alert("API 권한이 거부되었습니다. 그룹 설정을 확인하세요.");
		} else if (error.response?.status === 500) {
			alert("서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
		} else {
			alert("API 요청에 실패했습니다. 네트워크를 확인하세요.");
		}
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
	}).catch((error) => {
        console.error("getAdd::API 요청 실패:", error.response?.data || error.message);
        alert("API 요청에 실패했습니다.");
    });
}

// export const mint_token = (count, address, string, setQrvalue) => {
// 	axios.post(
// 		A2P_API_PREPARE_URL,{
// 			bapp: {
// 				name: 'KLAY_MARKET'
// 			},
// 			type: "excuse_contract",
// 			transaction: {
// 				to: MY_CONTRACT_ADDRESS,
// 				abi: '{ "constant": false, "inputs": [ { "name": "set_Id", "type": "uint256" }, { "name": "set_owner", "type": "address" }, { "name": "set_URI", "type": "string" } ], "name": "mint_token", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }',
// 				value: "0",
// 				params: `["${count}", ${address}, ${string}]`
// 			}
// 		}
// 	).then((response) => {
// 		const { request_key } = response.data;
// 		const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
// 		setQrvalue(qrcode);
// 		let timerId = setInterval(()=> {
// 			axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then((res)=> {
// 				if (res.data.result) { //왔따!!!
// 					console.log(`[mint Result] ${JSON.stringify(res.data.result)}`);
// 					clearInterval(timerId);
// 				}
// 			})
// 		}, 1000)
// 	})
// }

// export const setkms = (count, setQrvalue) => {
// 	axios.post(
// 		A2P_API_PREPARE_URL,{
// 			bapp: {
// 				name: 'KLAY_MARKET'
// 			},
// 			type: "execute_contract",
// 			transaction: {
// 				to: MY_CONTRACT_ADDRESS,
// 				abi: '{ "constant": false, "inputs": [ { "name": "setting", "type": "uint256" } ], "name": "setkms", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }',
// 				value: "0",
// 				params: `[\"${count}\"]`
// 			}
// 		}).then((response) => {
// 		const { request_key } = response.data;
// 		const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
// 		setQrvalue(qrcode);
// 		let timerId = setInterval(()=> {
// 			axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then((res)=> {
// 				if (res.data.result) { //왔따!!!
// 					console.log(`[kms321 Result] ${JSON.stringify(res.data.result)}`);
// 					if (res.data.result.status === 'success') {
// 						clearInterval(timerId);
// 					}
// 					//
// 				}
// 			})
// 		}, 1000)
// 	})
// }
