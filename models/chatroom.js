module.exports = (sequelize, DataTypes) => (
    sequelize.define('chatroom', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
        }, 
    }, {
        timestamps: false, 
    })
)