function Bencode() {
	this.root = {};

	this._encode(_obj) {
		var builder = ArrayBuilder();
		this.__encode(_obj, builder)
		return builder;
	}
	this.__encode(_obj, builder) {
		builder.appendText("d");
		for(key in _obj) {
			builder.appendText(""+key.length+":"+__encode(_obj[jey],builder));
		}
		builder.appendText("e");
	}	
}