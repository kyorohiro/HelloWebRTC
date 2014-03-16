//new Caller
var Caller = function Caller(id) {
	this.pc = null;
	this.pcConfig = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
	this.pcConstraints = { 'optional': [{'DtlsSrtpKeyAgreement': true}, {'RtpDataChannels': true }] };
	this.mMyUUID = id;
	this.mTargetUUID = "";
	this.mDataChannel = null;

	this.mObserver = new (function() {
		this.onReceiveMessage = function(caller, message) {;}
		this.onIceCandidate = function(caller,event){;}
		this.onReceiveMessageFromStunServer = function(caller,event){;}
	});

	Caller.prototype.setEventListener =function(observer) {
		this.mObserver = observer;
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

	Caller.prototype.createPeerConnection = function() {
		console.log("+++createPeerConnection()\n");
		var _own = this;
		try {
			this.pc = new webkitRTCPeerConnection(this.pcConfig, this.pcConstraints);
			this.mDataChannel = this.pc.createDataChannel("channel",{});

			this.setChannelEvents();
			var _own = this;
			this.pc.onicecandidate = function (event) {//RTCIceCandidateEvent
				if(event.candidate) {
					console.log("+onIceCandidate("+event+","+event.candidate+") 00");
					_own.mObserver.onIceCandidate(_own, event);
				} else {
					console.log("+onIceCandidate(null) 00");
				}
			};
			this.pc.onaddstream = function (event) {console.log("+++onRemoteStreamAdd("+event+"\n");};
			this.pc.onremovestream = function (event) {console.log("+++onRemoteStreamRemoved("+event+"\n");};
			this.pc.onsignalingstatechange = function (event) {console.log("+++onSignalingChanged("+event+"\n");};
			this.pc.oniceconnectionstatechange = function (event) {
				console.log("+++onIceConnectionStateChanged("+event.type+"\n");
			};
			this.onnegotiationneeded = function () {
				console.log("+++onnegotiationneeded()\n");
				//_own.pc.createOffer(localDescCreated, logError);
		    };
			this.pc.ondatachannel = function(event) {
				console.log("--ondatachannel-\n");
				_own.mDataChannel = event.channel;
				_own.setChannelEvents();
			};
		/*	navigator.webkitGetUserMedia({ "audio": true, "video": true }, function (stream) {
		        selfView.src = URL.createObjectURL(stream);
		        pc.addStream(stream);
		    }, function logError(error) {
		        log(error.name + ": " + error.message);
		    });*/
		} catch (e) {
			alert("can not create peer connection."+e+"");
		}
		return this;
	};

	Caller.prototype.createOffer = function () {
		console.log("+++createOffer()\n");
		var _own = this;
		this.pc.createOffer(
				function _onSetLocalAndMessage (sessionDescription) {
					console.log("+++setLocalAndSendMessage obj="+sessionDescription+"\n");
					_own.pc.setLocalDescription(
							sessionDescription, 
							function() {console.log("+++onSetSessionDescriptionSuccess.");
								_own.mObserver.onReceiveMessageFromStunServer(_own, _own.pc.localDescription.type, _own.pc.localDescription.sdp);
							},
							function(error) {console.log("+++onSetSessionDescriptionError" + error.toString());}
					);
				});
		return this;
	};

	Caller.prototype.createAnswer = function () {
		console.log("+++createAnsert()\n");
		var _own = this;
		this.pc.createAnswer(
				function _onSetLocalAndMessage (sessionDescription) {
					console.log("+++setLocalAndSendMessage obj="+sessionDescription+"\n");
					_own.pc.setLocalDescription(
							sessionDescription, 
							function() {
								console.log("+++onSetSessionDescriptionSuccess.");
								_own.mObserver.onReceiveMessageFromStunServer(_own, _own.pc.localDescription.type, _own.pc.localDescription.sdp);
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
		console.log("+++sendHello()"+message+"\n");
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

	Caller.prototype.setChannelEvents = _setChannelEvents;
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



function _setChannelEvents() {
	console.log("+++setChannelEvent()\n");
	var _own = this;
	this.mDataChannel.onmessage = function(event) {
		_own.mObserver.onReceiveMessage(_own, event.data);
	};
	this.mDataChannel.onopen = function(event) {
		console.log("onopen:"+event);
	};
	this.mDataChannel.onerror = function(error) {
		console.log("onerror:"+JSON.parse(error));
	};
	this.mDataChannel.onclose = function(error) {
		console.log("onclose:"+JSON.parse(error));
	};
}

try{module.exports = Caller;}catch(e){}
