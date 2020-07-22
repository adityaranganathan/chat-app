"use strict"

import {socket} from './environmentConfig.js';

class User{

    constructor(){
        this.name = null;
        this.code = parseInt(localStorage.getItem('userCode'));
    }

    async initialiseUser(){

        if(this.code){
            await this.getUserInfo();
        }
        else{
            await this.postNewUser();
        }
        socket.emit('join', {'username': this.name, 'userCode': this.code.toString()})
    }

    async postNewUser(){
        await axios.post('/contacts', {'contactType': 'user'})
            .then(res => {
                localStorage.setItem('userCode',  res.data['contactCode']);
                this.code = parseInt(res.data['contactCode']);
                this.updateData(res.data);
            })
            .catch(err => console.log(err))
    }

    async getUserInfo(){

        await axios.get(`/contacts/${this.code}`)
            .then(res => {
                this.updateData(res.data);
            })
            .catch(err => console.log(err));
    }

    updateData(data){
        this.name = data['contactName']
        console.log("Updated user data")
        if(window.profileUI){
            window.profileUI.load();
        }
    }

    patchUserInfo(data){
        axios.patch(`contacts/${this.code}`, data)
        .then(res => {
            console.log("Patch Successful")
            this.getUserInfo();
        })
        .catch(err => console.log(err))
    }

}


export {User};