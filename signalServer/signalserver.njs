var HTTP = require('http');
var WSServer = require('websocket').server;
var Fs = require('fs');
var UserInfo = require("./userinfo.njs");
var UUID = require("./uuid.njs");

var SignalServer = function SignalServer() {
	this.mHttpServer = null;
	this.mWsserverSocket = null;	
	this.mUserInfos = new UserInfo();

	SignalServer.prototype.startServer = function(host, port) {
		this.mHttpServer = HTTP.createServer(function (req, res) {
			console.log("onRequest="+req.url);
			try {
				var path = req.url.substring(1);
				var file = Fs.readFileSync(path);
				res.writeHead(200, {'Content-Type': 'text/html'});
				if("sample.html" ===  path) {
					file = String(file).replace("uuid_value", UUID.getId());
				}
				res.end(file);
			} catch(e) {
				console.log(""+e);
			}
		}).listen(port, host);
		console.log("Server running at http://"+host+":"+port);
	};

	SignalServer.prototype.startWSServer = function() {
		var _own = this;
		this.mWsserverSocket = new WSServer({httpServer: this.mHttpServer});
		this.mWsserverSocket.on('request', function(req){
			console.log("on:"+req);
			var websocket = req.accept(null, req.origin);
			websocket.on('message', function(mes) {
				console.log("mes:"+mes.utf8Data);
				var type = JSON.parse(mes.utf8Data)["_type"];
				var sdp = JSON.parse(mes.utf8Data)["_sdp"];
				var myuuid = JSON.parse(mes.utf8Data)["_uuid"];
				var touuid = JSON.parse(mes.utf8Data)["_touuid"];
				console.log("type:"+type);
				console.log("sdp:"+sdp);
				console.log("uuid:"+myuuid);
				if(type === "offer") {
					_own.mUserInfos.add(myuuid, sdp, "name", websocket)
					var v = {}
					v["_type"] = type;
					v["_sdp"] = sdp;
					v["_uuid"] = myuuid;
					v["_touuid"] = touuid;
					//
					_own.uniMessage(touuid, JSON.stringify(v));
				} else if(type =="answer"){
					var v = {}
					v["_type"] = type;
					v["_sdp"] = sdp;
					v["_uuid"] = myuuid;
					_own.uniMessage(touuid, JSON.stringify(v));
				} else if(type =="join"){
					_own.mUserInfos.add(myuuid, "sdp", "name", websocket);
					var v = {}
					v["_type"] = "join";
					v["_uuid"] = myuuid;
					v["_name"] = "name";
					_own.broadcastMessage(JSON.stringify(v));
				} 
			});
		});
	};

	SignalServer.prototype.broadcastMessage = function(_message) {
		console.log("----broadcast----");
		this.mUserInfos.show();
		var keys = this.mUserInfos.keys();
		while(keys.length != 0) {
			var key = keys.pop();
			var socket = this.mUserInfos.get(key)["socket"];
			socket.send(_message);
			console.log(_message);
		}
		console.log("----//broadcast-----");
	}

	SignalServer.prototype.uniMessage = function(touuid,_message) {
		console.log("----uni----"+touuid);
		try {
			var socket = this.mUserInfos.get(touuid)["socket"];
			socket.send(_message);
			console.log(_message);
		} catch(e) {
			console.log(e);
		}
		console.log("----//uni-----");
	}

};

module.exports = SignalServer;
