"use strict"


class MessengerUI{
    constructor(){
        // this.contactsList = document.getElementById('contactWrapper');
        // this.addContactButton = document.getElementById('addContact');
        // this.initialise();
        this.messageList = document.getElementById('message-list')
        this.messageForm = document.getElementById('messageForm')
        this.initialise();
    }

    initialise(){
        this.messageForm.addEventListener('submit', (evt) => window.messageHandler.sendMsg.call(window.messageHandler, evt))
        this.load();
    }

    load(){
        console.log("Loading messages")
        this.loadMessages();   
    }

    async loadMessages(){

        let conversationCode = window.contactManager.conversationCode;
        var data;
        await axios.get(`messages/${conversationCode}`)
            .then(res => {
                data = res.data;
                // console.log("Got data")
                // console.log(data)
            })

        var messages = data.messages;
        if(messages){
            this.messageList.textContent = ''
            for(let message of messages){
                // console.log("Message from server");
                // console.log(message)
                this.createMessage(message)
            }
            // this.scroll();
            
        }
        else{
            // console.log("No messages found")
            this.messageList.textContent = ''
        }
        
    }

    scroll(){
        // console.log(this);
        this.messageList.scrollTop = this.messageList.scrollHeight;
    }

    createMessage(message){


        let li = document.createElement('li')
        li.classList.add('message')
        // console.log(message.fromCode);
        if(message.fromCode == window.user.code){
            li.classList.add('sent')
        }
        else{
            li.classList.add('received')
        }
        li.innerHTML = `<p class="user">${message.fromName}<span class="time">${message.time}</span></p>
                        <p class="text">${message.text}</p>`
        this.messageList.appendChild(li);
        // console.log("gna scroll");
        // console.log(this);
        this.scroll();
        
    }

    

}

function setupMessengerUI(){
    let newMessengerUI = new MessengerUI()
    window.messengerUI = newMessengerUI
}

export {setupMessengerUI};