var HTTP = require('http');
var WSServer = require('websocket').server;
var Fs = require('fs');
var UserInfo = require("./userinfo.njs");
var UUID = require("./uuid.njs");

var SignalServer = function SignalServer() {
	this.httpServer = null;
	this.wsserverSocket = null;	
	this.userInfos = new UserInfo();

	SignalServer.prototype.startServer = function(host, port) {
		this.httpServer = HTTP.createServer(function (req, res) {
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
		this.wsserverSocket = new WSServer({httpServer: this.httpServer});
		this.wsserverSocket.on('request', function(req){
			console.log("on:"+req);
			var websocket = req.accept(null, req.origin);
			websocket.on('message', function(mes) {
				console.log("mes:"+mes.utf8Data);
				var type = JSON.parse(mes.utf8Data)["_type"];
				var sdp = JSON.parse(mes.utf8Data)["_sdp"];
				var uuid = JSON.parse(mes.utf8Data)["_uuid"];
				console.log("type:"+type);
				console.log("sdp:"+sdp);
				console.log("uuid:"+uuid);
				_own.userInfos.add(uuid, sdp, "name", websocket)
				var v = {}
				v["_type"] = type;
				v["_sdp"] = sdp;
				v["uuid"] = uuid;
				_own.broadcastOffer(JSON.stringify(v));
			});
		});
	};

	SignalServer.prototype.broadcastOffer = function(_message) {
		console.log("----broadcast-----");
		this.userInfos.show();
		var keys = this.userInfos.keys();
		while(keys.length != 0) {
			var key = keys.pop();
			var socket = this.userInfos.get(key)["socket"];
			socket.send(_message);
			console.log(_message);
		}
		console.log("----//broadcast-----");
	}
};

module.exports = SignalServer;
