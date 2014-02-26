var pcConfig = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
var pcConstraints = {"optional": []};

var pc;
//
// PeerConnectionを作る
createPeerConnection();

//
// STUNに接続する。SDPを生成する。
pc.createOffer(setLocalAndSendMessage, onCreateSessionDescriptionError);



function iceCandidateType(candidateSDP) {
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

function onIceCandidate(event) {//RTCIceCandidateEvent
    console.log("+onIceCandidate("+event+","+event.candidate+") 00");
    if(!event.candidate) {
	console.log("------------sdp----------\n");
	console.log(""+pc.localDescription.sdp);
	console.log("------------sdp----------\n");
    }
}

function onRemoteStreamAdded(event) {
    console.log("+++onRemoteStreamAdd("+event+"\n");
}

function onRemoteStreamRemoved(event) {
    console.log("+++onRemoteStreamRemoved("+event+"\n");
}

function onSignalingStateChanged(event) {
    console.log("+++onSignalingChanged("+event+"\n");
}

function onIceConnectionStateChanged(event) {
    console.log("+++onIceConnectionStateChanged("+event+"\n");
}

function createPeerConnection() {
    try {
        console.log("+++create peer connection");
        pc = new webkitRTCPeerConnection(pcConfig, pcConstraints);
        pc.onicecandidate = onIceCandidate;
        pc.onaddstream = onRemoteStreamAdded;
        pc.onremovestream = onRemoteStreamRemoved;
        pc.onsignalingstatechange = onSignalingStateChanged;
        pc.oniceconnectionstatechange = onIceConnectionStateChanged;
    } catch (e) {
	alert("can not create peer connection."+e+"");
    }
}

function onSetSessionDescriptionSuccess() {
    console.log("+++onSetSessionDescriptionSuccess.");
}

function onSetSessionDescriptionError(error) {
    console.log("+++onSetSessionDescriptionError" + error.toString());
}

function setLocalAndSendMessage(sessionDescription) {//
    console.log("+++setLocalAndSendMessage obj="+sessionDescription+"\n");
    pc.setLocalDescription(sessionDescription, onSetSessionDescriptionSuccess, onSetSessionDescriptionError);
}

function onCreateSessionDescriptionError(error) {
    console.log("+onCreateSessionDescriptionError("+error+"\n");
}
