"user strict"

import {socket} from './environmentConfig.js';
import { ContactManager } from "./contactManager.js";
import { MessageHandler } from './messageHandler.js';

class User{

    constructor(){
        this.name = "";
        this.nameBanner = document.getElementById('username');
        this.editButton = document.getElementById('username-edit')
        this.editButton.addEventListener('click', () => this.updateUsername.call(this));
        this.code = parseInt(localStorage.getItem('userCode'));
        this.codeBanner = document.getElementById('usercode')
        this.contactManager = new ContactManager(this);
        this.messageHandler = new MessageHandler(this);
    }

    async initialiseUser(){

        if(this.code){
            await this.getUserInfo();
        }
        else{
            await this.postNewUser();
        }
        this.contactManager.getContacts();
        socket.emit('join', {'username': this.name, 'userCode': this.code.toString()})
    }

    async postNewUser(){
        await axios.post('/contacts', {'contactType': 'user'})
            .then(res => {
                localStorage.setItem('userCode',  res.data['contactCode']);
                this.code = parseInt(res.data['contactCode']);
                this.updateDisplayElements(res.data);
            })
            .catch(err => console.log(err))
    }


    async getUserInfo(callback = null){

        await axios.get(`/contacts/${this.code}`)
            .then(res => {
                this.updateDisplayElements(res.data);
            })
            .catch(err => console.log(err));
    }

    updateDisplayElements(data){
        this.name = data['contactName'];
        this.nameBanner.textContent = this.name;
        this.codeBanner.textContent = this.code;      
    }

    patchUserInfo(data){
        axios.patch(`contacts/${this.code}`, data)
        .then(res => {
            this.getUserInfo();
        })
        .catch(err => console.log(err))
    }

    updateUsername(){

        let newUsername = prompt("Enter new name:");
        let newData = {'contactName':newUsername};
        this.patchUserInfo(newData);
    }

}


export {User};