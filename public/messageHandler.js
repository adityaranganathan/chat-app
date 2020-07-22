"use strict"

import {socket} from './environmentConfig.js';

class MessageHandler{

    constructor(user){
       this.conversations = {};
    }

    async loadMessages(){

        let allContacts = window.contactManager.contacts;
        for(let contact of allContacts){

            await this.loadMessage(contact);
        }
    }

    async loadMessage(contact){

        let conversationCode = window.contactManager.getConversationCode(contact)
        console.log(`Gteting messages of ${conversationCode}`)
        console.log(`messages/${conversationCode.toString()}`)

        await axios.get(`messages/${conversationCode.toString()}`)
            .then(res => {
                this.conversations[parseInt(conversationCode)] = res.data.messages || [];
            })
    }

    appendMessage(conversationCode, message){
        console.log("After contact creation C")
        delete message.conversationCode;
        delete message.conversationType;
        this.conversations[conversationCode].push(message);
    }

    sendMsg(evt){
    
        evt.preventDefault();
        let conversationCode = window.contactManager.conversationCode;
        let text = evt.target.elements.messageInput.value;
    
        let time = new Date();
        time = time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        socket.emit('newMsg', { 'fromName': window.user.name, 
                                'fromCode': window.user.code,
                                'toCode': window.contactManager.targetContactCode, 
                                'toName': window.contactManager.targetContactName,
                                'conversationType': window.contactManager.targetContactType,
                                'conversationCode': conversationCode,
                                text,
                                time})
        
        evt.target.elements.messageInput.value = '';
    }

    async pushMsg(msg){

        console.log("Got ", msg)
        if(!(msg.conversationCode in this.conversations)){
            let newContactCode = msg.fromCode;
            await window.contactManager.addContact(parseInt(newContactCode));
            console.log("After contact creation B")
        }
        if(window.router.currentRoute == 'messenger' && msg.conversationCode == window.contactManager.conversationCode){
            window.messengerUI.createMessage(msg);
        }
        window.chatUI.updateLastMessage(msg);
        this.appendMessage(parseInt(msg.conversationCode), msg)
    }
}

export {MessageHandler};