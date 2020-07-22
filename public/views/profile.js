"use strict"

function getTemplate(){
    var template = `
        <div id="profile">
            <div class="profile-header">
            <a onclick="window.router.loadRoute('chat')" class="profile-header__link" ><img class="tap-bar__icon" src='../icons/back.svg'></a>
            </div>
            <div class="profile-info center">
                <img src="https://source.unsplash.com/collection/787231/200x200" alt="" class="profile-img">
                <div class="profile-name"><p id="username">${window.user.name}</p><img id='username-edit' class="edit-icon" src='../icons/pencil.svg'></div> 
                <p class="profile-code" id="usercode">${window.user.code}</p>
            </div>
            <div class="center">
                <button class="button">Share Code</button>
            </div>
        </div>
        `
    return template
}


export {getTemplate}