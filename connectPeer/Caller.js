

// new Caller
function Caller() {
    this.pc = null;
    this.pcConfig = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
    this.pcConstraints = { 'optional': [{'DtlsSrtpKeyAgreement': true}, {'RtpDataChannels': true }] };
    this.mOutputLocalSDP = "";
    this.mOutputRemoteSDP = "";
    this.mDataChannel = null;

    Caller.prototype.createPeerConnection = _createPeerConnection;
    Caller.prototype.createOffer = _createOffer;
    Caller.prototype.createAnswer = _createAnswer;
    Caller.prototype.setOutputLocalSDP = _setLocalSDPBuffer;
    Caller.prototype.setOutputRemoteSDP = _setRemoteSDPBuffer;
    Caller.prototype.sendHello = _sendHello;
    Caller.prototype.setRemoteSDP = _setRemoteSDP;

    arguments.callee.iceType = _iceCandidateType;
};

function _setRemoteSDP(_type, _sdp) {
    console.log("+++setRemoteSDP()"+_type+","+_sdp+"\n");
    var sd = new RTCSessionDescription();
    sd.type = _type;
    sd.sdp = _sdp;//othis.mOutputRemoteSDP.value;
    this.pc.setRemoteDescription(sd);
}

function _sendHello() {
    console.log("+++sendHello()\n");
    this.mDataChannel.send("hello");
}

function _setLocalSDPBuffer(output) {
    this.mOutputLocalSDP = output;
}

function _setRemoteSDPBuffer(output) {
    this.mOutputRemoteSDP = output;
}

function _createAnswer() {
    console.log("+++createAnsert()"+this.mOutputRemoteSDP.value+"\n");
    var _own = this;
    var sd = new RTCSessionDescription();
    sd.type = "offer";
    sd.sdp = this.mOutputRemoteSDP.value;
    this.pc.setRemoteDescription(sd);
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
}

function _createOffer() {
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

function _iceCandidateType(candidateSDP) {
    if (candidateSDP.indexOf("typ relay ") >= 0) 
	return "TURN";
    if (candidateSDP.indexOf("typ srflx ") >= 0)
	return "STUN";
    if (candidateSDP.indexOf("typ host ") >= 0)
	return "HOST";
    return "UNKNOWN";
}

function _createPeerConnection() {
    try {
        console.log("+++create peer connection");
        this.pc = new webkitRTCPeerConnection(this.pcConfig, this.pcConstraints);
	this.mDataChannel = this.pc.createDataChannel('channel',{});
	this.mDataChannel.onmessage = function(event) {
            console.log("onmessage:"+event);
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
	var _own = this;
        this.pc.onicecandidate = function (event) {//RTCIceCandidateEvent
	    console.log("+onIceCandidate("+event+","+event.candidate+") 00");
	    if(!event.candidate) {
		console.log("------------sdp-----"+Caller.iceType(_own.pc.localDescription.sdp)+"-----\n");
		console.log(""+_own.pc.localDescription.sdp);
		_own.mOutputLocalSDP.value = _own.pc.localDescription.sdp;
		console.log("------------sdp----------\n");
	    }
	};
        this.pc.onaddstream = function (event) {console.log("+++onRemoteStreamAdd("+event+"\n");};
        this.pc.onremovestream = function (event) {console.log("+++onRemoteStreamRemoved("+event+"\n");};
        this.pc.onsignalingstatechange = function (event) {console.log("+++onSignalingChanged("+event+"\n");};
        this.pc.oniceconnectionstatechange = function (event) {console.log("+++onIceConnectionStateChanged("+event+"\n");};
        this.pc.ondatachannel = function(event) {
		console.log("--ondatachannel-\n");
	};
    } catch (e) {
	alert("can not create peer connection."+e+"");
    }
}

