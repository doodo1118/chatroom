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

// FriendRelation
db.User.belongsToMany(db.User, {
  foreignKey: 'one', 
  as: 'theother',
  through: 'FriendRelation'
});
db.User.belongsToMany(db.User, {
  foreignKey: 'theother',
  as: 'one', 
  through: 'FriendRelation'
});
// FollowRelation
db.User.belongsToMany(db.User, {
  foreignKey: 'following', 
  as: 'follower',
  through: 'FollowRelation'
});
db.User.belongsToMany(db.User, {
  foreignKey: 'follower',
  as: 'following', 
  through: 'FollowRelation'
});
// FriendRequest
db.User.belongsToMany(db.User, {
  foreignKey: 'reciever', 
  as: 'sender',
  through: 'FriendRequest'
});
db.User.belongsToMany(db.User, {
  foreignKey: 'sender',
  as: 'reciever', 
  through: 'FriendRequest'
});

// ~Relation

module.exports = db;
