
function MessageTransfer(target) {
	var _this = this;
	this.mBase = new MessageTransferBase(target);
	this.mParent = target;
	this.mTransfer = null;

	this.mPeer = new (function() {
		this.onReceiveAnswer = function(v) {console.log("+++onReceiveAnswer()\n");}
		this.addIceCandidate = function(v) {console.log("+++addIceCandidate()\n");}
		this.startAnswerTransaction = function(v) {console.log("+++startAnswerTransaction()\n");}
		this.onJoinNetwork = function(v) {console.log("+++onJoinNetwork()\n");}
	});
	this.setPeer = function(peer) {this.mPeer = peer;};
	this.setTransfer = function(transfer) {this.mTransfer = transfer;};

	this.onReceiveMessage = function(caller,message) {
		var body = message.content;
		if(body == undefined || body == null) {return;}
		var v = {};
		v.contentType = body["contentType"];
		v.content     = body["body"];
		v.from        = message["from"];
		v.to          = message["to"];
		console.log("======================="+v.contentType+":"+v.to+","+v.from);
		if ("answer"=== v.contentType) {
			_this.mPeer.onReceiveAnswer(v)
		} else if ("offer" === v.contentType) {
			_this.mPeer.startAnswerTransaction(caller.getTargetUUID(), v);//this.mPeer.getSignalClient());
		} else if("candidate" == v.contentType){
			_this.mPeer.addIceCandidate(v);
		}
	};
	this.mBase.onReceiveMessage = this.onReceiveMessage;
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

	this.onTransferMessage = function(caller, message) {
		this.mBase.onTransferMessage(caller, message);
	}
	this.sendUnicastMessage = function(to, from, content) {	
		this.mBase._sendUnicastMessage(this.mTransfer,to, from, content);
	}
}

