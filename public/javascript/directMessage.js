// common class for dm, chatroom
// class Chat{
//     connect(){}
// }

class DirectMessage{
    constructor(elem){
        this._elem = elem;
        this._connectionOption = "directMessage"; 

        let chatLogsContainer = document.querySelector(".chatRoom__chatLogsContainer"); 
        this._chatLogsContainer = new ChatLogsContainer(chatLogsContainer); 

        let inputMessage = document.querySelector('.chatRoom__inputMessage>input');
        this._inputMessage = new MessageInput(inputMessage); 

    }
    // roomNumber -> roomTitle 
    connect(roomNumber){
        const socket = io('/'+this._connectionOption); 
        this._inputMessage.setSocket(socket); 

        // add eventListeners
        socket.emit('joinRoom', {roomNumber}); 
        socket.on('chatLogsHistory', (chatLogsHistory)=>{
            this._chatLogsContainer.displayHistory(chatLogsHistory); 
        })
        socket.on('roomInformation', ( {roomNumber, users} )=>{    
            let roomTitle = document.querySelector(".chatRoom__roomNumber"); 
            roomTitle.innerHTML = roomNumber;
        })
        socket.on('message', message=>{
            this._chatLogsContainer.displayMessage(message); 
            this._chatLogsContainer.scroll(); 
        })
        
    }
}