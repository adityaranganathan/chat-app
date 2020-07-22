"use strict"

function getTemplate(){
  var template = `
    <div id="chat">
    <header>
      <h1 class='chat-heading'>Chat</h1>
        <!-- <form action="" id="addContactWrapper">
          <input id="ContactInput" type="text" autocomplete="off">
          <button>Add</button>
        </form> -->
    </header>

    <ul id="contactWrapper" class="contacts">
      <!-- <li class="contact__list">
        <img src="https://source.unsplash.com/collection/787231/200x200" alt="" class="contact__img">
        <div class="contact__info">
          <p class="contact__name">Sara Smith<span class="contact__time">9:32 AM</span></p> 
          <p class="contact__msg">What?</p>
        </div>
      </li> -->
    </ul>
    <footer class="tap-bar">  
      <a class="tap-bar__link" ><img class="tap-bar__icon" src='../icons/search.svg'></a>
      <a class="tap-bar__link" id="addContact" ><img class="tap-bar__icon" src='../icons/plus.svg'></a>
      <a class="tap-bar__link" onclick="router.loadRoute('profile')"><img class="tap-bar__icon" src='../icons/user.svg'></a>
    </footer>
    </div>
`
  return template
}

export {getTemplate}