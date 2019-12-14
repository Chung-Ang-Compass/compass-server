var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.argv[2] || 3000;
var mysql = require('mysql');

