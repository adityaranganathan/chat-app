"use strict"

function getTemplate(){
  var template = `
  <div id="messenger">
            <div class="profile-header">
            <a onclick="window.router.loadRoute('chat')" class="profile-header__link" ><img class="tap-bar__icon" src='../icons/back.svg'></a>
            <div class="contact-name-wrapper"><p class="contact-name" >${window.contactManager.targetContactName}</p></div>
            </div>
            <ul id="message-list" class="messages">
              <!-- <li class="message sent">
                <p class="user">Brad<span class="time">9:12</span></p>
                <p class="text">This is a message very very very very long one though maybe it wont </p>
              </li> -->
            </ul>

            <div class="form-wrapper">
              <form id="messageForm" class="message-form">
                <input id="messageInput" autocomplete="off" placeholder="Type your message..." class="message-form__input"/>
                <button id="messageButton" class="chat-form__button"><img class="send-icon" src='../icons/send.svg'></button>
              </form>
            </div>
        </div>
      `
  return template;
}

export {getTemplate};