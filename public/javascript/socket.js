const socket = io(); 
socket.on('message', message=>{
    console.log(message); 
    displayMessage(message); 
    // chatMessages.scrollTop = chatMessages.scrollHeight; 
})