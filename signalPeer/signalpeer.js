document.write("<script type='text/javascript' src='./uuid.njs'><\/script>");
document.write("<script type='text/javascript' src='./callerinfo.js'><\/script>");

function SignalPeer(initialServerUrl) {

	var _this = this;
	this.mUUID = UUID.getId();
	this.mPeerList = new CallerInfo();
	this.mSignalClient = new SignalClient(initialServerUrl);
	this.mObserver = {};

	//
	//
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
		console.log("--koin--");
		if ("join" === v.contentType) {
			console.log("setE"+_this.mObserver);
			_this.mObserver.onJoinNetwork(this, v);
		} else if ("answer"=== v.contentType) {
			_this.mPeerList.create(v.from)
			.createPeerConnection()
			.setRemoteSDP("answer", v.sdp);
		} else if ("offer" === v.contentType) {
			_this.mPeerList.create(v.to)
			.setOnReceiveSDP(_this.onReceiveMessageFromStunServer)
		    .createPeerConnection()
			.setRemoteSDP("offer", v.sdp)
			.createAnswer();
		}
	};
	this.mSignalClient.setOnMessage(this.onReceiveMessageFromInitServer);


	//
	// receive message from stun server
	this.onReceiveMessageFromStunServer = function(caller, type, sdp) {
		if("offer" === type) {
			_this.mSignalClient.sendOffer(caller.getTargetUUID(), _this.mUUID, sdp);
		} else if("answer" === type) {
			_this.mSignalClient.sendAnswer(caller.getTargetUUID(), _this.mUUID, sdp);
		}
	};

	this.sendOffer = function(uuid) {
	    console.log("+++sendOffer");
	    _this.mPeerList.create(uuid)
	    .setTargetUUID(uuid)
	    .setOnReceiveSDP(this.onReceiveMessageFromStunServer)
	    .createPeerConnection()
	    .createOffer();
	};

	this.onMessageFromPeer = function(message) {
		//
		// list response peerlist
		// unicast send message
		//
	};


};

