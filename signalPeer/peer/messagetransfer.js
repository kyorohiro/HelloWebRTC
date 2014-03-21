
function MessageTransfer(target) {
	this.mParent = target;

	this.mPeer = new (function() {
		this.onReceiveAnswer = function(v) {console.log("+++onReceiveAnswer()\n");}
		this.addIceCandidate = function(v) {console.log("+++addIceCandidate()\n");}
		this.startAnswerTransaction = function(v) {console.log("+++startAnswerTransaction()\n");}
		this.onJoinNetwork = function(v) {console.log("+++onJoinNetwork()\n");}
	});
	this.setPeer = function(peer) {
		this.mPeer = peer;
	};

	this.onReceiveMessage = function(message) {
		var v = {};
		v.contentType = message["contentType"];
		v.content     = message["content"];
		v.from        = message["from"];
		v.to          = message["to"];
		console.log("###################init sv:"+v.contentType+","+v.from);
		if ("join" === v.contentType) {
			this.mPeer.onJoinNetwork(v);
		} else if ("answer"=== v.contentType) {
			this.mPeer.onReceiveAnswer(v)
		} else if ("offer" === v.contentType) {
			this.mPeer.startAnswerTransaction(v, this.mPeer.getSignalClient());
		} else if("candidate" == v.contentType){
			this.mPeer.addIceCandidate(v);
		}
	};
	this.sendOffer = function(to, from, sdp) {
		var cont = {};
		cont.contentType = "offer";
		cont.content = sdp;
		this.sendUnicastMessage(to, from, cont);
	};

	this.sendAnswer = function(to, from, sdp) {
		var cont = {};
		cont.contentType = "answer";
		cont.content = sdp;
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
    		mes.messageType = "transfer"; 
    		var targetPeer = this.mParen.get(to);
    		targetPeer.sendMessage(JSON.stringify(mes));
	    }
	}
}

