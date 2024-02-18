const sequelize = require('../db')
const {DataTypes} = require('sequelize')


const User = sequelize.define('user', {
    id: {
        // Задаем тип данных
        type: DataTypes.INTEGER, 
        // всегда будет содержать уникальные данные, нибудет нулевых значений
        primaryKey: true, 
        // постоянно значение будет увеличиваться на 1
        autoIncrement: true
    },

    email: {
        type: DataTypes.STRING, 
        // Уникальный
        unique: true,
        // Обязательный параметр
        require: true
    },

    password: {
        type: DataTypes.STRING,
        require: true
    },

    isActivated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }, 

    activationLink: {
        type: DataTypes.STRING,
    },

    resetPassLink: {
        type: DataTypes.STRING,
        defaultValue: null
    },
        
    role: {
        type: DataTypes.STRING, 
        // Значение по умолчанию
        defaultValue: "USER"
    }
})


const Token = sequelize.define('token', {
    
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, 

    refreshToken: {
        type: DataTypes.STRING,
        require: true
    },
})


User.hasOne(Token)
Token.belongsTo(User)


module.exports = {
    User,
    Token
}