
function MessageTransfer(target) {
	this.mParent = target;
	this.mTransfer = null;

	this.mPeer = new (function() {
		this.onReceiveAnswer = function(v) {console.log("+++onReceiveAnswer()\n");}
		this.addIceCandidate = function(v) {console.log("+++addIceCandidate()\n");}
		this.startAnswerTransaction = function(v) {console.log("+++startAnswerTransaction()\n");}
		this.onJoinNetwork = function(v) {console.log("+++onJoinNetwork()\n");}
	});
	this.setPeer = function(peer) {
		this.mPeer = peer;
	};
	this.setTransfer = function(transfer) {
		this.mTransfer = transfer;
	};

	this.onReceiveMessage = function(message) {
		var body = message.content;
		if(body == undefined || body == null) {return;}
		var v = {};
		v.contentType = body["contentType"];
		v.content     = body["body"];
		v.from        = message["from"];
		v.to          = message["to"];

		if ("answer"=== v.contentType) {
			console.log("=======================answer sv:"+v.to+","+v.from);
			//v.content =  toURLDecode(toByte(v.content));
			this.mPeer.onReceiveAnswer(v)
		} else if ("offer" === v.contentType) {
			console.log("=======================offer sv:"+v.to+","+v.from);
			//v.content =  toURLDecode(toByte(v.content));
			this.mPeer.startAnswerTransaction(v, this.mPeer.getSignalClient());
		} else if("candidate" == v.contentType){
			console.log("=======================candidate sv:"+v.to+","+v.from);
			this.mPeer.addIceCandidate(v);
		}
	};
	this.sendOffer = function(to, from, sdp) {
		console.log("=======================send offer sv:"+to+","+from);
		var cont = {};
		cont.contentType = "offer";
		cont.body = sdp;//toURLEncode(toByte(sdp));
		this.sendUnicastMessage(to, from, cont);
	};

	this.sendAnswer = function(to, from, sdp) {
		console.log("=======================send answer sv:"+to+","+from);
		var cont = {};
		cont.contentType = "answer";
		cont.body = sdp;//toURLD(toByte(sdp));
		this.sendUnicastMessage(to, from, cont);
	};

	this.sendCandidate = function(to, from, candidate) {
		console.log("=======================send candidate sv:"+to+","+from);
		var cont = {};
		cont.contentType = "candidate";
		cont.body = candidate;
		this.sendUnicastMessage(to, from, cont);
	};
	this.sendUnicastMessage = function(to, from, content) {	
		console.log("=======================sendUnicastMessage :"+to+","+from+","+this.mTransfer);
		var mes = {};
		mes.messageType = "unicast";
		mes.to = to;
		mes.from = from;
		mes.content = content;
		this.mParent.getPeerList().get(this.mTransfer).caller.sendMessage(JSON.stringify(mes));
//		this.mParent.getPeerList().get(to).caller.sendMessage(JSON.stringify(mes));
	}

	this.onTransferMessage = function(caller, message) {

	    var p2pMes = JSON.parse(message);
    	var to = p2pMes.to;
    	var from = p2pMes.from;
    	var content = p2pMes.content;

    	if("unicast" == p2pMes.messageType) {
    		console.log("=======================onTransferMessage sv:");
    		console.log("===from      :" + from);
    		console.log("===to        :" + to);
    		console.log("===transfer  :" + caller.getMyUUID());
    		console.log("===target    :" + caller.getTargetUUID());

    		//this.setPeer(caller);
    		var mes = {};
    		mes.to = to;
    		mes.from = from;
    		mes.content = content;
    		mes.messageType = "transfer"; 
    		var targetPeer = this.mParent.getPeerList().get(to).caller;
    		targetPeer.sendMessage(JSON.stringify(mes));
	    }
    	else if("transfer" == p2pMes.messageType) {
    		this.setTransfer(caller.getMyUUID());
    		this.onReceiveMessage(p2pMes);
    	}
	}
}

