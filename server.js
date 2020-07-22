"use strict";

const {configureEnvironment}  = require('./utils/configure.js')
const serverConfig = configureEnvironment(process.argv[2])

const contactRouter = require('./routes/contactRouter')
const { messageRouter, insertMessage} = require('./routes/messageRouter')

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}
app.use(allowCrossDomain);


app.use(express.static(__dirname + '/public'));
app.use('/contacts', contactRouter);
app.use('/messages', messageRouter);

// const username = "OwlChatBot"
var allSockets = {}
var allUsers = {}

io.set('origins', '*:*');
io.on('connection', (socket) => {

  socket.join('global')
  socket.on('join', (data) => {

    allSockets[socket.id] = data.userCode;
    allUsers[parseInt(data.userCode)] = socket.id;
    console.log(`${data.username}  has joined with socket id ${socket.id}`)
  });

  socket.on('newMsg', (newMsg) => {

    console.log("Recieived", newMsg.text, newMsg.toName.toLowerCase())
    if(newMsg.conversationType == 'room'){

      console.log(`Sending to ${newMsg.toName.toLowerCase()}`)
      io.to('global').emit('newMsg', newMsg); 
    }
    else if(newMsg.conversationType == 'user'){
        
      console.log(`Sending to ${allUsers[newMsg.fromCode]} and ${allUsers[newMsg.toCode]}`)
      io.to(allUsers[newMsg.fromCode]).emit('newMsg', newMsg);
      io.to(allUsers[newMsg.toCode]).emit('newMsg', newMsg);
    }
    insertMessage(newMsg);
  });

  socket.on('disconnect', () => {

    delete allUsers[allSockets[socket.id]]
    delete allSockets[socket.id];
    console.log(`currentConnections[socket.id]  has left`)
  });
});


server.listen(serverConfig.port, () => console.log(`Socket server Running at port ${serverConfig.port}`))
