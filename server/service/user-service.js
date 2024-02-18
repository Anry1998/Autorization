const {User, Token} = require('../models/user-model')
const bcrypt = require('bcrypt') 
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')


class UserService {

    async registration(email, password) {
        // Ищем пользователя в БД с таким емаил, если он уже есть, выдаем ошибку
        const condidate = await User.findOne({where: {email}})
        if (condidate) {
            throw ApiError.BedRequest(`Пользователь с почтовым адресом: ${email} уже существует`)
        }
        // Если его нет хешируем пароль
        const hashPassword = await bcrypt.hash(password, 3)
        // Создаем уникальную ссылку
        const activationLink = uuid.v4()

        // создаем в БД нового юзера куда передаем емаил, пароль в захешированном виде и ссылку для активации 
        const user = await User.create({email, password: hashPassword, activationLink})
        // Функция по отправке письма на почту, параметрами принимает емаил пользователя и ссылку для активации (ссылка сохраняется толь после http//:localhost3000?)
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)

        // Данный клас фильтрует данные юсера, на выходе мы получаем только емаил, id, и ссылку для активации (без пароля!!!)
        const userDto = new UserDto(user)
        // Фукция генерирует два токена аксесс(30м) и рефреш(30д)
        const tokens = tokenService.genirateToken({...userDto})
        // Сохранение либо перезаписавание токена в БД
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        // Возвращаем токены и данные о пользователе
        return {...tokens, user: userDto}
    }

    

    async login(email, password) {
        const user = await User.findOne({where:{email: email}})
        if (!user) {
            throw ApiError.BedRequest('Пользователь с таким email не был найден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) { 
            throw ApiError.BedRequest('Неверный пароль')
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.genirateToken({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }

        const user = await User.findOne({where:{id: userData.id}})
        const userDto = new UserDto(user)
        const tokens = tokenService.genirateToken({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {...tokens, user: userDto}
    }


    async getAllUsers() {
        try {
            const users = await User.findAll()
            return users
        } catch(e) {
            console.log(e)
        }
    }


    async activate(activationLink) {
        // параметром принимаем ссылку для активауии, которую мы ранее создали и внесли в БЖ если ее нет, прокидываем ошибку
        const user = await User.findOne({where: {activationLink}})
        if (!user) {
            throw ApiError.BedRequest('Некорректная ссылка активации')
        }
        // меняем значение поля активации на true
        user.isActivated = true
        // сохранеем данные
        await user.save()

        // Обрати внимание, что эта функция отрабатывает только когда ты кликнеш на ссылку, только тогда сработает роут '/activate/:link'
    }
    

    async resetPassword(email) {
        const condidate = await User.findOne({where: {email}})
        if (!condidate) {
            throw ApiError.BedRequest(`Пользователь с почтовым адресом: ${email} не существует`)
        }
        
        const resetPassLink = uuid.v4()

        condidate.resetPassLink = resetPassLink
        await condidate.save()

        
        await mailService.sendResetPass(email, `${process.env.API_URL}/api/reset/${resetPassLink}`)
        
         setTimeout(() => {
            condidate.resetPassLink = null
            condidate.save()
        }, 3*60*1000)

        return {resetPassLink}
    }

    async resetPasswordMail( resetPassLink) {
        const condidate = await User.findOne({where: {resetPassLink}})
        if (!condidate) {
            throw ApiError.BedRequest(`Некоректная ссылка зброса пароля`)
        }

        return 
    }

    async resetPasswordMailFinal(email, newPassword, resetPassLink) {
        const condidate = await User.findOne({where: {email}})
        if (condidate.resetPassLink === resetPassLink) {
            const newHashPassword = await bcrypt.hash(newPassword, 3)
            condidate.password = newHashPassword 
            condidate.resetPassLink = null
            condidate.save()

        return  
        } else {
            throw ApiError.BedRequest(`Некоректная ссылка зброса пароля`)
        }

        
    }


}
 
module.exports = new UserService()