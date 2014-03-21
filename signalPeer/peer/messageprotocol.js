

function MessageProtocol(target) {
	this.mParent = target;

	//---
	// p2p message
	//---

	// find peer
	this.sendFindNode = function (uuid) {
		var mes = {};
		mes.type = "query";
		mes.command = "findnode";
		mes.id = UUID.getId();
		mes.from = this.mParent.mUUID;
		mes.target = uuid;
		this.mParent.mPeerList.get(uuid).caller.sendMessage(JSON.stringify(mes));
	}

	//
	// 
	this.onRecvFindNode = function (caller, v) {
		var mes = {};
		mes.type = "response";
		mes.command = v.command;
		mes.id = v.id;
		this.mParent.mPeerList.keys();
		mes.node = {};
		mes.from = this.mParent.mUUID;
	    var keys = this.mParent.mPeerList.keys();
	    var i = 0;
	    while(keys.length != 0) {
	    	var key = keys.pop();
	    	mes.node["node"+i] = key;
	    	i += 1;
	    	if(i>=8) {
	    		break;
	    	}
	    }
	    mes.nodelen = i;
	    caller.sendMessage(JSON.stringify(mes));
	};

	// find peer
	this.sendMessage = function (uuid, message) {
		var mes = {};
		mes.type = "query";
		mes.command = "message";
		mes.id = UUID.getId();
		mes.from = this.mParent.mUUID;
		mes.target = uuid;
		mes.content = message;
		this.mParent.getPeerList().get(uuid).caller.sendMessage(JSON.stringify(mes));
	}
	// 
	this.sendOfferPeer = function() {
	};

	this.onRecvOfferPeer = function() {
	};

	this.sendAnswerPeer = function() {
	};

	this.onRecvAnswerPeer = function() {
	};
}

