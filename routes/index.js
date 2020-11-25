const socialRoute = require('./social');
const authRoute = require('./auth');
const chatRoute = require('./chat');

const {isLoggedIn} = require('./middlewares');

// module.exports = {
//     socialRoute, 
//     authRoute, 
//     chatRoute, 
// };
module.exports = (app)=>{
    app.use('/auth', authRoute);
    app.use('/social', socialRoute);
    app.use('/chat', chatRoute);
    app.use('/', (req, res, next)=>{
        if(req.user)
            res.render('main');
        else
            res.redirect('/auth/signin');
    })
}
