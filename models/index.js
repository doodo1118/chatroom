const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config, 
);


db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 
db.User = require('./user')(sequelize, Sequelize);
db.Directmessage = require('./directmessage')(sequelize, Sequelize);
db.Chatroom = require('./chatroom')(sequelize, Sequelize); 
// FriendRelation
db.User.belongsToMany(db.User, {
  foreignKey: 'one', 
  as: 'theother',
  through: 'friendrelation'
});
db.User.belongsToMany(db.User, {
  foreignKey: 'theother',
  as: 'one', 
  through: 'friendrelation'
});
// FollowRelation
db.User.belongsToMany(db.User, {
  foreignKey: 'following', 
  as: 'follower',
  through: 'followrelation'
});
db.User.belongsToMany(db.User, {
  foreignKey: 'follower',
  as: 'following', 
  through: 'followrelation'
});
// FriendRequest
db.User.belongsToMany(db.User, {
  foreignKey: 'reciever', 
  as: 'sender',
  through: 'friendrequest'
});
db.User.belongsToMany(db.User, {
  foreignKey: 'sender',
  as: 'reciever', 
  through: 'friendrequest'
});

// ~Relation

module.exports = db;
