import axios from "axios";

const MY_CONTRACT_ADDRESS = '0x914Bdb3E825B573b51cE05DD3d19353e330d8F7F';
const A2P_API_PREPARE_URL = "https://a2a-api.klipwallet.com/v2/a2a/prepare";
export const setkms = (count, setQrvalue) => {
	axios.post(
		A2P_API_PREPARE_URL,{
			bapp: {
				name: 'KLAY_MARKET'
			},
			type: "execute_contract",
			transaction: {
				to: MY_CONTRACT_ADDRESS,
				abi: '{ "constant": false, "inputs": [ { "name": "setting", "type": "uint256" } ], "name": "setkms", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }',
				value: "0",
				params: `[\"${count}\"]`
			}
		}).then((response) => {
		const { request_key } = response.data;
		const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
		setQrvalue(qrcode);
		let timerId = setInterval(()=> {
			axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then((res)=> {
				if (res.data.result) { //왔따!!!
					console.log(`[kms321 Result] ${JSON.stringify(res.data.result)}`);
					if (res.data.result.status === 'success') {
						clearInterval(timerId);
					}
					//
				}
			})
		}, 1000)
	})
}

export const getAddress = (setQrvalue) => {

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
					clearInterval(timerId);
				}
			})
		}, 1000)
	})
}

export const mint_token = (count, address, string, setQrvalue) => {

	axios.post(
		A2P_API_PREPARE_URL,{
			bapp: {
				name: 'KLAY_MARKET'
			},
			type: "excuse_contract",
			transaction: {
				to: MY_CONTRACT_ADDRESS,
				abi: '{ "constant": false, "inputs": [ { "name": "set_Id", "type": "uint256" }, { "name": "set_owner", "type": "address" }, { "name": "set_URI", "type": "string" } ], "name": "mint_token", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }',
				value: "0",
				params: `[\"${count}\", ${address}, ${string}]`
			}
		}
	).then((response) => {
		const { request_key } = response.data;
		const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
		setQrvalue(qrcode);
		let timerId = setInterval(()=> {
			axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then((res)=> {
				if (res.data.result) { //왔따!!!
					console.log(`[mint Result] ${JSON.stringify(res.data.result)}`);
					clearInterval(timerId);
				}
			})
		}, 1000)
	})
}
