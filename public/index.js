"use strict"

import {socket} from './environmentConfig.js';
import {User} from './user.js';
import {ContactManager} from './contactManager.js';
import {MessageHandler} from './messageHandler.js';
import {Router} from './Router.js';
import {routes} from './routes.js'

async function init(){
    console.log("Creating User")
    window.user = new User();
    await window.user.initialiseUser();

    console.log("Creating ContactManager")
    window.contactManager = new ContactManager()
    await window.contactManager.getContacts();

    console.log("Creating MessageHandler")
    window.messageHandler = new MessageHandler()
    await window.messageHandler.loadMessages();

    console.log("Creating Router")
    window.router = new Router(routes);
    window.router.loadDefault();
}

init();

socket.on('newMsg', (msg) => window.messageHandler.pushMsg.call(window.messageHandler, msg))



