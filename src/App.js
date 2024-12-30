import QRCode from "qrcode.react";
import Caver from "caver-js";

// import { privateKey } from 'caver-js/packages/caver-wallet/src/keyring/keyringFactory';
import React, { useState } from 'react';
import * as KlipAPI from "./API/UseKlip";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./market.css";
import { Alert, Container, Card, Nav, Form, Button, Modal, Row, Col, CardGroup } from "react-bootstrap";
import KIP17TOKEN_ABI from './constants/KIP17TOKEN_ABI.json';
// import MARKET_ABI from './constants/MARKET_ABI.json';

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
			value: "Basic " + Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64"),
		},
		{name: "x-chain-id", value: CHAIN_ID}, //main net, test net
	],
};

const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option));

const NFT17 = new caver.contract(KIP17TOKEN_ABI, KIP17TOKEN_ADDRESS);

var arr = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var Dice = [];
Dice[0] = "https://media.vlpt.us/images/wuriae/post/8603ab96-aac3-49ab-9c25-f38c0a578d85/KakaoTalk_20211111_143015157.png";
Dice[1] = "https://media.vlpt.us/images/wuriae/post/034a26ad-1e42-4db1-9e43-0efc10560b4c/KakaoTalk_20211111_142704735_05.png";
Dice[2] = "https://media.vlpt.us/images/wuriae/post/d7b8dc19-fc6d-453a-8eb2-250d6f9817b4/KakaoTalk_20211111_142704735_04.png";
Dice[3] = "https://media.vlpt.us/images/wuriae/post/e75c4d6f-5bc2-421d-950a-70c10a673c04/KakaoTalk_20211111_142704735_03.png";
Dice[4] = "https://media.vlpt.us/images/wuriae/post/53fab78f-a0be-4264-9ee4-bf0a04d88331/KakaoTalk_20211111_142704735_02.png";
Dice[5] = "https://media.vlpt.us/images/wuriae/post/13f1c6dd-7baf-4437-8ed9-1890e76a7c05/KakaoTalk_20211111_142704735_01.png";
Dice[6] = "https://media.vlpt.us/images/wuriae/post/e9639836-5fa8-4ba5-9a35-e9f2dca4e74d/KakaoTalk_20211111_142704735.png";

const fetch_dice = () => {
	for (let i = 0; i < 3; i++) {
		<img src={"https://th.bing.com/th/id/OIP.YaInt7StzWvS8E5sgfB8SwHaHR?w=164&h=180&c=7&r=0&o=5&dpr=1.25&pid=1.7"}></img>
	}
}

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

const getBalance = async (address) => {
    try {
        if (!caver.utils.isAddress(address)) {
            throw new Error("유효하지 않은 Klaytn 주소입니다.");
        }

        const response = await caver.rpc.klay.getBalance(address);
        if (!response) {
            throw new Error("Klaytn RPC 호출 실패");
        }

        const _balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response));
        console.log(`BALANCE: ${_balance}`);
        return _balance;
    } catch (error) {
        console.error("getBalance 호출 중 오류 발생:", error.message || error);
        throw error;
    }
};
// const getBalance = (address) => {
// 	return caver.rpc.klay.getBalance(address).then((response) => {
// 		const _balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response));
// 		console.log(`BALANCE: ${_balance}`);
// 		return _balance;
// 	})
// };

