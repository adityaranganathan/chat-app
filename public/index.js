"use strict"

import {socket} from './environmentConfig.js';
import {User} from './user.js';


var user = new User();
user.initialiseUser();

socket.on('newMsg', (msg) => user.messageHandler.pushMsg.call(user.messageHandler, msg))