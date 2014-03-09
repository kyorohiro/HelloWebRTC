function CallerInfo() {
	this.list = new Array();
	CallerInfo.prototype.add = _add;
	CallerInfo.prototype.get = _get;
	CallerInfo.prototype.show = function() {
		for(key in this.list) {
			var v = this.list[key];
			console.log("["+key+"]="+v.type+","+v.sdp+","+v.name+","+v.socket+",")
		}
	};
	CallerInfo.prototype.keys = function() {
		var _ret = [];
		for(key in this.list) {
			_ret.push(""+key);
		}
		return _ret;
	};

}

function _add(uuid, sdp) {
	var v = {};
	v.uuid = uuid;
	v.sdp = sdp;
	this.list[uuid] = v;
}

function _get(uuid) {
	return this.list[uuid];
}
//module.exports = UserInfo;