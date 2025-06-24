const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true,
    },
    nickname : {
        type : DataTypes.STRING(10),
        allowNull: false
    },
    password: {
        type : DataTypes.STRING(10),
        allowNull : false
    },
    email: {
        type : DataTypes.STRING(50),
        allowNull : false,
        unique : true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updateAt : false,
    tableName : 'users'
});

module.exports = User;