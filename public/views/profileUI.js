"use strict"

console.log("ProfileUI Loaded")

class ProfileUI{

    constructor(){
        this.name = document.getElementById('username');
        this.editButton = document.getElementById('username-edit')
        this.code = document.getElementById('usercode')
        this.initialise()
    }

    initialise(){
        this.editButton.addEventListener('click', () => {this.updateUsername.call(this)});
        this.load();
    }

    load(){
        console.log(window.user)
        this.name.innerHTML = window.user.name || "PlaceholderName";
        this.code.textContent = window.user.code;
    }

    updateUsername(){
        console.log("Gna update username");
        let newUsername = prompt("Enter new name:");
        console.log(newUsername)
        let newUserData = {'contactName':newUsername};
        window.user.patchUserInfo(newUserData);
        this.load();
    }
}

function setupProfileUI(){
    let profileUI = new ProfileUI()
    window.profileUI = profileUI
}

export {setupProfileUI};