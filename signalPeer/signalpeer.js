document.write("<script type='text/javascript' src='./uuid.njs'><\/script>");
document.write("<script type='text/javascript' src='./caller.js'><\/script>");
document.write("<script type='text/javascript' src='./callerinfo.js'><\/script>");

function SignalPeer(initialServerUrl) {

	var _this = this;
	this.mUUID = UUID.getId();
	this.mPeerList = new CallerInfo();
	this.mSignalClient = new SignalClient(initialServerUrl);
	this.mObserver = {};

	this.setEventListener = function(observer) {
		_this.mObserver = observer;
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
		v.sdp         = JSON.parse(message.data)["_content"];
		v.from        = JSON.parse(message.data)["_from"];
		v.to          = JSON.parse(message.data)["_to"];
		console.log("###################init:"+v.contentType+","+v.from);
		if ("join" === v.contentType) {
			console.log("setE"+_this.mObserver);
			_this.mObserver.onJoinNetwork(this, v);
		} else if ("answer"=== v.contentType) {
			_this.onReceiveAnswer(v)
		} else if ("offer" === v.contentType) {
			_this.sendAnswer(v);
		}
	};
	this.mSignalClient.setOnMessage(this.onReceiveMessageFromInitServer);

	//
	// receive message from stun server
	this.onReceiveMessageFromStunServer = function(caller, type, sdp) {
		console.log("###################stun:"+type+","+caller.getTargetUUID()+","+_this.mUUID);
		if("offer" === type) {
			_this.mSignalClient.sendOffer(caller.getTargetUUID(), _this.mUUID, sdp);
		} else if("answer" === type) {
			_this.mSignalClient.sendAnswer(caller.getTargetUUID(), _this.mUUID, sdp);
		}
	};


	//
	// if receive offer, then sendAnswer() and establish connection
	this.sendAnswer = function(v) {
	    console.log("+++sendAnswer:"+_this.mUUID+","+v.from);
		_this.mPeerList.create(_this.mUUID, v.from)
		.setTargetUUID(v.from)
		.setOnReceiveSDP(_this.onReceiveMessageFromStunServer)
	    .createPeerConnection()
		.setRemoteSDP("offer", v.sdp)
		.createAnswer();
	};

	//
	// sendOffer() then, onReceiveAnswer()
	this.sendOffer = function(uuid) {
	    console.log("+++sendOffer:"+_this.mUUID+","+uuid);
	    _this.mPeerList.create(_this.mUUID,uuid)
	    .setTargetUUID(uuid)
	    .setOnReceiveSDP(_this.onReceiveMessageFromStunServer)
	    .createPeerConnection()
	    .createOffer();
	};

	this.onReceiveAnswer = function(v) {
		_this.mPeerList.get(v.from).caller
		.setRemoteSDP("answer", v.sdp);
	}

	this.sendHello = function(message) {
	    console.log("sendHello()");
	    var keys = this.mPeerList.keys();
	    while(keys.length != 0) {
	    	var key = keys.pop();
	    	var _caller = this.mPeerList.get(key).caller;
	   	    console.log("sendHello() " + key);
	    	_caller.sendHello();
	    }
	}

	this.onMessageFromPeer = function(message) {
		//
		// list response peerlist
		// unicast send message
		//
	    console.log("+++"+message);
	};


};

