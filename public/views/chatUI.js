"use strict"


class ChatUI{
    constructor(){
        this.contactsList = document.getElementById('contactWrapper');
        this.addContactButton = document.getElementById('addContact');
        this.contactsUIElements = {}
        this.initialise();
    }

    initialise(){
        this.addContactButton.addEventListener('click', (evt) => this.addContact.call(this, evt));
        this.load();
    }

    load(){
        this.contactsList.innerHTML = '';
        console.log("Loading contacts")
        for(let contact of window.contactManager.contacts){
            this.pushContact(contact)
        }
    }

    pushContact(contactInfo){

        let conversationCode = window.contactManager.getConversationCode(contactInfo);
        let allMessages = window.messageHandler.conversations[conversationCode];
        let lastMessage = {'time':'', 'text':''};
        if(allMessages && allMessages.length > 0){
            lastMessage = allMessages[allMessages.length - 1];
        }
        console.log(lastMessage);
        var li = document.createElement('li')
        li.classList.add('contact__list')
        li.innerHTML = `<img src="https://source.unsplash.com/collection/787231/200x200" alt="" class="contact__img">
                        <div class="contact__info">
                          <p class="contact__name">${contactInfo.contactName}<span class="contact__time">${lastMessage.time}</span></p> 
                          <p class="contact__msg">${lastMessage.text}</p>
                        </div>`

        li.dataset.conversationCode = conversationCode;
        // console.log(window.contactManager.getConversationCode(contactInfo));
        li.addEventListener('click', (evt) => window.contactManager.onContactClick.call(window.contactManager, contactInfo, evt));
        this.contactsUIElements[conversationCode] = li;
        this.contactsList.appendChild(li);
    }   

    updateLastMessage(message){
        this.contactsUIElements[message.conversationCode].querySelector(".contact__time").textContent = message.time;
        this.contactsUIElements[message.conversationCode].querySelector(".contact__msg").textContent = message.text;
        this.contactsUIElements[message.conversationCode].classList.add("unread");
        console.log(this.contactsUIElements[message.conversationCode].querySelector(".contact__time"))
    }
    

    addContact(evt){
        evt.preventDefault();
        let newContactCode = prompt("Enter contact code:");

        window.contactManager.addContact(parseInt(newContactCode));
    }

}

function setupChatUI(){
    let newChatUI = new ChatUI()
    window.chatUI = newChatUI
}

export {setupChatUI};