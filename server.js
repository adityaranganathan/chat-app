"use strict";

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)

const port = 3000
app.use(express.static(__dirname + '/public'));

const username = "OwlChatBot"

var users = {}

io.on('connection', (socket) => {

    socket.on('joinRoom', (data) => {

      let msgText = data.username + ' has joined the room'
      let time = new Date().toLocaleTimeString()
      socket.broadcast.emit('newMsg', {username, msgText, time})
      users[socket.id] = data.username
    });

    socket.on('editUsername', (data) => {
      users[socket.id] = data.newUsername
    });
    

    socket.on('newMsg', (msg) => {
        io.emit('newMsg', msg);
    });

    socket.on('disconnect', () => {
      let msgText = users[socket.id] + ' has left the room'
      let time = new Date().toLocaleTimeString()
      socket.broadcast.emit('newMsg', {username, msgText, time})
    });
});



server.listen(port, () => console.log('Example server Running'))
