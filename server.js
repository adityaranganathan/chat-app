"use strict";
const fs = require('fs');
const { COPYFILE_FICLONE } = fs.constants;

if(process.argv[2] == 'production'){
  fs.copyFileSync('config/prodClientConfig.js', 'public/EnvironmentConfig.js', COPYFILE_FICLONE);
  console.log('prodClientConfig.js was copied to public');
  var serverConfig = require('./config/prodServerConfig.js');
}
else{
  fs.copyFileSync('config/devClientConfig.js', 'public/EnvironmentConfig.js', COPYFILE_FICLONE);
  console.log('devClientConfig.js was copied to public');
  var serverConfig = require('./config/devServerConfig.js');
}

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)

const port = serverConfig.port
console.log(port)
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


server.listen(port, () => console.log(`Socket server Running at port ${port}`))
