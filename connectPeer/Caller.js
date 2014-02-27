
// new Caller
function Caller() {
    this.pc = null;
    this.pcConfig = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
    this.pcConstraints = {"optional": []};
    this.mOutputLocalSDP = "";

    Caller.prototype.createPeerConnection = _createPeerConnection;
    Caller.prototype.createOffer = _createOffer;
    Caller.prototype.setLocalSDP = _setLocalSDP;
    arguments.callee.iceType = _iceCandidateType;
};

function _setLocalSDP(output) {
    this.mOutputLocalSDP = output;
}

function _createOffer() {
    var _pc = this.pc;
    this.pc.createOffer(
	function _onSetLocalAndMessage (sessionDescription) {
	    console.log("+++setLocalAndSendMessage obj="+sessionDescription+"\n");
	    _pc.setLocalDescription(
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
	var _own = this;
        this.pc.onicecandidate = function (event) {//RTCIceCandidateEvent
	    console.log("+onIceCandidate("+event+","+event.candidate+") 00");
	    if(!event.candidate) {
		console.log("------------sdp-----"+Caller.iceType(_own.pc.localDescription.sdp)+"-----\n");
		console.log(""+_own.pc.localDescription.sdp);
		//var t = document.getElementById("sdp");
		//t.value = _pc.localDescription.sdp;
		_own.mOutputLocalSDP.value = _own.pc.localDescription.sdp;
		console.log("------------sdp----------\n");
	    }
	};
        this.pc.onaddstream = function (event) {console.log("+++onRemoteStreamAdd("+event+"\n");};
        this.pc.onremovestream = function (event) {console.log("+++onRemoteStreamRemoved("+event+"\n");};
        this.pc.onsignalingstatechange = function (event) {console.log("+++onSignalingChanged("+event+"\n");};
        this.pc.oniceconnectionstatechange = function (event) {console.log("+++onIceConnectionStateChanged("+event+"\n");};
    } catch (e) {
	alert("can not create peer connection."+e+"");
    }
}





