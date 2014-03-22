//new Caller
var Caller = function Caller(id) {
	var _own = this;
	this.pc = null;
	this.pcConfig = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
	this.pcConstraints = { 'optional': [{'DtlsSrtpKeyAgreement': true}]};//, {'RtpDataChannels': true }] };
	this.mMyUUID = id;
	this.mTargetUUID = "";
	this.mDataChannel = null;

	this.mObserver = new (function() {
		this.onReceiveMessage = function(caller, message) {;}
		this.onIceCandidate = function(caller,event){;}
		this.onSetSessionDescription = function(caller,event){;}
	});

	this.mSignalClient = new (function() {
			this.sendAnswer = function(to,from,sdp) {
				console.log("+++sendAnswer()\n");}
			this.sendOffer = function(to,from,sdp) {
				console.log("+++sendOffer()\n");}
	});

	Caller.prototype.setEventListener =function(observer) {
		this.mObserver = observer;
		return this;
	};

	Caller.prototype.setSignalClient =function(client) {
		this.mSignalClient = client;
		return this;
	};

	Caller.prototype.setTargetUUID = function(uuid) {
		this.mTargetUUID = uuid;
		return this;
	};

	Caller.prototype.getTargetUUID = function() {
		return this.mTargetUUID;
	};

	Caller.prototype.getMyUUID = function() {
		return this.mMyUUID;
	};

	Caller.prototype.getLocalDescription = function() {
		try {
			return _own.pc.localDescription;
		} catch(e) {
			return null;
		}
	};

	Caller.prototype.createPeerConnection = function() {
		console.log("+++createPeerConnection()\n");
		try {
			this.pc = new webkitRTCPeerConnection(this.pcConfig, this.pcConstraints);
			this.mDataChannel = this.pc.createDataChannel("channel",{});

			this.setChannelEvents();
			this.pc.onicecandidate = function (event) {//RTCIceCandidateEvent
				if(event.candidate) {
					console.log("+onIceCandidate("+event+","+event.candidate+"):"+_iceCandidateType(_own.pc.localDescription.sdp));
					_own.mObserver.onIceCandidate(_own, event);
				} else {
					console.log("+onIceCandidate(null)");
				}
			};
			this.pc.onaddstream = function (event) {console.log("+++onRemoteStreamAdd("+event+"\n");};
			this.pc.onremovestream = function (event) {console.log("+++onRemoteStreamRemoved("+event+"\n");};
			this.pc.onsignalingstatechange = function (event) {console.log("+++onSignalingChanged("+event+"\n");};
			this.pc.oniceconnectionstatechange = function (event) {console.log("+++onIceConnectionStateChanged("+event.type+"\n");};
			this.onnegotiationneeded = function () {console.log("+++onnegotiationneeded()\n");};
			this.pc.ondatachannel = function(event) {
				console.log("--ondatachannel-\n");
				_own.mDataChannel = event.channel;
				_own.setChannelEvents();
			};
		} catch (e) {
			alert("can not create peer connection."+e+"");
		}
		return this;
	};

	Caller.prototype.createOffer = function () {
		console.log("+++createOffer()\n");
		this.pc.createOffer(
				function _onSetLocalAndMessage (sessionDescription) {
					console.log("+++setLocalAndSendMessage obj="+sessionDescription+"\n");
					_own.pc.setLocalDescription(
							sessionDescription, 
							function() {console.log("+++onSetSessionDescriptionSuccess.");
								_own.mObserver.onSetSessionDescription(_own, _own.pc.localDescription.type, _own.pc.localDescription.sdp);
								_own.mSignalClient.sendOffer(_own.getTargetUUID(), _own.getMyUUID(), _own.pc.localDescription.sdp);
							},
							function(error) {console.log("+++onSetSessionDescriptionError" + error.toString());}
					);
				});
		return this;
	};

	Caller.prototype.createAnswer = function () {
		console.log("+++createAnsert()======\n");
		this.pc.createAnswer(
				function _onSetLocalAndMessage (sessionDescription) {
					console.log("+++setLocalAndSendMessage obj="+sessionDescription+"===============================\n");
					_own.pc.setLocalDescription(
							sessionDescription, 
							function() {
								console.log("+++onSetSessionDescriptionSuccess.=========================");
								_own.mObserver.onSetSessionDescription(_own, _own.pc.localDescription.type, _own.pc.localDescription.sdp);
								_own.mSignalClient.sendAnswer(_own.getTargetUUID(), _own.getMyUUID(), _own.pc.localDescription.sdp);
						    },
							function(error) {console.log("+++onSetSessionDescriptionError" + error.toString());}
					);});
		return this;
	};

	Caller.prototype.addIceCandidate = function (candidate) {
		console.log("+++addIceCandidate()"+this.pc+","+candidate+"\n");
		try {
		var _c =new RTCIceCandidate(candidate);
		this.pc.addIceCandidate(_c);
		}catch(e) {
			console.log("+++addIceCandidate() ERROR"+e.message);
		}
	}

	Caller.prototype.sendMessage = function (message) {
		//
		// #p2p message send
		//
		console.log("+++sendMessage()"+message+"\n");
		this.mDataChannel.send(message);
	};

	Caller.prototype.setRemoteSDP = function(_type, _sdp) {
		console.log("+++setRemoteSDP()"+_type);
		var sd = new RTCSessionDescription();
		sd.type = _type;
		sd.sdp = _sdp;
		this.pc.setRemoteDescription(sd);
		return this;
	};

	Caller.prototype.setChannelEvents = function() {
		console.log("+++setChannelEvent()\n");
		this.mDataChannel.onmessage = function(event) {
			//
			// #p2p message receive
			//
			console.log("+++onReceiveMessage()"+event.data+"\n");
			_own.mObserver.onReceiveMessage(_own, event.data);
		};
		this.mDataChannel.onopen = function(event) {
			console.log("############## onopen:"+event);
			_own.mObserver.onOpen(_own, event.data);
		};
		this.mDataChannel.onerror = function(error) {console.log("onerror:"+JSON.parse(error));};
		this.mDataChannel.onclose = function(error) {console.log("onclose:"+JSON.parse(error));};
	};

	arguments.callee.iceType = _iceCandidateType;
};



function _iceCandidateType(candidateSDP) {
	if (candidateSDP.indexOf("typ relay ") >= 0) {
		return "TURN";
	}
	if (candidateSDP.indexOf("typ srflx ") >= 0) {
		return "STUN";
	}
	if (candidateSDP.indexOf("typ host ") >= 0) {
		return "HOST";
	}
	return "UNKNOWN";
}




try{module.exports = Caller;}catch(e){}
