"use strict"

const {getRandomID, getRandomUsername}  = require('../utils/utils.js')

const express = require('express')
const assert = require('assert');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';
const dbName = 'chatApp';
var db;
var contacts;
var globalRoom = {
    'contactType': 'room',
    'contactCode': 100000,
    'contactName': "Global",
    'contacts': []
}

const client = new MongoClient(url);

client.connect(function(err) {
    assert.equal(null, err);
    console.log(`Connected successfully to Database - ${dbName}`);
    db = client.db(dbName);
    contacts = db.collection('contacts');

    contacts.findOne({'contactCode': 100000}, function(err, document) {
        if(document === null){
            contacts.insertOne(globalRoom, (error, result) => {
                if(error) 
                    console.log(error)
            });
        }
      });
});

const contactRouter = express.Router();
contactRouter.use(express.json())

contactRouter.route('/')
.get((req, res, next) => {
    console.log("GET /contacts")
    contacts.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        // console.log("Found the following records");
        // console.log(docs)
        res.send(docs)
      });
})
.post((req, res, next) => {
    console.log('POST /contacts')
    console.log(req.body)

    req.body['contactCode'] = getRandomID();
    req.body['contactName'] = getRandomUsername();
    req.body['contacts'] = [100000];

    console.log("Sending JSON ", req.body)
    contacts.insertOne(req.body, (error, result) => {
        if(error)
            return res.status(500).send(error);
        res.statusCode = 200;
        res.send(...result.ops);
    });
})
.put( (req, res, next) => {
    res.statusCode = 403
    res.end('PUT not supported on /contacts')
})
.delete( (req, res, next) => {
    res.statusCode = 403
    res.end('DELETE not supported on /contacts')
});


contactRouter.route('/:contactCode')
.get((req, res, next) => {
    console.log(`GET /contacts/${req.params.contactCode}`)
    contacts.findOne({'contactCode': parseInt(req.params.contactCode)}, function(err, document) {
        assert.equal(err, null);
        // console.log("Found the following record");
        // console.log(document)
        res.send(document)
      });
})
.post((req, res, next) => {
    console.log(`POST /contacts/${req.params.contactCode}`)
    contacts.findOneAndReplace({'contactCode': parseInt(req.params.contactCode)}, req.body, function(err, document) {
        assert.equal(err, null);
        // console.log("Found the following record");
        // console.log(document)
        res.send(document)
      });
})
.patch((req, res, next) => {
    console.log(`PATCH /contacts/${req.params.contactCode}`)
    console.log(req.body.contactName)
    if(req.body.contactName !== undefined){
        contacts.findOneAndUpdate({'contactCode': parseInt(req.params.contactCode)}, {$set: {'contactName': req.body.contactName}} , function(err, document) {
            assert.equal(err, null);
            // console.log("Patching the following record");
            // console.log(document)
            res.send(document)
          });
    }
    else if(req.body.newContactCode !== undefined){
        req.body.newContactCode = parseInt(req.body.newContactCode)
        contacts.findOneAndUpdate({'contactCode': parseInt(req.params.contactCode)}, {$push: {'contacts': req.body.newContactCode}} , function(err, document) {
            assert.equal(err, null);
            // console.log("Patching the following record");
            // console.log(document)
            res.send(document)
          });
    }
    
})

module.exports = contactRouter