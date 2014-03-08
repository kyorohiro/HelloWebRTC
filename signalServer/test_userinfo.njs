var assert = require("assert")
var UserInfo = require("./userinfo.njs")

var info = new UserInfo();
info.add("xx", "sdp");
assert.equal(info.get("xx").sdp, "sdp");
assert.equal(0, 0);
