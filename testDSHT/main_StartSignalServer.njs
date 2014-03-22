var SignalServer = require('./signal/signalserver.njs');

var _server = new SignalServer();
_server.startServer("127.0.0.1", 8080);
_server.startWSServer();
