const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { User } = require('../models');

const {isLoggedIn,  isNotLoggedIn} = require('./middlewares');

const router = express.Router();

router.get('/signin', isNotLoggedIn, (req, res, next)=>{
    res.render('signin');
} );
router.get('/signup', isNotLoggedIn, (req, res, next)=>{
    res.render('signup');
});


router.get('/logout', (req, res, next)=>{
    req.logout();
    req.session.destroy();
    res.redirect('/');
});
router.post('/signin', isNotLoggedIn, (req, res, next)=>{
    /*
        sign in
    */
   passport.authenticate('local', (authError, user, info)=>{
       if(authError){
           console.error(authError);
           return next(authError);
       }
       if(!user){
           return res.send('failed');           
       }
       return req.login(user, (loginError)=>{
           if(loginError){
               console.error(loginError);
               return next(loginError);
           }
           return res.send('success');
       })
   })(req, res, next);

})
router.post('/signup', isNotLoggedIn, async (req, res, next)=>{
    /*
        register user
     */
    
    const{ id, password } = req.body;
    try{

        const exUser = await User.findOne({where: {id}});
        if(exUser){
            // return res.redirect('/auth/signin');
            return res.send('failed');
        }
        const encryptedPassword = await bcrypt.hash(password, 12);
        await User.create({
            id, 
            password: encryptedPassword, 
        });
        // return res.redirect('/');
        return res.send('success');

    }catch(error){

        console.error(error);
        return next(error);

    }
})
module.exports = router;
