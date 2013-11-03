//globals
var knocked = false;
var ws = new WebSocket("ws://localhost:8080/ThirtyOnes/App");
var dbg = true;
var card1, card2, card3, card4;


//constants
var EMPTY = "empty";
var KNOCKED = "Knocked";

//SERVER EVENTS
var EVENT_KNOCK = "KNOCK";
var EVENT_GET_CARD = "GET_CARD"; 
var EVENT_PUT_CARD = "PUT_CARD";

//CLIENT EVENTS
var EVENT_BEGIN_GAME = "BEGIN_GAME";
var EVENT_START_TURN = "START_TURN";
var EVENT_CARD = "CARD";
var EVENT_END_GAME = "END_GAME";
var EVENT_KNOCKED = "KNOCKED";

/*
 * went event is received dispatch appropriate handler
 */
ws.onmessage = function(message){
	if(message.data == ""){
		return;
	}
    o = JSON.parse(message.data);
    if(dbg){
		debug(o.eventType);
	}
	event = o.eventType;
	
	if(event == EVENT_BEGIN_GAME){
		begin_game(o.data);
	}
	else if (event == EVENT_START_TURN){
		start_turn();
	}
	else if (event == EVENT_CARD){
		get_card(o.data);
	}
	else if (event == EVENT_END_GAME){
		end_game(o.data);
	}
	else if (event == EVENT_KNOCKED){
		knocked();
	}
	else{
		alert("unknown event: " + event);
	}
};

/*
 * handles EVENT_START_TURN
 * 
 * enables card selection buttons
 */
function start_turn(){
	if(dbg){
		debug("Start turn");
	}
	
	//enable selection buttons
	var x = document.getElementsByClassName("select");
	for (i=0; i < x.length; i++){
		x[i].disabled = false;
	}
}


/*
 * takes and event name string and a data object
 * wraps data in JSON and sends as message to websocket
 */
function send_event(event, data){

	var o = new Object();
	o.eventType = event;
	o.data = data
	var str = JSON.stringify(o);
	ws.send(str);
}


/*
 * Disables buttons, and updates UI
 */
function end_turn(){
	if(dbg){
		debug("ending turn");
	}
	update_hand();
	var x = document.getElementsByClassName("actions");
	for (i=0; i < x.length; i++){
		x[i].disabled = true;
	}
}


/*
 * One a card had been selected enable discard buttons
 */
function enable_discard(){
	if(dbg){
		debug("enable discard");
	}
	var x = document.getElementsByClassName("discard");
	for (i=0; i < x.length; i++){
		x[i].disabled = false;
	}
}


/*
 * Dispatches EVENT_KNOCK
 * sends event and ends turn
 */
function knock(){
	if(dbg){
		debug("Knocking");
	}
	knocked = true;
	send_event(EVENT_KNOCK,"")
	end_turn();
}


/*
 * Handles EVENT_KNOCKED
 */
function knocked(){
	if(dbg){
		debug("Knocked");
	}
	knocked = true;
	end_turn();
}


/*
 * Dispatches EVENT_PUT_CARD
 * updates card objects and updates UI
 */
function discardCard(numCard){
	if(dbg){
		debug("Discarding card " + numCard );
	}
	
	var card;
	
	if (numCard == 1){
		card = card1;
		card1 = card4;
		card4 = EMPTY;
	}
	else if (numCard == 2){  
		card = card2;
		card2 = card4;
		card4 = EMPTY;
	}	
	else if (numCard == 3){
		card = card3;
		card3 = card4;
		card4 = EMPTY;
	}
	else{ 
		card = card4;
		card4 = EMPTY;
	}
	
	update_hand();
	send_event(EVENT_PUT_CARD, card);
	end_turn();
}


/*
 * handles EVENT_CARD
 * addes new card object in slot 4
 */
function get_card(newCard){
    if(dbg){
		debug("Get card");
	}
	card4 = newCard;
	update_hand();
	enable_discard();
}


/*
 * handles EVENT_END_GAME
 */
function endGame(msg){
	document.getElementById("lblknock").innerHTML = msg;
	ws.close();
}


/*
 * dispatch EVENT_GET_CARD
 * @param fromDeck (boolean) which pile to get card from
 * false = discard pile
 * true = from deck
 *              
 */
function selectCard(fromDeck){
	send_event(EVENT_GET_CARD,fromDeck);
}


/*
 * handles EVENT_BEGIN_GAME
 * @param cards - JS array of 3 cards
 */
function begin_game(cards){
	if(dbg){
		debug("Begin game");
	}
	//cards = JSON.parse(cards);
	card1 = cards[0];
	card2 = cards[1];
	card3 = cards[2];
	card4 = EMPTY;
	update_hand();
}


/*
 * redraw the UI
 */
function update_hand(){
	if(dbg){
		debug("updating display");
	}
	document.getElementById("lblcard1").innerHTML = card1.value + " of " + card1.suit;
	document.getElementById("lblcard2").innerHTML = card2.value + " of " + card2.suit;
	document.getElementById("lblcard3").innerHTML = card3.value + " of " + card3.suit;
	if (knocked){
		document.getElementById("lblknock").innerHTML = KNOCKED;
	}
	
	if(card4 != EMPTY){
		document.getElementById("lblcard4").innerHTML = card4.value + " of " + card4.suit;
	}
	else{
		document.getElementById("lblcard4").innerHTML = "(none)";
	}
}


/*
 * Constructor for card object
 */
function card(suitIn, valueIn){
	this.suit = suitIn;
	this.value = valueIn;
}


function test(){
	//alert("infunc");
	var cards = new Array();
	cards[0] = new card("diamonds", "four");
	cards[1] = new card("diamonds", "five");
	cards[2] = new card("diamonds", "six");
	//alert(cards);
	
	json = JSON.stringify(cards);
	begin_game(json);
	start_turn();
	//get_card(new card("diamonds", "ace"));
	//end_turn();
	
    //alert(json);
	//obj = JSON.parse(json);
	
	//var str = toJSON(c);
	//var obj = fromJSON(str);
	//alert(obj.suit);
}


/*
 * If global debug is true print debug messages
 */
function debug(msg){
	if(dbg){
		alert(msg);
	}
}