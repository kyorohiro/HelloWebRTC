var assert = require("assert")
var UserInfo = require("./userinfo.njs")

var info = new UserInfo();
info.add("xx", "socket");
assert.equal(info.get("xx").socket, "socket");
assert.equal(0, 0);
