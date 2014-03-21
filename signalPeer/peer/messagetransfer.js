
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
		var body = message.content;
		var v = {};
		v.contentType = body["contentType"];
		v.content     = body["body"];
		v.from        = message["from"];
		v.to          = message["to"];

		if ("answer"=== v.contentType) {
			console.log("=======================answer sv:"+v.to+","+v.from);
			this.mPeer.onReceiveAnswer(v)
		} else if ("offer" === v.contentType) {
			console.log("=======================offer sv:"+v.to+","+v.from);
			this.mPeer.startAnswerTransaction(v, this);
		} else if("candidate" == v.contentType){
			console.log("=======================candidate sv:"+v.to+","+v.from);
			this.mPeer.addIceCandidate(v);
		}
	};
	this.sendOffer = function(to, from, sdp) {
		var cont = {};
		cont.contentType = "offer";
		cont.body = sdp;
		this.sendUnicastMessage(to, from, cont);
	};

	this.sendAnswer = function(to, from, sdp) {
		var cont = {};
		cont.contentType = "answer";
		cont.body = sdp;
		this.sendUnicastMessage(to, from, cont);
	};

	this.seneCandidate = function(to, from, candidate) {
		var cont = {};
		cont.contentType = "candidate";
		cont.body = candidate;
		this.sendUnicastMessage(to, from, cont);
	};

	this.sendUnicastMessage = function(to, from, content) {	
		var mes = {};
		mes.messageType = "unicast";
		mes.to = to;
		mes.from = from;
		mes.content = content;
		this.mPeerList.get(to).caller.sendMessage(JSON.stringify(mes));
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

