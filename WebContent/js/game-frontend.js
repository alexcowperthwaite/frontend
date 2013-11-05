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

////Consider using a type to join all events into one data type
//var ServerEvent = {
//    KNOCK: {value: 0, name: "KNOCK"}, 
//    GET_CARD: {value: 1, name: "GET_CARD"}, 
//    PUT_CARD : {value: 2, name: "PUT_CARD"}
//};

//CLIENT EVENTS
var EVENT_BEGIN_GAME = "BEGIN_GAME";
var EVENT_START_TURN = "START_TURN";
var EVENT_CARD = "CARD";
var EVENT_END_GAME = "END_GAME";
var EVENT_KNOCKED = "KNOCKED";

//// Consider using a type to join all events into one data type
//var ClientEvent = {
//    BEGIN_GAME: {value: 0, name: "BEGIN_GAME"}, 
//    START_TURN: {value: 1, name: "START_TURN"}, 
//    CARD : {value: 2, name: "CARD"},
//    END_GAME: {value: 3, name: "END_GAME"}, 
//    KNOCKED: {value: 4, name: "KNOCKED"}
//};

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
	document.getElementById("lblPileCard").innerHTML = pileCard.value + " of " + pileCard.suit;
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