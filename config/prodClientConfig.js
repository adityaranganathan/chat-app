"use strict"

export var socket_server = 'http://chat.aditya-r.com:8000'
export var socket = io.connect('http://chat.aditya-r.com:8000');
axios.defaults.baseURL = 'http://chat.aditya-r.com:8000'

console.log("Setting Production Config")
