

function SignalPeer(initialServerUrl) {

	var _this = this;
	this.mUUID = UUID.getId();
	this.mPeerList = new CallerInfo();
	this.mSignalClient = new SignalClient(initialServerUrl);
	this.mMessageTransfer = new MessageTransfer(this);
	this.mMessageProtocol = new MessageProtocol(this);

	this.getMessageProtocol = function() {
		return this.mMessageProtocol;
	};

	this.getMessageTransfer = function() {
		return this.mMessageTransfer;
	};

	this.getSignalClient = function() {
		return this.mSignalClient;
	};

	//
	// #interface 
	this.mObserver = new function() {
		   var _t = this;
		   this.mWork = null;
		   this.onJoinNetwork = function(peer,v) {
			   if(_t.mWork != null&&_t.mWork.onJoinNetwork != undefined&&_t.mWork.onJoinNetwork != null) {
				   _t.mWork.onJoinNetwork(peer, v);
			   }
		   };
		   this.onOpen = function(caller,event) {
			   if(_t.mWork != null&&_t.mWork.onOpen != undefined&&_t.mWork.onOpen != null) {
				   this.mWork.onOpen(caller,event);
			   }
		   };
		   this.onIceCandidate = function(caller,event) {
			   if(_t.mWork != null&&_t.mWork.onIceCandidate != undefined&&_t.mWork.onIceCandidate != null) {
				   _t.mWork.onIceCandidate(caller,event);
			   }
			   caller.getSignalClient().sendCandidate(caller.getTargetUUID(), _this.mUUID, event.candidate);
		   };
		   this.onSetSessionDescription = function(caller, type, sdp) {
				console.log("###################stun sv:"+type+","+caller.getTargetUUID()+","+_this.mUUID);
			};
	       this.onReceiveMessage = function(peer, v) {
			   var p2pMes = JSON.parse(v);
			   peer.getSignalClient().onTransferMessage(peer, v);;//onReceiveMessage(peer, v);
			   _this.getMessageTransfer().onTransferMessage(peer, v);
			   _this.getMessageProtocol().onReceiveMessage(peer, v);
			   if(_t.mWork != null&&_t.mWork.onReceiveMessage != undefined&&_t.mWork.onReceiveMessage != null) {
				   _t.mWork.onReceiveMessage(peer, p2pMes);
			   }
		   };
		   this.setDecorteWork = function(work) {
			   _t.mWork = work;
		   }
	};

	this.setEventListener = function(observer) {
		_this.mObserver.setDecorteWork(observer);
		return this;
	};


	this.getUUID = function() {
		return this.mUUID;
	};

	//
	// join network from initial server
	this.joinNetwork = function() {
		_this.mSignalClient.join(this.mUUID);
	};

	//--------------------------
	// signal client defined peer
	//
	this.onJoinNetwork = function(v) {
    	 console.log("######onJoinNetwork:");
		 _this.mObserver.onJoinNetwork(this, v);
	};

	this.addIceCandidate = function(v) {
	    console.log("######addIceCandidate:"+v.from);
		_this.mPeerList.get(v.from).caller//create(_this.mUUID, v.from)
		.addIceCandidate(v.content);//.candidate
	};

	this.onReceiveAnswer = function(v) {
	    console.log("######onReceiveAnswer()");
		_this.mPeerList.get(v.from).caller
		.setRemoteSDP("answer", v.content);
	};

	//
	// if receive offer, then sendAnswer() and establish connection
	this.startAnswerTransaction = function(transfer, v) {
		var signalClient = _mSignalPeer.getSignalClient();
		if ("server" === transfer) {
			signalClient = _mSignalPeer.getSignalClient();
	  	}else {
	  		signalClient = new MessageTransfer(this);
	  		signalClient.setTransfer(transfer);
	  		signalClient.setPeer(this);
	   	}
	    console.log("######startAnswerTransaction:"+_this.mUUID+","+v.from);
	    console.log("######startAnswerTransaction:"+v.content);
		var caller = _this.mPeerList.create(_this.mUUID, v.from)
		.setEventListener(_this.mObserver)
		.setSignalClient(signalClient)
	    .createPeerConnection()
		.setRemoteSDP("offer", v.content)
		.createAnswer();
	};
	//
	// signal client defined peer
	//------------------------------

	this.getPeerList = function() {
		return this.mPeerList;
	};

	//
	// sendOffer() then, onReceiveAnswer()
	this.startOfferTransaction = function(transfer,uuid) {
		var signalClient = _mSignalPeer.getSignalClient();
		if ("server" === transfer) {
			signalClient = _mSignalPeer.getSignalClient();
	  	}else {
	  		signalClient = new MessageTransfer(this);
	  		signalClient.setTransfer(transfer);
	  		signalClient.setPeer(this);
	   	}
	    console.log("######startOfferTransaction:"+_this.mUUID+","+uuid);
	    var caller = _this.mPeerList.create(_this.mUUID,uuid)
   		.setEventListener(_this.mObserver)
	    .createPeerConnection()
	    .setSignalClient(signalClient)
	    .createOffer();
	};

	this.sendHello = function() {
	    console.log("sendHello()");
	    var keys = this.mPeerList.keys();
	    while(keys.length != 0) {
	    	var key = keys.pop();
	    	_this.mMessageProtocol.sendFindNode(key);
	    }
	};

	this.mSignalClient.setPeer(this);
	this.mMessageTransfer.setPeer(this);
};

