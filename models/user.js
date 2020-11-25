module.exports = (sequelize, DataTypes) => (
    sequelize.define('user', {
        id: {
            type: DataTypes.STRING(40),
            primaryKey: true, 
        }, 
        password:{
            type: DataTypes.STRING(100), 
            allowNull: true, 
        }, 
        created_at:{
            type: DataTypes.DATE, 
            allowNull: false, 
            defaultValue: DataTypes.NOW,
        }, 
    }, {
        timestamps: false, 
    })
)