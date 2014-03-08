function UserInfo() {
	this.list = new Array();
	UserInfo.prototype.add = _add;
	UserInfo.prototype.get = _get;
}

function _add(uuid, sdp, name) {
	var v = {};
	v.sdp = sdp;
	v.name = name;
	this.list[uuid] = v;
}

function _get(uuid) {
	return this.list[uuid];
}
module.exports = UserInfo;