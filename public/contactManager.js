"user strict"

class ContactManager{
    constructor(user){
        this.user = user;
        this.contacts = null;
        this.contactsList = document.getElementById('contacts-wrapper');
        this.contactForm = document.getElementById('addContactWrapper')
        this.contactForm.addEventListener('submit', (evt) => this.addContact.call(this, evt));
        this.targetContactCode = 100000;
        this.targetContactName = 'global';
        this.targetContactType = 'room';
        this.conversationCode = 100000;
    }

    async getContacts(){
        
        var data;
        await axios.get(`/contacts/${this.user.code}`)
            .then(res => {
                data = res.data;
            })
            .catch(err => console.log(err));

        this.contacts = data.contacts;
        this.contactsList.innerHTML = '';
        for(let contactCode of this.contacts){
            await axios.get(`/contacts/${contactCode}`)
            .then(res => {
                this.pushContact(res.data)
            })
            .catch(err => console.log(err));
        }
    }

    pushContact(contactInfo){

        // console.log("Pushing ", contactInfo)
        var li = document.createElement('li')
        li.classList.add('contact-info')
        li.innerHTML = `<p class="contact">${contactInfo.contactName}</p>
                        <p>${contactInfo.contactCode}</p>`

        li.dataset.conversationCode = this.getConversationCode(contactInfo);
        li.addEventListener('click', (evt) => this.onContactClick.call(this, contactInfo, evt));
        this.contactsList.appendChild(li);
    }

    onContactClick(contactInfo, evt){
        let li = evt.currentTarget;
        li.classList.remove('selected');
        this.targetContactCode = contactInfo.contactCode;
        this.targetContactName = contactInfo.contactName;
        this.targetContactType = contactInfo.contactType;
        this.conversationCode = li.dataset.conversationCode;
        this.user.messageHandler.loadMessages(li.dataset.conversationCode);
        console.log("Selected Conversation is", this.conversationCode)

        var currentName;
        axios.get(`/contacts/${contactInfo.contactCode}`) //Check If user has changed name since we logged in 
        .then(res => {
            currentName = res.data.contactName;
            if(currentName != contactInfo.contactName){
                li.innerHTML = `<p class="contact">${currentName}</p>
                        <p>${contactInfo.contactCode}</p>`
                this.targetContactName = contactInfo.contactName;
            }
        })
    }

    getConversationCode(contactInfo){

        var finalCode;
        if(contactInfo.contactType == 'room'){
            finalCode = contactInfo.contactCode;
            return;
        }

        let codeA = this.user.code;
        let codeB = contactInfo.contactCode;
        finalCode = codeA.toString() + codeB.toString();
        if(codeA > codeB){
            finalCode = codeB.toString() + codeA.toString();;
        }
        return finalCode;
    }

    addContact(evt){
        evt.preventDefault();
    
        let newContactCode = parseInt(evt.target.elements.ContactInput.value);
        if(newContactCode in this.contacts){
            alert("Contact Already Exists!!")
            return
        }

        axios.get(`/contacts/${newContactCode}`)
        .then(res => {
            let contactInfo = res.data;
            if(contactInfo){
                axios.patch(`/contacts/${this.user.code}`, {newContactCode})
                .then(res => {
                    this.pushContact(contactInfo)
                })
                .catch(err => console.log(err))
            }
            else{
                alert("Invalid Code")
            }
        })
        .catch(err => {
            alert("Invalid Code")
        })
    }
}

export {ContactManager};