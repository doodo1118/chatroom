const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const passport = require('passport');

const { sequelize } = require('./models');
const passportConfig = require('./passport');

const setRoutes = require('./routes');

const app = express();

// load & save Chat
const {sequelize: sequel} = require('./models');

sequelize.sync();
passportConfig(passport);

require('dotenv').config();

const sessionMiddleware = session({
    resave: false, 
    saveUninitialized: false, 
    secret: process.env.COOKIE_SECRET, 
    cookie: {
        httpOnly: true, 
        secure: false,
    }, 
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT||80);
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
setRoutes(app);

app.use((req, res, next) =>{
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res) =>{
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

// const server = app.listen(app.get('port'), ()=>{
//     console.log(app.get('port'), '번 포트에서 대기 중');
// });


// for socket
const socketio = require('socket.io'); 
const formatMessage = require('./utils/formatMessage'); 
const {userJoin, userLeave, getCurrentUser, getAttendees } = require('./utils/users'); 

const server = app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기 중');
});
const io = socketio(server); 
// make session accessible in socket
io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
})

// ChatRoom Socket
//run when client connects
io.on('connection', socket =>{
    let bot = 'bot'; 
    
    socket.on('joinRoom', ({roomNumber, connectionOption}) =>{
        const userId = socket.request.session.passport.user;         
        const user = userJoin(socket.id, userId, roomNumber); 
        
        socket.join(roomNumber); 

        //only to user entered
        socket.emit('message', formatMessage(bot, `${userId}님이 입장` )); 
        //all users except user entered
        socket.broadcast.emit('message', formatMessage(bot, `${userId}가 들어왔습니다.`)); 

        
        io.to(user.room).emit('roomInformation', {
            roomNumber: user.room, 
            users: getAttendees(user.room),
        })
        
    })
    socket.on('chatMessage', message=>{
        const userId = socket.request.session.passport.user;         
        const user = getCurrentUser(socket.id); 

        io.to(user.room).emit('message', formatMessage(userId, message) );
    })
    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id); 

        if(user) { 
            io.to(user.room).emit('message', formatMessage(bot, `${user.userId}가 나갔습니다.`)); 
        }
        
    }); 

})

const moment = require('moment');

// DirectMessage Socket
const chat = io.of('/directMessage');
chat.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
})
chat.on('connection',  socket =>{
    let bot = 'bot'; 
    let reciever; 
    let sender; 
    socket.on('joinRoom', async ({roomNumber}) =>{
        const userId = socket.request.session.passport.user;      
        
        // for saveChat(); 
        reciever = roomNumber; 
        sender = userId; 

        // roomIdentifier
        let talkers = [reciever, sender];
        talkers.sort();
        const roomIdentifier = talkers[0]+talkers[1]; 

        socket.join( roomIdentifier ); 
   
        const user = userJoin(socket.id, userId, roomIdentifier); 

        io.of('/directMessage').to(user.room).emit('roomInformation', {
            roomNumber: roomNumber, 
        })

        // loadChat
        let chatLogsHistory = await loadChat(sender, reciever);
        io.of('/directMessage').to(user.room).emit('chatLogsHistory', {
            chatLogsHistory : chatLogsHistory, 
        })
    })
    socket.on('chatMessage', async message=>{
        const userId = socket.request.session.passport.user;         
        const user = getCurrentUser(socket.id); 

        io.of('/directMessage').to(user.room).emit('message', formatMessage(userId, message) );
        
        // saveChat
        let time = moment().format('h:mm a');
        await saveChat(sender, reciever, message, time);
    })
});
async function loadChat(myId, friendId){
    try{
        let query = `SELECT sender, message, time FROM directmessages WHERE (sender='${myId}' AND reciever='${friendId}') OR (sender='${friendId}' AND reciever='${myId}') ORDER BY createdAt ASC LIMIT 50;`;
        
        // let query = `SELECT u.id AS userId, u.created_at AS registrationDate, sq.sender AS requested FROM users AS u LEFT JOIN (SELECT sender, reciever FROM friendRequest WHERE sender = 'd') AS sq ON u.id = sq.reciever`;
        let list = await sequel.query(query, {type: sequelize.QueryTypes.SELECT});
        return list;
    }catch(error){

    }
}
async function saveChat(sender, reciever, message, time){
    try{
        let query = `INSERT INTO directmessages(sender, reciever, message, time, creaetedAt, updatedAt) VALUES('${sender}', '${reciever}', '${message}', '${time}', NOW(), NOW());`;
    
        await sequel.query(query);
        return;
    }catch(error){

    }
}
