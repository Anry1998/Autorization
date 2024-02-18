const jwt = require('jsonwebtoken')
const {Token} = require('../models/user-model')
const { where } = require('sequelize')

class TokenService {
    genirateToken(payload) {
        // Генерация  токенов
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            refreshToken,
            accessToken
           
        }
    } 

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch(e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        } catch(e) {
            return null
        }
    }

    async saveToken(userId, refreshToken) {
        // Ищем в БД пользователя с указанным id 
        const tokenData = await Token.findOne( {where: {id: userId}})
        // если пользователь существует перезаписываем рефреш токен и сохранеем refreshToken в БД токенов - save()
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        // Если пользователь не найден создаем в БД токенов новые данные пользователя, куда передаем id и сам рефреш токен
        const token = await Token.create({id: userId, refreshToken, userId: userId})
        // возвращаем токен
        return token
    }

    async removeToken(refreshToken) {
        const tokenData = await Token.destroy({where:{refreshToken: refreshToken}})
        return tokenData
    }

    async findToken(refreshToken) {
        const tokenData = await Token.findOne({where:{refreshToken: refreshToken}})
        return tokenData
    }
}

module.exports = new TokenService()




