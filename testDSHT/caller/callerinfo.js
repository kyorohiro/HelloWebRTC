function CallerInfo() {
	this.list = new Array();
	CallerInfo.prototype.add = function(uuid, caller) {
		var v = {};
		v.uuid = uuid;
		v.caller = caller;
		this.list[uuid] = v;
	};

	CallerInfo.prototype.create = function(myUuid, targetUuid) {
		if(this.include(targetUuid)) {
			console.log("###################sssss:e"+targetUuid);
			return this.get(targetUuid);
		}
		else {
			console.log("###################sssss:d"+targetUuid);
			var _caller = new Caller(myUuid).setTargetUUID(targetUuid);
		    this.add(targetUuid, _caller);
			return _caller;
		}
	};

	CallerInfo.prototype.include = function(uuid) {
		for(key in this.list) {
			if(key == uuid) {
				return true;
			}
		}
		return false;
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
