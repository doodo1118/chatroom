const users = []; 

function userJoin(socketId, userId, room){
    const user = {socketId, userId, room}; 

    users.push(user); 

    return user; 
}

function getCurrentUser(socketId){
    return users.find(user => user.socketId === socketId); 
}

function userLeave(socketId){
    const index = users.findIndex( user => user.socketId === socketId); 

    if( index !== -1 ){ 
        return users.splice(index, 1)[0];
    }
}
function getAttendees(room){
    return users.filter(user => user.room === room); 
}
module.exports = {
    userJoin, 
    getCurrentUser, 
    userLeave,
    getAttendees,  
}