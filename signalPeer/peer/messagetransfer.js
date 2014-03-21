
function MessageTransfer(target) {
	this.mParent = target;

	this.sendOffer = function(to, from, sdp) {
		var cont = {};
		cont.contentType = "offer";
		cont.sdp = sdp;
		this.sendUnicastMessage(to, from, cont);
	};

	this.sendAnswer = function(to, from, sdp) {
		var cont = {};
		cont.contentType = "answer";
		cont.sdp = sdp;
		this.sendUnicastMessage(to, from, cont);
	};

	this.seneCandidate = function(to, from, candidate) {
		var cont = {};
		cont.contentType = "candidate";
		cont.candidate = candidate;
		this.sendUnicastMessage(to, from, cont);
	};

	this.sendUnicastMessage = function(to, from, content) {	
		var mes = {};
		mes.messageType = "unicast";
		mes.to = to;
		mes.from = from;
		mes.content = content;
		this.mPeerList.get(uuid).caller.sendMessage(JSON.stringify(mes));
	}

	this.onTransferMessage = function(caller, message) {
	    var p2pMes = JSON.parse(message);
    	var to = p2pMes.to;
    	var from = p2pMes.from;
    	var content = p2pMes.content;

    	if("unicast" == p2pMes.messageType) {
    		var mes = {};
    		mes.to = to;
    		mes.from = from;
    		mes.content = content;
    		mes.messageType = "message"; 
    		var targetPeer = this.mParen.get(to);
    		targetPeer.sendMessage(JSON.stringify(mes));
	    }
	}
}

