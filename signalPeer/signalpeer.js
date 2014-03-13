document.write("<script type='text/javascript' src='./uuid.njs'><\/script>");
document.write("<script type='text/javascript' src='./callerinfo.js'><\/script>");

function SignalPeer(initialServerUrl) {
	this.mUUID = UUID.getId();
	this.mPeerList = new CallerInfo();
	this.mSignalClient = new SignalClient(initialServerUrl);
	this.mSignalClient.setOnMessage(this.onMessage);


	//
	// join network from initial server
	this.joinNetwork = function() {
		this.mSignalClient.join(this.mUUID);
	};

	//
	// receive message from initialserver
	this.onMessage = function(message) {
		var contentType = JSON.parse(m.data)["_contentType"];
		var sdp         = JSON.parse(m.data)["_content"];
		var from        = JSON.parse(m.data)["_from"];
		var to          = JSON.parse(m.data)["_to"];
		if ("answer"===contentType) {
			mPeerList.get(from).setRemoteSDP("answer", sdp);
		}
		else if ("offer" === contentType) {
			mPeerList.create(to)
			.setOnReceiveSDP(this.onLocalSDP)
		    .createPeerConnection()
			.setRemoteSDP("offer", sdp)
			.createAnswer();
		}
	};

	//
	// receive message from stun server
	this.onLocalSDP = function(caller, type, sdp) {
		if("offer" === type) {
			_mSignalClient.sendOffer(caller.getTargetUUID(), mUUID, sdp);
		} else if("answer" === _type) {
			_mSignalClient.sendAnswer(caller.getTargetUUID(), mUUID, sdp);
		}
	};

	this.sendOffer = function(uuid) {
	    console.log("+++sendOffer");
	    this.mPeerList.create(uuid)
	    .setTargetUUID(uuid)
	    .setOnReceiveSDP(this.onLocalSDP)
	    .createPeerConnection()
	    .createOffer();
	};

	this.onMessageFromPeer = function(message) {
		//
		// list response peerlist
		// unicast send message
		//
	};



}