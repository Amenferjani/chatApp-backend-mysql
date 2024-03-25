const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = require("./app");
const server = http.createServer(app);
const io = socketIO(server);


server.listen(3000, () => {
    console.log('starting the server.....');
});
module.exports = { app, server, io };
