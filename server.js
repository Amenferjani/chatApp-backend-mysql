const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = require("./app");
const server = http.createServer(app);
const io = socketIO(server);

//!! ... (Configure and set up your Express app)

// io.on('connection', (socket) => {
//     console.log('A user connected');

//     //!!  Handle socket events here
//     socket.on('disconnect', () => {
//         console.log('A user disconnected');
//     });
// });

server.listen(3000, () => {
    console.log('starting the server.....');
});
module.exports = { app, server, io };
