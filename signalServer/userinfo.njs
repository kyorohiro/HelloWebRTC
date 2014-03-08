function UserInfo() {
	this.list = new Array();
	UserInfo.prototype.add = _add;
	UserInfo.prototype.get = _get;
	UserInfo.prototype.show = function() {
		for(key in this.list) {
			var v = this.list[key];
			console.log("["+key+"]="+v.type+","+v.sdp+","+v.name+","+v.socket+",")
		}
	};
	UserInfo.prototype.keys = function() {
		var _ret = [];
		for(key in this.list) {
			_ret.push(""+key);
		}
		return _ret;
	};

}

function _add(uuid, sdp, name, socket) {
	var v = {};
	v.uuid = uuid;
	v.sdp = sdp;
	v.name = name;
	v.socket = socket;
	this.list[uuid] = v;
}

function _get(uuid) {
	return this.list[uuid];
}
module.exports = UserInfo;