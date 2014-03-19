

function MessageTransfer(target) {
	this.mParent = target;

	this.sendUnicastMessage = function(to, from, content) {	
		var mes = {};
		mes.messageType = "unicast";
		mes.to = to;
		mes.from = from;
		mes.content = content;
		this.mPeerList.get(uuid).caller.sendMessage(JSON.stringify(mes));
	}

	this.onTransferMessage = function(caller, message) {
	    var p2pMes = JSON.parse(message);
    	var to = p2pMes.to;
    	var from = p2pMes.from;
    	var content = p2pMes.content;

    	if("unicast" == p2pMes.messageType) {
    		var mes = {};
    		mes.to = to;
    		mes.from = from;
    		mes.content = content;
    		mes.messageType = "message"; 
    		var targetPeer = this.mParen.get(to);
    		targetPeer.sendMessage(JSON.stringify(mes));
	    }
	}
}

