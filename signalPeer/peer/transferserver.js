
function MessageTransferServer(target) {
	this.mParent = target;

	MessageTransferServer.prototype.onReceiveMessage = function(caller,message) {
	};

	MessageTransferServer.prototype._sendUnicastMessage = function(transfer, to, from, content) {	
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
	MessageTransferServer.prototype.onTransferMessage = function(caller, message) {

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