function App() {
	const [nfts, setNfts] = useState([]); // {id: '', uri: ''}
	const [myBalance, setmyBalance] = useState("0");
	const [myAddress, setmyAddress] = useState(DEFAULT_ADDRESS);

	// UI
	const [qrvalue, setQrvalue] = useState("DEFAULT");
	const [tab, setTab] = useState('MARKET'); // MARKET, GAME, WALLET
	const [mintImageUrl, setMintImageUrl] = useState("");
	const [Random1, setRandom1] = useState(0); ///////////////
	const [Random2, setRandom2] = useState(0); ///////////////
	const [Random3, setRandom3] = useState(0); ///////////////

	const [Combo1, setCombo1] = useState(0);
	const [Combo2, setCombo2] = useState(0);
	const [Combo3, setCombo3] = useState(0);
	const [Combo4, setCombo4] = useState(0);
	const [Combo5, setCombo5] = useState(0);
	const [Combo6, setCombo6] = useState(0);

	const [Throw1, setThrow1] = useState(0);
	const [Throw2, setThrow2] = useState(0);
	const [Throw3, setThrow3] = useState(0);

	const [payed, setPayed] = useState(0);


	const [loginColor, setColor] = useState("red");

	const [showModal, setShowModal] = useState(false);
	const [modalProps, setModalProps] = useState({
		title: "MODAL",
		onConfirm: () => {},
	});
	// const rows = nfts.slice(nfts.length / 2);

	const Reset = () => {
		setmyAddress(DEFAULT_ADDRESS);
		setmyBalance("0");
		setTab("MARKET");
		setQrvalue("DEFAULT");
		setColor("red");
		setRandom1(0);
		setRandom2(0);
		setRandom3(0);
		setPayed(0);
	}

	const onClickReset = () => {
		setModalProps({
			title: "계정을 초기화 하시겠습니까?",
			onConfirm: () => {
				Reset();
			},
		});
		setShowModal(true);
	};

	const GetResult = () => {
		console.log(Random1, Random2, Random3, Combo1, Combo2, Combo3, Combo4, Combo5, Combo6);
		if (Random1 === 0 || Random2 === 0 || Random3 === 0)
			alert("메롱");
		else
		{
			if (Combo1 < 2 && Combo2 < 2 && Combo3 < 2 && Combo4 < 2 && Combo5 < 2 && Combo6 < 2)
			{
				alert("꼴등");
			}
			else if (Combo1 === 2 || Combo2 === 2 || Combo3 === 2 || Combo4 === 2 || Combo5 === 2 || Combo6 === 2)
			{
				alert("페어!");
			}
			else
			{
				alert("트리플!!!");
			}
		}
	}

	const Check_Combo = (Random1)=> {
		if (Random1 === 1)
		{
			setCombo1(Combo1+1);
			setThrow1(1);
		}
		else if (Random1 === 2)
		{
			setCombo2(Combo2+1);
			setThrow1(2);
		}
		else if (Random1 === 3)
		{
			setCombo3(Combo3+1);
			setThrow1(3);
		}
		else if (Random1 === 4)
		{
			setCombo4(Combo4+1);
			setThrow1(4);
		}
		else if (Random1 === 5)
		{
			setCombo5(Combo5+1);
			setThrow1(5);
		}
		else if (Random1 === 6)
		{
			setCombo6(Combo6+1);
			setThrow1(6);
		}
	}

	//minsInput
	//Modal
	//fetch Market
	//fetchMy nft
	const fetchMarketNFTs = async () => {
		const _nfts = await fetchCardsOf(MARKET_ADDRESS);
		setNfts(_nfts);
	};

	const fetchMyNFTs = async () => {
		if (myAddress === DEFAULT_ADDRESS) {
			alert("NO ADDRESS");
			setTab("GAME");
			return ;
		}
		const _nfts = await fetchCardsOf(myAddress);
		// const _nfts = await fetchCardsOf('0xb36229b6eba7980055898d077e53000ff3149463');
		setNfts(_nfts);
	};

	const getTime = () => {
		let today = new Date();   
		let year = today.getFullYear(); // 년도
		let month = today.getMonth() + 1;  // 월
		let date = today.getDate();  // 날짜
		let day = today.getDay();  // 요일
		return ('99' + year + '/' + month + '/' + date);
	}

	const onClickMint = async (uri) => { ///////MINT
		if (myAddress === DEFAULT_ADDRESS) {
			alert("NO ADDRESS");
			return ;
		}
		const randomTokenId = parseInt(Math.random() * 1000000);
		KlipAPI.mintCardWithURI(myAddress, randomTokenId, uri, setQrvalue, (result) => {
			alert(JSON.stringify(result));
		});
	};
	const onClickCard = async (id) => {
		if (tab === 'WALLET') {
			setModalProps({
				title: "NFT를 마켓에 올리겠습니까?",
				onConfirm: () => {
					onClickMyCard(id);
				},
			});
			setShowModal(true);
		}
		if (tab === 'MARKET') {
			setModalProps({
				title: "NFT를 구매하겠습니까?", ///////////////////////////////
				onConfirm: () => {
					onClickMarketCard(id);
				},
			});
			setShowModal(true);
		}
		if (tab === 'GAME') {
			setModalProps({
				title: "주사위를 던지시겠습니까? 0.01KLAY가 소모됩니다.",
				onConfirm: () => { //// 발행후 구매!
					// let TimeUri = getTime();
					// const RandomTokenId = parseInt(Math.random() * 1000000);
					// KlipAPI.mintCardWithURI(MARKET_ADDRESS, RandomTokenId, TimeUri, setQrvalue, (result) => {
					// 	alert(JSON.stringify(result) + 'TimeUri:' + TimeUri);
					// 	if (result !== false){
					// 		setPayed(1); ////////////////////////////////////////////////////////////////////////////////////
					// 		// onClickMarketCard(RandomTokenId); ///////// 왜 안되지??
					// 	}});
					onClickMarketCard(168809);//RandomTokenId);
				},
			});
			setShowModal(true);
			setPayed(1);
		}
	};
	const onClickMyCard = (tokenId) => {
		KlipAPI.displayCard(myAddress, tokenId, setQrvalue, (result) => {
			alert(JSON.stringify(result));
		});
	};
	const onClickMarketCard = (tokenId) => { // 구매
		KlipAPI.buyCard(tokenId, setQrvalue, (result) => {
			alert(JSON.stringify(result));
		});
	};

	const onClickMarketCard_just = (tokenId) => { // 구매
		if (qrvalue !== 'DEFAULT'){
			KlipAPI.buyCard(tokenId, qrvalue, (result) => {
				alert(JSON.stringify(result));
			});
		}
	};

	const getUserData = () => {
		setModalProps({
			title: "Klip 지갑을 연동하시겠습니까?",
			onConfirm: () => {
				KlipAPI.getAddress(setQrvalue, async (address) => { // address에 콜백이 들어감?
					setmyAddress(address);
					const _balance = await getBalance(address);
					setmyBalance(_balance);
					fetchCardsOf(_balance);
					if (address !== DEFAULT_ADDRESS)
						setColor("green");
				});
			}
		})
		setShowModal(true);
	};

	return (
		<div className="App">
			<div style={{ backgroundColor: "darkgreen", padding: 10 }}>
				{/* 주소 잔고 */}
				<div
					style={{
						fontSize: 30,
						fontWeight: "bold",
						paddingLeft: 5,
						marginTop: 10,
					}}
				>
					내 지갑
				</div>
				{myAddress}
				<div onClick={onClickReset} style={{
					backgroundColor: "black",
					widhth: 20,
					height: 20,
					margin: "auto"
				}}>
					RESET
				</div>
				<br />
				<Alert
					variant={"balance"}
					style={{
						backgroundColor: "pink",
						fontSize: 25
					}}
				>
					{myAddress !== DEFAULT_ADDRESS
						? `${myBalance} KLAY`
						: "-"
					}
				</Alert>

				<div onClick={getUserData} style={{
					backgroundColor: loginColor,
					fontVariantColor: 'black',//??
					//width: 400,
					padding: 10,
					margin: "auto",
				}}>
					Click to login as Qrcode
				</div>

				{qrvalue !== "DEFAULT" ? (
					// setColor("red"),
					<Container
						style={{
							backgroundColor: "white",
							width: 300,
							height: 300,
							padding: 20,
						}}
					>
						<QRCode value={qrvalue} size={256} style={{ margin: "auto" }}></QRCode>
						<br />
						<br />
					</Container>
				) : null}

				{/* 갤러리 */}
				{(tab === 'MARKET' || tab === 'WALLET') && nfts.length > 0 ? (
					<div className="container" style={{ padding:0, width:"50%"}}>
						{/* {rows.map((o, rowIndex) => (
						<Row key={`rowkey${rowIndex}`}>
							<Col style={{ marginRight: 0, paddingRight: 0 }}>
								<Card
									onClick={() => {
										onClickCard(nfts[rowIndex * 2].id);
									}}
								>
									<Card.Img src={nfts[rowIndex * 2].uri} />
								</Card>
								[{nfts[rowIndex * 2].id}]NFT
							</Col>
							<Col style={{ marginRight: 0, paddingRight: 0 }}>
								{nfts.length > rowIndex * 2 + 1 ? (
								<Card
									onClick={() => {
										onClickCard(nfts[rowIndex * 2 + 1].id);
									}}
								>
									<Card.Img src={nfts[rowIndex * 2 + 1].uri} />
								</Card>
								) : null}
								{nfts.length > rowIndex * 2 + 1 ? (
									<>[{nfts[rowIndex * 2 + 1].id}]NFT</>
								) : null}
							</Col>
						</Row> */}
						{nfts.map((nft, index) => (
							<Row>
								<Col>
									<Card>
										<Card.Img
											key={`imagekey${index}`}
											onClick={()=>{
												onClickCard(nft.id);
											}}
											className="img-responsive" src={nfts[index].uri}
										/>
									</Card>
									{nfts.length > 0 ? (
										<>[{nfts[index].id}]NFT</>
									) : null}
								</Col>
							</Row>
						))}
					</div>
				) : null}
				
				{/* 발행 페이지 */}
				{tab === 'GAME' ? (
					<div className="container" style={{ padding: 0 }}>
						<Card
							calssName="text-center"
							style={{ color: "rgb(241, 180, 169)", borderColor: "#C5B358", width: "50%" }}
						>
							<Card.Body style={{ opacity: 0.9, backgroundColor: "yellow" }}>
								{mintImageUrl !== "" ? (
									<Card.Img src={mintImageUrl} />
								) : null}
								<Form>
									<Form.Group>
										<Form.Control
											value={mintImageUrl}
											onChange={(e) => {
												console.log(e.target.walue);
												setMintImageUrl(e.target.value);
											}}
											type="text"
											placeholder="이미지 주소를 입력해주세요"
										/>
									</Form.Group>
									<br />
									{Random1 === 2? (
										<Button
											onClick={() => {
												onClickMint(mintImageUrl);
											}}
											variant="primary"
											style={{
												backgroundColor: "purple",
												borderColor: "blue",
											}}
										>
											발행
										</Button>
									) : null}
								</Form>
							</Card.Body>
						</Card>
						<Card style={{ padding:0, width:"30%" }}>
							{Random1 === 2? (
								<Card.Img 
								src={"https://1.bp.blogspot.com/-qDVIXBL0LrE/V-74i-PMutI/AAAAAAAAAjY/YdHWzLOzYJgc8ERx0v9k_qFG4uA841jgACLcB/s1600/20160619171928_tcscqzom.gif"}>
								</Card.Img>
							) : null}
						</Card>
						<CardGroup style={{ padding:0, width:"100%" }}> {/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */}
							<Card onClick={() => {
								if (payed === 0)
									onClickCard(0);
								onClickMarketCard(168809); ////////////////////////
							}}>
								<Card.Img src={Dice[Random1]}></Card.Img>
								{Random1 === 0 && payed === 1? (
									<Button	onClick={() => {
										let R = Math.floor(Math.random() * 6 + 1);
										setRandom1(R);
										Check_Combo(R);
										alert('주사위 '+R+'!')
										console.log(R, Throw1);
									}}>
										주사위 굴리기
									</Button>
								) : null}
							</Card>

							<Card onClick={() => {
								if (payed === 0)
									onClickCard(0);
							}}>
							<Card.Img src={Dice[Random2]}></Card.Img>
								{Random2 === 0 && payed === 1? (
									<Button	onClick={() => {
										let R = Math.floor(Math.random() * 6 + 1);
										setRandom2(R);
										if (R === 1)
										{
											setCombo1(Combo1+1);
											setThrow2(1);
										}
										else if (R === 2)
										{
											setCombo2(Combo2+1);
											setThrow2(2);
										}
										else if (R === 3)
										{
											setCombo3(Combo3+1);
											setThrow2(3);
										}
										else if (R === 4)
										{
											setCombo4(Combo4+1);
											setThrow2(4);
										}
										else if (R === 5)
										{
											setCombo5(Combo5+1);
											setThrow2(5);
										}
										else if (R === 6)
										{
											setCombo6(Combo6+1);
											setThrow2(6);
										}
										alert('주사위 '+R+'!')
										console.log(R, Throw2);
									}}>
										주사위 굴리기
									</Button>
								) : null}
							</Card>

							<Card onClick={() => {
								if (payed === 0)
									onClickCard(0);
							}}>
								<Card.Img src={Dice[Random3]}></Card.Img>
								{Random3 === 0 && payed === 1? (
									<Button	onClick={() => {
										let R = Math.floor(Math.random() * 6 + 1);
										setRandom3(R);
										if (R === 1)
										{
											setCombo1(Combo1+1);
											setThrow3(1);
										}
										else if (R === 2)
										{
											setCombo2(Combo2+1);
											setThrow3(2);
										}
										else if (R === 3)
										{
											setCombo3(Combo3+1);
											setThrow3(3);
										}
										else if (R === 4)
										{
											setCombo4(Combo4+1);
											setThrow3(4);
										}
										else if (R === 5)
										{
											setCombo5(Combo5+1);
											setThrow3(5);
										}
										else if (R === 6)
										{
											setCombo6(Combo6+1);
											setThrow3(6);
										}
										alert('주사위 '+R+'!')
										console.log(R, Throw3);
									}}>
										주사위 굴리기
									</Button>
								) : null}
							</Card>
						</CardGroup>
						<Button style={{width: "100%"}} onClick={()=>{GetResult()}}>결과보기</Button>
					</div>
				) : null}
			</div>
			
			<br /><br /><br />


			<br></br>
			{/* 주소잔고 */}
			{/* <Container style={{
				backgroundColor:'white',
				width:300,
				height:300,
				padding: 20,
			}}>
				<QRCode value={qrvalue} size={256} style={{ margin: "auto" }}/>
			</Container>
			<button onClick={fetchMyNFTs}>NFT 가져오기</button>

			{/* 발행 페이지 */}
			{/* 탭 */}
			<nav style={{backgroundColor: "#1b1717", height: 45}} className="navbar fixed-bottom navbar-light" role="navigation">
				<Nav className="w-100">
					<div className="d-flex flex-row justify-content-around w-100">
						<div
							onClick={()=>{
								setTab("MARKET");
								<div>MARKET</div>
								fetchMarketNFTs();
							}}
							className="row d-flex flex-colomn justify-content-center align-items-cnter"
						>
							<div>MARKET</div>
						</div>
						<div
							onClick={()=>{
								setTab("GAME");
							}}
							className="row d-flex flex-colomn justify-content-center align-items-cnter"
						>
							<div>GAME</div>
						</div>
						<div
							onClick={()=>{
								setTab("WALLET");
								fetchMyNFTs();
							}}
							className="row d-flex flex-colomn justify-content-center align-items-cnter"
						>
							<div>WALLET</div>
						</div>
					</div>
				</Nav>
			</nav>
			{/* 모달 */}
			<Modal
				sentered
				size="sm"
				show={showModal}
				onHilde={()=>{
					setShowModal(false);
				}}
			>
				<Modal.Header
					style={{ border: 0, backgroundColor: "blue", opacity: 0.8 }}
				>
					<Modal.Title>{modalProps.title}</Modal.Title>
				</Modal.Header>
				<Modal.Footer
					style={{ border: 0, backgroundColor: "blue", opacity: 0.8 }}
				>
					<Button 
						variant="secondary"
						onClick={() => {
							setShowModal(false);
						}}
					>
						닫기
					</Button>
					<Button
						variant="primary"
						onClick={()=>{
							modalProps.onConfirm();
							setShowModal(false);
						}}
						style={{ backgroundColor: "green", borderColr: "green" }}
					>
						진행
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}

export default App;
