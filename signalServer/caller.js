//new Caller
var Caller = function Caller(id) {
	this.pc = null;
	this.pcConfig = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
	this.pcConstraints = { 'optional': [{'DtlsSrtpKeyAgreement': true}, {'RtpDataChannels': true }] };
	this.mMyUUID = id;
	this.mTargetUUID = "";
	this.mOnReceiveSDP = null;
	this.mOutputRemoteSDP = "";
	this.mOutputMessage = "";
	this.mDataChannel = null;

	Caller.prototype.setTargetUUID = function(uuid) {
		this.mTargetUUID = uuid;
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
				console.log("+onIceCandidate("+event+","+event.candidate+") 00");
				if(!event.candidate) {
					console.log("------------sdp--"+_own.pc.localDescription.type+"---"+Caller.iceType(_own.pc.localDescription.sdp)+"-----\n");
					//console.log(""+_own.pc.localDescription.sdp);
					_own.mOnReceiveSDP(_own, _own.pc.localDescription.type, _own.pc.localDescription.sdp);
					console.log("------------sdp----------\n");
				}
			};
			this.pc.onaddstream = function (event) {console.log("+++onRemoteStreamAdd("+event+"\n");};
			this.pc.onremovestream = function (event) {console.log("+++onRemoteStreamRemoved("+event+"\n");};
			this.pc.onsignalingstatechange = function (event) {console.log("+++onSignalingChanged("+event+"\n");};
			this.pc.oniceconnectionstatechange = function (event) {console.log("+++onIceConnectionStateChanged("+event+"\n");};
			this.pc.ondatachannel = function(event) {
				console.log("--ondatachannel-\n");
				_own.mDataChannel = event.channel;
				_own.setChannelEvents();
			};
		} catch (e) {
			alert("can not create peer connection."+e+"");
		}
	};

	Caller.prototype.createOffer = function () {
		console.log("+++createOffer()\n");
		var _own = this;
		this.pc.createOffer(
				function _onSetLocalAndMessage (sessionDescription) {
					console.log("+++setLocalAndSendMessage obj="+sessionDescription+"\n");
					_own.pc.setLocalDescription(
							sessionDescription, 
							function() {console.log("+++onSetSessionDescriptionSuccess.");},
							function(error) {console.log("+++onSetSessionDescriptionError" + error.toString());},
							this.onSetLocalAndMessage,
							function (error) {console.log("+++onCreateSessionDescriptionError("+error+"\n");}
					);
				});
	};

	Caller.prototype.createAnswer = function () {
		console.log("+++createAnsert()\n");
		var _own = this;
		this.pc.createAnswer(
				function _onSetLocalAndMessage (sessionDescription) {
					console.log("+++setLocalAndSendMessage obj="+sessionDescription+"\n");
					_own.pc.setLocalDescription(
							sessionDescription, 
							function() {console.log("+++onSetSessionDescriptionSuccess.");},
							function(error) {console.log("+++onSetSessionDescriptionError" + error.toString());},
							this.onSetLocalAndMessage,
							function (error) {console.log("+++onCreateSessionDescriptionError("+error+"\n");}
					);});
	};

	Caller.prototype.setOnReceiveSDP = function (onMessage) {
		this.mOnReceiveSDP = onMessage;
	}

	Caller.prototype.setOutputRemoteSDP = _setRemoteSDPLogBuffer;
	Caller.prototype.setOutputMessage = _setMessageLogBuffer;
	Caller.prototype.sendHello = _sendHello;
	Caller.prototype.setRemoteSDP = function(_type, _sdp) {
		console.log("+++setRemoteSDP()"+_type+","+_sdp+"\n");
		var sd = new RTCSessionDescription();
		sd.type = _type;
		sd.sdp = _sdp;
		this.pc.setRemoteDescription(sd);
	};

	Caller.prototype.setChannelEvents = _setChannelEvents;
	arguments.callee.iceType = _iceCandidateType;
};


function _sendHello() {
	console.log("+++sendHello()\n");
	this.mDataChannel.send("hello");
}


function _setRemoteSDPLogBuffer(output) {
	this.mOutputRemoteSDP = output;
}

function _setMessageLogBuffer(output) {
	this.mOutputMessage = output;
}





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
		console.log("onmessage:"+event.data);
		_own.mOutputMessage.value = ""+event.data+"\n"+_own.mOutputMessage.value;
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
