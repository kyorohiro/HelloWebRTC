function CallerInfo() {
	this.list = new Array();
	CallerInfo.prototype.add = function(uuid, caller) {
		var v = {};
		v.uuid = uuid;
		v.caller = caller;
		this.list[uuid] = v;
	};

	CallerInfo.prototype.create = function(myUuid, targetUuid) {
	    var _caller = new Caller(myUuid);
	    this.add(targetUuid, _caller);
		return _caller;
	};

	CallerInfo.prototype.get = function(uuid) {
		return this.list[uuid];
	};

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
