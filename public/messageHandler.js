"use strict"

import {socket} from './environmentConfig.js';

class MessageHandler{

    constructor(user){
        this.user = user;
        this.messageList = document.getElementById('message-list')
        this.messageForm = document.getElementById('messageForm')
        this.messageForm.addEventListener('submit', (evt) => this.sendMsg.call(this, evt))
    }

    sendMsg(evt){
    
        evt.preventDefault();
        let conversationCode = this.user.contactManager.conversationCode;
        let text = evt.target.elements.messageInput.value;
    
        let time = new Date().toLocaleTimeString();
        socket.emit('newMsg', { 'fromName': this.user.name, 
                                'fromCode': this.user.code,
                                'toCode': this.user.contactManager.targetContactCode, 
                                'toName': this.user.contactManager.targetContactName,
                                'conversationType': this.user.contactManager.targetContactType,
                                'conversationCode': conversationCode,
                                text,
                                time})
        
        evt.target.elements.messageInput.value = '';
    }

    pushMsg(msg){

        console.log("Got ", msg)

        if(msg.conversationCode == this.user.contactManager.conversationCode){
            let li = document.createElement('li')
            li.classList.add('message')
            li.innerHTML = `<p class="user">${msg.fromName}<span class="time">${msg.time}</span></p>
                            <p class="text">${msg.text}</p>`
            this.messageList.appendChild(li);
        }
        else{
            let chats = this.user.contactManager.contactsList.children;
            for(let chat of chats){
                if(chat.dataset.conversationCode == msg.conversationCode){
                    chat.classList.add('selected');
                    break;
                }
            }
        }
        this.messageList.scrollTop = this.messageList.scrollHeight;
    }

    async loadMessages(convCode){

        var data;
        await axios.get(`messages/${convCode}`)
            .then(res => {
                data = res.data;
            })

        // console.log(data)
        var messages = data.messages;
        if(messages){
            this.messageList.textContent = ''
            for(let message of messages){
        
                let li = document.createElement('li')
                li.classList.add('message')
                li.innerHTML = `<p class="user">${message.fromName}<span class="time">${message.time}</span></p>
                                <p class="text">${message.text}</p>`
                this.messageList.appendChild(li);
            }
            this.messageList.scrollTop = this.messageList.scrollHeight;
        }
        else{
            // console.log("No messages found")
            this.messageList.textContent = ''
        }
        
    }
}

export {MessageHandler};