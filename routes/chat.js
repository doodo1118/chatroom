const express = require('express');

const {isLoggedIn,  isNotLoggedIn, verifyUser=()=>{} } = require('./middlewares');
const {Chatroom, } = require('../models');

const router = express.Router();

router.get('/room', async (req, res, next)=>{
    const rawList = await getChatRoomList(); 
    const trimmedList = await trimList(rawList);
    
    res.render('chatRoomList', {
        itemList: trimmedList, 
    });
});
async function getChatRoomList(){
    try{
        let list = await Chatroom.findAll({
            attributes:[
                ['id', 'roomNumber'],  
            ],
            // include:{
            //     model: User,
            //     attributes: [], 
            //     as: 'one', 
            // }, 
            // order:{}
        });
        return list; 
    }catch(error){

    }
}
async function trimList(rawList){
    let trimmedList = await rawList.map( (el)=>{
        let newEl = el.dataValues;
        
        return newEl;
    })

    return trimmedList
}
router.get('/room-layout', verifyUser, (req, res, next)=>{
    /* socket */
    // const io = req.app.get('io');
    
    res.render('chatRoom', {
        roomNumber: req.params.roomNumber, 
        chatLogs: [], 
        attendees: [],      
    });
});

router.get('/dm/:counterpartUserId', verifyUser, (req, res, next)=>{
    /*
       socket
    */ 
})

module.exports = router;
