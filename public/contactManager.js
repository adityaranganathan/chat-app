"user strict"

// import {chatUI} from './views/chatUI.js'

class ContactManager{
    constructor(){
        this.contactCodes = null;
        this.contacts = [];
        this.targetContactCode = 100000;
        this.targetContactName = 'Global';
        this.targetContactType = 'room';
        this.conversationCode = 100000;
    }

    async getContacts(){
        
        var data;
        await axios.get(`/contacts/${window.user.code}`)
            .then(res => {
                data = res.data;
            })
            .catch(err => console.log(err));

        this.contactCodes = data.contacts;
        for(let contactCode of this.contactCodes){
            await axios.get(`/contacts/${contactCode}`)
            .then(res => {
                this.contacts.push(res.data);
            })
            .catch(err => console.log(err));
        }
    }

    async addContact(newContactCode){

        if(this.contactCodes.includes(newContactCode)){
            alert("Contact Already Exists!!")
            return
        }
        await axios.get(`/contacts/${newContactCode}`)
        .then(async function(res){
            let contactInfo = res.data;
            if(contactInfo){
                await axios.patch(`/contacts/${window.user.code}`, {newContactCode})
                .then(async function(res){
                    window.contactManager.contactCodes.push(newContactCode)
                    window.contactManager.contacts.push(contactInfo)
                    
                    
                    window.chatUI.pushContact(contactInfo);
                    await window.messageHandler.loadMessage(contactInfo)
                    console.log("Shud be A")
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

    onContactClick(contactInfo, evt){
        // console.log("Clicked")
        let li = evt.currentTarget;
        li.classList.remove('selected');
        this.targetContactCode = contactInfo.contactCode;
        this.targetContactName = contactInfo.contactName;
        this.targetContactType = contactInfo.contactType;
        this.conversationCode = li.dataset.conversationCode;
        console.log("Selected Conversation is", this.conversationCode)

        window.router.loadRoute('messenger')

        // var currentName;
        // axios.get(`/contacts/${contactInfo.contactCode}`) //Check If user has changed name since we logged in 
        // .then(res => {
        //     currentName = res.data.contactName;
        //     if(currentName != contactInfo.contactName){
        //         li.innerHTML = `<p class="contact">${currentName}</p>
        //                 <p>${contactInfo.contactCode}</p>`
        //         this.targetContactName = contactInfo.contactName;
        //     }
        // })
    }
    

    getConversationCode(contactInfo){

        // console.log("Gettimg convcode")
        // console.log(contactInfo)
        var finalCode;
        if(contactInfo.contactType == 'room'){
            finalCode = contactInfo.contactCode;
            return finalCode;
        }

        let codeA = window.user.code;
        let codeB = contactInfo.contactCode;
        finalCode = codeA.toString() + codeB.toString();
        if(codeA > codeB){
            finalCode = codeB.toString() + codeA.toString();;
        }
        return finalCode;
    }

    
}


export {ContactManager};