"use strict";
const fs = require('fs');
const { COPYFILE_FICLONE } = fs.constants;

if(process.argv[2] == 'production'){
  fs.copyFileSync('config/prodConfig.js', 'public/EnvironmentConfig.js', COPYFILE_FICLONE);
  console.log('prodConfig.js was copied to public');
}
else{
  fs.copyFileSync('config/devConfig.js', 'public/EnvironmentConfig.js', COPYFILE_FICLONE);
  console.log('devConfig.js was copied to public');
}

var envConfig = require('./public/EnvironmentConfig.js');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)

const port = envConfig.server_port
app.use(express.static(__dirname + '/public'));
io.set('origins', '*:*');

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


server.listen(port, () => console.log('Socket server Running'))
