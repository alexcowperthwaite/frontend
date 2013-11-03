//globals
var knocked = false;
var ws = new WebSocket("ws://localhost:8080/ThirtyOnes/App");
var dbg = true;
var pileCard;


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
	
    pileCard = o.data;
    
    update_hand();
};


function update_hand(){
	if(dbg){
		debug("updating display");
	}
	document.getElementById("lblPileCard").innerHTML = card1.value + " of " + card1.suit;
	//document.getElementById("lblcard2").innerHTML = card2.value + " of " + card2.suit;
	//document.getElementById("lblcard3").innerHTML = card3.value + " of " + card3.suit;
	//if (knocked){
		//document.getElementById("lblknock").innerHTML = KNOCKED;
	//}
	
}


/*
 * Constructor for card object
 */
function card(suitIn, valueIn){
	this.suit = suitIn;
	this.value = valueIn;
}


/*
 * If global debug is true print debug messages
 */
function debug(msg){
	if(dbg){
		alert(msg);
	}
}