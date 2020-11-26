const express = require('express');

const {isLoggedIn,  isNotLoggedIn } = require('./middlewares');

// database models
const {User, sequelize} = require('../models');
const FriendRequest = sequelize.models.FriendRequest;
const FriendRelation = sequelize.models.FriendRelation;
const FollowRelation = sequelize.models.FollowRelation;

const router = express.Router();

router.get('/user', async (req, res, next)=>{
    const list = await getUserList(req.user.id); 
    
    res.render('userList', {
        // [ {userId, registrationDate, countFriends, requested} ]
        itemList: list, 
    });
});
        async function getUserList(userId){
            try{
                let subQuery = `SELECT sender, reciever FROM friendRequest WHERE sender = '${userId}'`;
                let query = `SELECT u.id AS userId, date_format(u.created_at, '%Y-%m-%d') AS registrationDate, sq.sender AS requested FROM users AS u LEFT JOIN (${subQuery}) AS sq ON u.id = sq.reciever WHERE u.id!='${userId}'`;
                
                // let query = `SELECT u.id AS userId, u.created_at AS registrationDate, sq.sender AS requested FROM users AS u LEFT JOIN (SELECT sender, reciever FROM friendRequest WHERE sender = 'd') AS sq ON u.id = sq.reciever`;
                let list = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
                return list;
                
            }catch(error){
                console.error(error);
            }
        }

router.get('/friend', isLoggedIn, async (req, res, next)=>{
    const list = await getFriendList(req.user.id); 

    res.render('friendList', {
        itemList: list,
    });
});
        async function getFriendList(userId){
            try{
                let query = `SELECT fr.theother AS friendId, date_format(u.created_at, '%Y-%m-%d') AS registrationDate FROM friendrelation AS fr JOIN users AS u ON fr.theother = u.id WHERE one='${userId}'`;
                const list = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
                
                return list; 
            }catch(error){
                console.error(error);
            }
        }

router.get('/friend-request', async(req, res, next)=>{
    const list = await getFriendRequestList(req.user.id); 

    res.render('friendRequestList', {
        itemList: list[0], 
    });
});
        async function getFriendRequestList(userId){
            try{
                let query = `SELECT fr.sender AS friendId, date_format(u.created_at, '%Y-%m-%d') AS registrationDate FROM friendrequest AS fr LEFT JOIN users AS u ON fr.reciever = u.id WHERE fr.reciever='${userId}'`;
                const list = await sequelize.query(query);

                return list; 
            }catch(error){
                console.error(error);
            }
        }

router.post('/friend', isLoggedIn, async (req, res, next)=>{
    await createFriendRelation(req, res, next);
    await deleteFriendRequest(req, res, next);
    return res.end('success');
})
        async function createFriendRelation(req, res, next){
            try{
                await FriendRelation.create({
                    one: req.body.friendId, 
                    theother: req.user.id, 
                });
                await FriendRelation.create({
                    one: req.user.id, 
                    theother: req.body.friendId,
                })
            }catch(error){
                console.error(error);
                return next(error); 
            }
        }
        async function deleteFriendRequest(req, res, next){
            try{
                let friendId = req.body.friendId || req.params.friendId;
                let query = `DELETE FROM friendrequest WHERE reciever='${req.user.id}' AND sender='${req.body.friendId}'`
                await sequelize.query(query);

            }catch(error){
                console.error(error);
                return next(error); 
            }
        }
router.post('/friend-request', isLoggedIn, async(req, res, next)=>{
    try{
        await FriendRequest.create({
            reciever: req.body.friendId, 
            sender: req.user.id, 
        })
        return res.end('success');
    }catch(error){
        console.error(error);
    }
} );
router.post('/follow', isLoggedIn, (req, res, next)=>{
    
} );


router.delete('/friend/:friendId', isLoggedIn, async(req, res, next)=>{
    console.log(req.params.friendId);
    await deleteFriend(req, res, next); 

    res.end('success');
})
        async function deleteFriend(req, res, next){
            try{
                let query = `DELETE FROM friendRelation WHERE one='${req.user.id}' AND theother='${req.params.friendId}'`;
                await sequelize.query(query);
                query = `DELETE FROM friendRelation WHERE theother='${req.user.id}' AND one='${req.params.friendId}'`;
                await sequelize.query(query);

                return; 
            }catch(error){
                console.error(error);
                return next(error); 
            }
        }

router.delete('/friend-request/:friendId', isLoggedIn, async(req, res, next)=>{
    await deleteFriendRequest(req, res, next);
})
router.delete('/follow', isLoggedIn, (req, res, next)=>{

})
module.exports = router;
