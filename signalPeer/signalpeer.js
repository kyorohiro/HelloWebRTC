function SignalPeer(uuid, initialServerUrl) {
	this.mUUID = uuid;
	this.mCallerInfos = new CallerInfo();
	this.mSignalClient = new SignalClient(initialServerUrl);
	
	this.onLocalSDP = function(type, sdp) {
	};

	this.onMessageFromPeer = function(message) {
	};

	this.joinNetwork = function() {
		this.mSignalClient.join(this.mUUID);
	};

	this.sendOffer = function(uuid) {
	    console.log("+++sendOffer");
	    var _caller = new Caller(uuid);
	    this._mCallerInfos.add(uuid, _caller);
	    _caller.setTargetUUID(uuid);
	    _caller.setOnReceiveSDP(this.onLocalSDP);
	    _caller.createPeerConnection();
	    _caller.createOffer();
	};
}