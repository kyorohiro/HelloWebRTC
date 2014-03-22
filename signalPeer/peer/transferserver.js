
function MessageTransferServer(target) {
	this.mParent = target;
	this.mTransfer = null;

	this.mPeer = new (function() {
		this.onReceiveAnswer = function(v) {console.log("+++onReceiveAnswer()\n");}
		this.addIceCandidate = function(v) {console.log("+++addIceCandidate()\n");}
		this.startAnswerTransaction = function(v) {console.log("+++startAnswerTransaction()\n");}
		this.onJoinNetwork = function(v) {console.log("+++onJoinNetwork()\n");}
	});
	this.setPeer = function(peer) {
		this.mPeer = peer;
	};
	this.setTransfer = function(transfer) {
		this.mTransfer = transfer;
	};

	this.onReceiveMessage = function(caller,message) {
	};

	this.sendUnicastMessage = function(transfer, to, from, content) {	
		console.log("=======================sendUnicastMessage :"+to+","+from+","+transfer);
		var mes = {};
		mes.messageType = "unicast";
		mes.to = to;
		mes.from = from;
		mes.content = content;
		this.mParent.getPeerList().get(transfer).caller.sendMessage(JSON.stringify(mes));
	}

	//
	// static
	//
	this.onTransferMessage = function(caller, message) {

	    var p2pMes = JSON.parse(message);

    	if("unicast" == p2pMes.messageType) {
    		console.log("=======================onTransferMessage sv:");
    		console.log("===from      :" + p2pMes.from);
    		console.log("===to        :" + p2pMes.to);
    		console.log("===transfer  :" + caller.getMyUUID());
    		console.log("===target    :" + caller.getTargetUUID());

    		//this.setPeer(caller);
    		var mes = {};
    		mes.to = p2pMes.to;
    		mes.from = p2pMes.from;
    		mes.content = p2pMes.content;
    		mes.messageType = "transfer";
    		var targetPeer = this.mParent.getPeerList().get(p2pMes.to).caller;
    		targetPeer.sendMessage(JSON.stringify(mes));
	    }
    	else if("transfer" == p2pMes.messageType) {
    		this.onReceiveMessage(caller, p2pMes);
    	}
	}
}

