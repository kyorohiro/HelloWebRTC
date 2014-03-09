function CallerInfo() {
	this.list = new Array();
	CallerInfo.prototype.add = _add;
	CallerInfo.prototype.get = _get;
	CallerInfo.prototype.show = function() {
		for(key in this.list) {
			var v = this.list[key];
			console.log("["+key+"]=");
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

function _add(uuid, caller) {
	var v = {};
	v.uuid = uuid;
	v.caller = caller;
	this.list[uuid] = v;
}

function _get(uuid) {
	return this.list[uuid];
}

//module.exports = UserInfo;