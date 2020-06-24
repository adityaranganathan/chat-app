// "use strict"
import {getRandomUsername} from './utils.js';
import {socket_server} from './environmentConfig.js';

var socket = io();
if(socket_server){
    console.log("Setting Prod Socket config")
    socket = io.connect('http://chat.aditya-r.com:8000');
}

var username = getRandomUsername()
var usernameBanner = document.getElementById('username')
usernameBanner.textContent = username
usernameBanner.addEventListener('input', updateUsername)

var messageList = document.getElementById('message-list')
var messageForm = document.getElementById('messageForm')
var messageInput = document.getElementById('messageInput')

messageForm.addEventListener('submit', OnMessageSubmit)

socket.emit('joinRoom', {username})
socket.on('newMsg', outputMsg)

function OnMessageSubmit(evt){
    
    evt.preventDefault();
    let msgText = evt.target.elements.messageInput.value

    let date = new Date()
    let time = new Date().toLocaleTimeString()
    socket.emit('newMsg', {username, msgText, time})
    
    evt.target.elements.messageInput.value = '';
}

function outputMsg(msg){
    let li = document.createElement('li')
    li.classList.add('message')
    li.innerHTML = `<p class="user">${msg.username}<span class="time">${msg.time}</span></p>
                    <p class="text">${msg.msgText}</p>`
    messageList.appendChild(li);
    messageList.scrollTop = messageList.scrollHeight;
}

function updateUsername(){
    let newUsername = usernameBanner.textContent
    socket.emit('editUsername', {newUsername})
    username = newUsername
}