
//const enum Piles = {
	//"draw",
	//"disc",
	//"user",
	//"opp"
//}

const CARD_COLORS = ["RED", "BLUE", "GREEN", "YELLOW"];
const CARD_VALUES =  ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]//, "+2"] //, "WILD", "WILD +4"];
//const maxCards = 40;
const PILES_SUFFIX = ["draw", "disc", "user", "opp"];
const PILE_DRAW = 0
const PILE_DISCARD = 1
const PILE_USER = 2
const PILE_OPPONENT = 3
//let cardNums = [40, 0, 0, 0];
let pileDraw = []
let pileDiscard = []
let pileUser = []
let pileOpponent = []
const PILES = [pileDraw, pileDiscard, pileUser, pileOpponent]
let isGameRunning = false
let soloGame = true


function editInner(id, newHtml) {
	document.getElementById(id).innerHTML = newHtml;
}


function Card(col, val) {
	this.color = col
	this.value = val
	
	this.getColor = function() {return this.color}
	this.getValue = function() {return this.value}
	this.getNameFull = function() {return this.color.toUpperCase() + " " + this.value}
	this.getNameHtml = function() {return "<span class='" + this.getColorId() + "'>" + this.color.toUpperCase() + "</span> " + this.value}
	this.getColorId = function() {return "cc_" + this.color.charAt(0).toLowerCase()}
}


function setupCards() {
	for (let c = 0; c<CARD_COLORS.length; c++) {
		let color = CARD_COLORS[c]
		for (let v = 0; v<CARD_VALUES.length; v++) {
			let value = CARD_VALUES[v]
			pileDraw.push(new Card(color,value))
		}
	}
	
	//editInner("error", pileDraw)
	
	pileDraw = shufflePile_Yates(pileDraw)
	PILES[PILE_DRAW] = pileDraw
}

function shufflePile(pileArray) {
	let pileShuffled = []
	pileArray.forEach((val, id) => {
		let newPlace = Math.floor(Math.random() * pileArray.length)
		
		while (pileShuffled[newPlace] != null) {
			if (newPlace >= pileArray.length)
			{newPlace = 0}
			newPlace++
		}
		pileShuffled[newPlace] = val
	})
	
	return pileShuffled
}

