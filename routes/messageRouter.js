"use strict"

const express = require('express')
const assert = require('assert');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';
const dbName = 'chatApp';
var db;
var messages;

const client = new MongoClient(url);

client.connect(function(err) {
    assert.equal(null, err);
    console.log(`Connected successfully to Database - ${dbName}`);
    db = client.db(dbName);
    messages = db.collection('messages');
});

const messageRouter = express.Router();
messageRouter.use(express.json())

messageRouter.route('/')
.get((req, res, next) => {
    console.log("GET /messages")
    messages.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        res.send(docs)
      });
})
.post((req, res, next) => {
    res.statusCode = 403
    res.end('POST not supported on /messages')
})
.put( (req, res, next) => {
    res.statusCode = 403
    res.end('PUT not supported on /messages')
})
.delete( (req, res, next) => {
    res.statusCode = 403
    res.end('DELETE not supported on /messages')
});


messageRouter.route('/:conversationCode')
.get((req, res, next) => {
    console.log(`GET /messages/${req.params.conversationCode}`)
    messages.findOne({'conversationCode': parseInt(req.params.conversationCode)}, function(err, document) {
        assert.equal(err, null);
        // console.log("Found the following record");
        // console.log(document)
        res.send(document)
      });
})
.post((req, res, next) => {
    res.statusCode = 403
    res.end(`POST not supported on /messages/${req.params.conversationCode}`)
})
.patch((req, res, next) => {
    console.log(`PATCH /messages/${req.params.conversationCode}`)
    // console.log(req.body);
    // delete req.body.message.conversationCode;
    // delete req.body.message.conversationType;
    // console.log(req.body.message)
    // messages.findOneAndUpdate({'conversationCode': parseInt(req.params.conversationCode), 'conversationType': req.params.conversationType},
    //                          {$push: {'messages': req.body.message}} , function(err, document) {
    //     assert.equal(err, null);
    //     // console.log("Patching the following record");
    //     // console.log(document)
    //     res.send(document)
    //   });
        
})

function insertMessage(msg){

    let conversationCode = parseInt(msg.conversationCode);
    let conversationType = msg.conversationType;
    delete msg.conversationType;
    delete msg.conversationCode;
    messages.findOneAndUpdate({'conversationCode': conversationCode, 'conversationType': conversationType},
                             {$push: {'messages': msg}},{upsert:true},function(err, document) {
        assert.equal(err, null);
        // console.log("Inserted ", document)
        });
}

module.exports.messageRouter = messageRouter;
module.exports.insertMessage = insertMessage;