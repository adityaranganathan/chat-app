"use strict"

import {getTemplate as getChatTemplate} from './views/chat.js'
import {setupChatUI} from './views/chatUI.js'
import {getTemplate as getMessengerTemplate} from './views/messenger.js'
import {setupMessengerUI} from './views/messengerUI.js'
import {getTemplate as getProfileTemplate} from './views/profile.js'
import {setupProfileUI} from './views/profileUI.js'

var routes = {
'chat':{
    templateName: 'chat',
    default: true,
    template: getChatTemplate,
    script: setupChatUI
},
'messenger':{
    templateName: 'messenger',
    default: false,
    template: getMessengerTemplate,
    script: setupMessengerUI
},
'profile':{
    templateName: 'profile',
    default: false,
    template: getProfileTemplate,
    script: setupProfileUI
}
}


export {routes}