function shufflePile_Yates(array) {
    let shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

function updateCardCount() {
	//document.getElementById("debug").innerHTML = "Debug");
	for (let who = 0; who < PILES_SUFFIX.length; who++) {
		let textId = "cardNum_" + `${PILES_SUFFIX[who]}`
		editInner(textId, PILES[who].length.toString())
	}
	
	//editInner("userhand", displayUserHand)
	displayUserHand()
	displayDiscardTop()
	
	checkGameOver()
	checkButtonDisabilities()
}

function checkGameOver() {
	if (isGameRunning) {
		if (PILES[PILE_USER] < 0) {
			sendError('userhand-negative')
		}
		else if (PILES[PILE_USER] == 0) {
			editInner("debug", "YOU WON!")
			isGameRunning = false
			//editInner("debug", "YOU WON!")
		}
		else {
			if (PILES[PILE_OPPONENT] < 0) {
				sendError('opphand-negative')
			}
			else if (!soloGame && PILES[PILE_OPPONENT] == 0) {
				//editInner("debug", "YOU LOST!")
				isGameRunning = false
			}
		}	
		
	}
}

function sendError(errorMessage) {
	isGameRunning = false
	editInner("debug", "SOMETHING WENT WRONG.\nPLEASE REPORT: "+errorMessage)
}

function displayUserHand() {
	let handUser = document.getElementById("userhand")
	handUser.innerHTML = ""
	for (let card = 0; card < pileUser.length; card++) {
		
		//RED = "cc_r" ; BLUE = "cc_b" ; GREEN = "cc_g" ; YELLOW = "cc_y" ; WILD = "cc_w"
		console.log("hand_" + `${card}`)		
		//handUser.innerHTML += '<li> <button type="button" id="hand_' + `${card}` +'">PLACE CARD</button>' + `${pileUser[card].getNameHtml()}` +' </li>'
		
		let tabled = document.createElement("td")
		tabled.className = "cardUserList"
		tabled.className += " " + pileUser[card].getColorId()
        let btn = document.createElement("button")
		btn.className = "cardUserButton"
		
        btn.textContent = "PLAY"

        btn.addEventListener("click", () => {
            placeCard(card, pileUser)
        })

        //let span = document.createElement("span")
        //span.innerHTML = pileUser[card].getNameHtml()
        //list.appendChild(span)
		
		let para = document.createElement("p")
		para.className = "cardval"
		para.innerHTML = pileUser[card].getValue().toString()
        //para.innerHTML = pileUser[card].getNameHtml()
		
		
		tabled.appendChild(para)
		tabled.appendChild(btn)
		
        handUser.appendChild(tabled)
		
		//document.getElementById("hand_" + `${card}`).addEventListener("click", () => { placeCard(card,pileUser) })	
	}
}

function displayDiscardTop() {
	let topMost = pileDiscard.length -1
	console.log("Ontop is: "+topMost)
	
	if (topMost > -1) {
		document.getElementById("disc_top").innerHTML = pileDiscard[topMost].getNameHtml()
	}
}

function placeCard(cardIndex, originPile) {
	console.log("PLACING START")
	let topCard = pileDiscard[pileDiscard.length-1]
	let card = originPile[cardIndex]
	let placeSuccess = false
	
	if (pileDiscard.length < 2) {
		topCard = pileDiscard[0]
	}
	
	console.log("originPile: "+ originPile.toString() + "cardIndex: " + "card: " + card)
	
	if (topCard != undefined) {
		if (topCard.getColor() == card.getColor()) {
			placeSuccess = true
			//editInner("debug", "PLACED A CARD!")
		}
		else if (topCard.getValue() == card.getValue()) {
			placeSuccess = true
			//editInner("debug", "PLACED A CARD!")
		}
		else {
			editInner("debug", "CAN'T PLACE CARD!")
		}
		
		if (placeSuccess) {
			pileDiscard.push(card)
			originPile.splice(cardIndex, 1)
			updateCardCount()
			editInner("debug", "PLACED A CARD!")
			placeSuccess = false
		}
	}
}

function startNewGame(isSolo = false) {
	console.log("Starting New game")
	//editInner("error", `ERROR: Who are you referring to?`);
	//for (let i = 0; i < pileDraw.length; i++) {
		//pileDraw.pop()
	//}
	
	soloGame = isSolo
	
	while (pileDiscard.length > 0) {
		pileDiscard.pop()
	}
	while (pileUser.length > 0) {
		pileUser.pop()
	}
	while (pileOpponent.length > 0) {
		pileOpponent.pop()
	}
	pileDraw = []
	//pileDiscard = []
	//pileUser = []
	//pileOpponent = []
	setupCards()
	console.log("Card Setup finished")
	
	//for (let i = 0; i < piles.length; i++) {
	//	cardNums[i] = 0;
	//	if (i == 0) {
	//		cardNums[i] = pileDraw.length;
	//	}
	//}
	

	//starting hand cards
	console.log("Handing out cards...")
	for (let i = 0; i<5; i++) {
		drawCard() //player
		if (!soloGame) {
			drawCard(false) //opponent
		}
	}
	
	isGameRunning = true
	
	//first on discard pile
	transferCard(PILE_DRAW, PILE_DISCARD)
	
	//updateCardCount()
	editInner("debug", "Empty your hand to win!")
}

function checkButtonDisabilities() {
	let drawBtn = document.getElementById("btn_draw")
	let startSoloBtn = document.getElementById("btn_newSolo")
	let startVSBtn =  document.getElementById("btn_newGame")
	
	drawBtn.disabled = !isGameRunning
	//startSoloBtn.disabled = isGameRunning
	//startVSBtn.disabled = isGameRunning
}

function transferCard(sourceID, targetID, cardID = 0) {	
	if (PILES[sourceID].length > 0) {	
		//cardNums[sourceID]--
		//cardNums[targetID]++
		editInner("debug", PILES)
		if (PILES[targetID] != null || PILES[targetID] != undefined) {
			PILES[targetID].push(PILES[sourceID][cardID])
			PILES[sourceID].splice(cardID, 1)
			
			editInner("debug", "CARD TRANSFERED!")
		}
		else {
			editInner("debug", "COULDN'T TRANSFER CARDS! (NULL Target)")
		}
		
	}
	else {
		editInner("debug", "COULDN'T TRANSFER CARDS! (No cards)")
	}
	
	updateCardCount()
}

function drawCard(isPlayer = true) {
	if (PILES[PILE_DRAW].length > 0) {	
		if (isPlayer) {
			transferCard(PILE_DRAW, PILE_USER)		
			editInner("debug", "YOU DREW A CARD!")
		}
		else {
			transferCard(PILE_DRAW, PILE_OPPONENT)
		}
	}
	else {
		editInner("debug", "YOU CAN'T DRAW A CARD!")
	}
}