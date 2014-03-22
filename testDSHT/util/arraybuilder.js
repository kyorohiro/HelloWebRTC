function ArrayBuilder() {
	this.mBuffer = new ArrayBuffer(1024);
	this.mLength = 0;

	this.appendText = function(text) {
		this.update(text.length);
		for(var i=0;i<text.length;i++) {
			this.mBuffer[this.mLength] = text.charCodeAt(i);
			this.mLength++;
		}
	};

	this.update = function(appendLength) {
		if(this.mBuffer.byteLength < (appendLength+this.mLength)) {
			var next = new ArrayBuffer(this.mLength*2);
			next.mLength = (appendLength+this.mLength);
			for(var i=0;i<next.mLength;i++) {
				next[i] = this.mBuffer[i];
			}
			this.mBuffer = next;
			next = null;
		}
	}

	this.getLength = function() {
		return this.mLength;
	}
}

try{module.exports = ArrayBuilder;}catch(e){;}