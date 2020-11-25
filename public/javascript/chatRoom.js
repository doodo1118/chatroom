class Chat{
    connect(){}
}

class ChatRoom{
    constructor(elem){
        this._elem = elem;
        this._connectionOption = "chatRoom"; 

        let chatLogsContainer = document.querySelector(".chatRoom__chatLogsContainer"); 
        this._chatLogsContainer = new ChatLogsContainer(chatLogsContainer); 

        let inputMessage = document.querySelector('.chatRoom__inputMessage>input');
        this._inputMessage = new MessageInput(inputMessage); 


        this._chatRoomAttendees = new ChatRoomAttendees(); 

        this._chatRoomButtons = new ChatRoomButtons(); 
    }

    connect(roomNumber){
        const socket = io(); 
        this._inputMessage.setSocket(socket); 
        this._chatRoomButtons.setSocket(socket); 
        // add eventListeners
        socket.emit('joinRoom', {roomNumber, connectionKind: this._connectionOption}); 
        socket.on('roomInformation', ( {roomNumber, users} )=>{    
            let roomTitle = document.querySelector(".chatRoom__roomNumber"); 
            roomTitle.innerHTML = roomNumber;
            
            let countAttendees = document.querySelector(".chatRoom__countAttendeesData"); 
            countAttendees.innerHTML = users.length; 
            this._chatRoomAttendees.renderAttendees(users); 
        })
        socket.on('message', message=>{
            this._chatLogsContainer.displayMessage(message); 
            this._chatLogsContainer.scroll(); 
        })
        
    }
}

class ChatLogsContainer{
    constructor(elem){
        this._elem = elem;
    }
    displayHistory(chatLogsHistory){
        console.log(chatLogsHistory); 
    }
    displayMessage({sender, time, message}){
        const chatLogDiv = document.createElement('div'); 
        chatLogDiv.classList.add('chatRoom__chatLog');

        // 같은 브라우저 식별불가
        let myId = window.localStorage.getItem("myId");
        if(myId === sender)
            chatLogDiv.classList.add(`sender_me`);
        else 
            chatLogDiv.classList.add(`sender_${sender}`); 

        const metaDiv = document.createElement('div'); 
        metaDiv.classList.add('chatLog__meta');
        const senderDiv = document.createElement('div'); 
        senderDiv.classList.add('chatLog__sender');
        senderDiv.innerHTML = sender;
        const timeDiv = document.createElement('div'); 
        timeDiv.classList.add('chatLog__time');
        timeDiv.innerHTML = time; 
        
        const messageDiv = document.createElement('div'); 
        messageDiv.classList.add('chatLog__message');
        messageDiv.innerHTML = message; 

        metaDiv.appendChild(senderDiv); 
        metaDiv.appendChild(timeDiv); 

        chatLogDiv.appendChild(metaDiv); 
        chatLogDiv.appendChild(messageDiv);

        this._elem.appendChild(chatLogDiv); 
    }
    scroll(){
        this._elem.scrollTop = this._elem.scrollHeight; 
    }
}

class MessageInput{
    constructor(elem){
        this._elem = elem;
        elem.onkeyup = this.onKeyUp.bind(this);
        this._socket; 
    }
    parseMessage(){

    }
    setSocket(socket){
        this._socket = socket;
    }
    sendMessage(){
        let message = this._elem.value;
        this._socket.emit('chatMessage', message);
    }
    clearInput(){
        this._elem.value = ""; 
    }
    focusInput(){
        this._elem.focus(); 
    }
    onKeyUp(event){
        if( event.keyCode!==13 )
            return;
        
        // event.preventDefualt(); 
        this.sendMessage(); 
        this.clearInput(); 
        this.focusInput(); 
    }
}

class ChatRoomAttendees{
    constructor(elem){
        this._elem = document.querySelector(".chatRoom__attendees");
        this._elem.onclick = this.onClick.bind(this); 

        this._attendees; 
    }
    renderAttendees(users){
        users.forEach(user => {
            let div = document.createElement('div'); 
            div.classList.add('.chatRoom__attendee');
            div.innerHTML = `${user.userId}`
            this._elem.appendChild(div);
        });
    }
    onClick(event){
        let action = event.target.dataset.action; 
        if(action){

        }
    }
}
class ChatRoomButtons{
    constructor(){
        this._elem = document.querySelector(".chatRoom__buttons"); 
        this._elem.onclick = this.onClick.bind(this); 
        this._socket; 
    }
    setSocket(socket){
        this._socket = socket; 
    }
    exit(){
        // emit disconnect?
        window.location.href = "/";
    }
    onClick(event){
        const action = event.target.dataset.action; 
        if(action){
            this[action](); 
        }
    }
}