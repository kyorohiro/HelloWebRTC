var assert = require("assert");
var ArrayBuilder = require('./util/arraybuilder.js');
var builder = new ArrayBuilder();

builder.appendText("hello");

assert.equal(5, builder.getLength());
