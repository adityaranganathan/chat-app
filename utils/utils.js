"use strict"

const assert = require('assert');

const ID_START = 100000
const ID_END = 999999
var IdsInUse = new Set()

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';
const dbName = 'chatApp';
const client = new MongoClient(url);

client.connect(function(err) {
    assert.equal(null, err);

    let db = client.db(dbName);
    let contacts = db.collection('contacts');

    contacts.find({}, { projection: { _id: 0, contactCode:  1}})
        .toArray(function(err, docs) {
            assert.equal(err, null);
            // console.log("Found the following IDs in contacts");
            // console.log(docs)
            
            docs.forEach((doc, index) => {
                IdsInUse.add(doc['contactCode'])
            })
            // console.log("Following Ids are in use.")
            // console.log(IdsInUse)
        })
    
    client.close()
});

function getRandomID(min=ID_START, max=ID_END) {

    while (true){
        var id = Math.floor(Math.random() * (max - min) ) + min;
        if(IdsInUse.has(id)){
            continue
        }
        IdsInUse.add(id)
        // console.log("Ids in use is now", IdsInUse)
        return id
    }
}

function getRandomUsername(){
    return 'Guest' + Math.round(Math.random()*1000)
}

module.exports.getRandomID = getRandomID
module.exports.getRandomUsername = getRandomUsername