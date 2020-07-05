"use strict"

export var socket_server = undefined
export var socket = io.connect();
axios.defaults.baseURL = 'http://localhost:3000'

console.log("Setting Development Config")