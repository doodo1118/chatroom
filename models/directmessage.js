module.exports = (sequelize, DataTypes) => (
    sequelize.define('directmessage', {
        sender:{
            type: DataTypes.STRING(40), 
            allowNull: false, 
        }, 
        reciever:{
            type: DataTypes.STRING(40), 
            allowNull: false, 
        }, 
        message:{
            type: DataTypes.STRING(500), 
            allowNull: false, 
        },
    }, {
        timestamps:true, 
    })
)