document.write("<script type='text/javascript' src='./uuid.njs'><\/script>");
document.write("<script type='text/javascript' src='./caller.js'><\/script>");
document.write("<script type='text/javascript' src='./callerinfo.js'><\/script>");

function SignalPeer(initialServerUrl) {

	var _this = this;
	this.mUUID = UUID.getId();
	this.mPeerList = new CallerInfo();
	this.mSignalClient = new SignalClient(initialServerUrl);

	//
	// #interface 
	this.mObserver = new function() {
		   var _t = this;
		   this.mWork = null;
		   this.onJoinNetwork = function(peer,v) {
			   if(_t.mWork != null) {
				   _t.mWork.onJoinNetwork(peer, v);
			   }
		   };
		   this.onIceCandidate = function(caller,event) {
			   _this.mSignalClient.sendCandidate(caller.getTargetUUID(), _this.mUUID, event.candidate);
		   };
		   this.onSetSessionDescription = function(caller, type, sdp) {
				console.log("###################stun sv:"+type+","+caller.getTargetUUID()+","+_this.mUUID);
				if("offer" === type) {
					_this.mSignalClient.sendOffer(caller.getTargetUUID(), _this.mUUID, sdp);
				} else if("answer" === type) {
					_this.mSignalClient.sendAnswer(caller.getTargetUUID(), _this.mUUID, sdp);
				}
			};
		   this.onReceiveMessage = function(peer, v) {
			   _this.onMessageFromPeer(peer, v);
			   if(_t.mWork != null) {
				   _t.mWork.onReceiveMessage(peer, v);
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

	//
	// receive message from initialserver
	this.onReceiveMessageFromInitServer = function(message) {
		var v = {};
		v.contentType = JSON.parse(message.data)["_contentType"];
		v.content     = JSON.parse(message.data)["_content"];
		v.from        = JSON.parse(message.data)["_from"];
		v.to          = JSON.parse(message.data)["_to"];
		console.log("###################init sv:"+v.contentType+","+v.from);
		if ("join" === v.contentType) {
			_this.mObserver.onJoinNetwork(this, v);
		} else if ("answer"=== v.contentType) {
			_this.onReceiveAnswer(v)
		} else if ("offer" === v.contentType) {
			_this.sendAnswer(v);
		} else if("candidate" == v.contentType){
			_this.mPeerList.get(v.from).caller//create(_this.mUUID, v.from)
		    .addIceCandidate(v.content);//.candidate
		}
	};
	this.mSignalClient.setOnMessage(this.onReceiveMessageFromInitServer);

	//
	// if receive offer, then sendAnswer() and establish connection
	this.sendAnswer = function(v) {
	    console.log("+++sendAnswer:"+_this.mUUID+","+v.from);
		_this.mPeerList.create(_this.mUUID, v.from)
		.setEventListener(_this.mObserver)
	    .createPeerConnection()
		.setRemoteSDP("offer", v.content)
		.createAnswer();
	};

	//
	// sendOffer() then, onReceiveAnswer()
	this.sendOffer = function(uuid) {
	    console.log("+++sendOffer:"+_this.mUUID+","+uuid);
	    _this.mPeerList.create(_this.mUUID,uuid)
   		.setEventListener(_this.mObserver)
	    .createPeerConnection()
	    .createOffer();
	};

	this.onReceiveAnswer = function(v) {
		_this.mPeerList.get(v.from).caller
		.setRemoteSDP("answer", v.content);
	}

	this.sendHello = function() {
	    console.log("sendHello()");
	    var keys = this.mPeerList.keys();
	    while(keys.length != 0) {
	    	var key = keys.pop();
	    	_this.sendFindNode(key);
	    }
	}

	this.onMessageFromPeer = function(caller, message) {
	    console.log("###################peer:"+JSON.parse(message).from);
	    var p2pMes = JSON.parse(message);
	    if("query" === p2pMes.type) {
	    	if("findpeer" === p2pMes.command) {
	    		_this.onRecvGetPeers(p2pMes);
	    	}
	    }
	};


	//---
	// p2p message
	//---
	
	// find peer
	this.sendFindNode = function (uuid) {
		var mes = {};
		mes.type = "query";
		mes.command = "findnode";
		mes.id = UUID.getId();
		mes.from = this.mUUID;
		mes.target = uuid;
		mes.node = {
			node1:"xx",
			node2:"xx"
		};
		this.mPeerList.get(uuid).caller.sendMessage(JSON.stringify(mes));
	}

	//
	// 
	this.onRecvFindNode = function (caller, v) {
		var mes = v.content;
		mes.type = "response";
		mes.id = v.id;
		mes.node = {
			node1:"xx",
			node2:"xx"
		};
	};
	
	// 
	this.sendOfferPeer = function() {
	};
	this.onRecvOfferPeer = function() {
	};
	// 
	this.sendAnswerPeer = function() {
	};
	this.onRecvAnswerPeer = function() {
	};
};

