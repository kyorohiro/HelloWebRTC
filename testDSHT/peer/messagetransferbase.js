
function MessageTransferBase(target) {
	this.mParent = target;

	MessageTransferBase.prototype.onReceiveMessage = function(caller,message) {
	};

	MessageTransferBase.prototype._sendUnicastMessage = function(transfer, to, from, content) {	
		console.log("======sendUnicastMessage :");
		console.log("===from      :" + from);
		console.log("===to        :" + to);
		console.log("===transfer  :" + transfer);
		var mes = {};
		mes.messageType = "unicast";
		mes.to = to;
		mes.from = from;
		mes.content = content;
		this.mParent.getPeerList().get(transfer).caller.sendMessage(JSON.stringify(mes));
	}

	MessageTransferBase.prototype.onTransferMessage = function(caller, message) {
	    var p2pMes = JSON.parse(message);

    	if("unicast" == p2pMes.messageType) {
    		console.log("======onTransferMessage:");
    		console.log("===from      :" + p2pMes.from);
    		console.log("===to        :" + p2pMes.to);
    		console.log("===transfer  :" + caller.getMyUUID());
    		console.log("===target    :" + caller.getTargetUUID());

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

