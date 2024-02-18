const userService = require("../service/user-service")
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error') 

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BedRequest('Ошибка при валидации', errors.array()))
            }
            const {email, password} = req.body
            const userData = await userService.registration(email, password)
            // сохраняем рефреш токен в куки, первым параметром ключ, вторым значение, третим - опции (время жизини куки, httpOnly: true - запрет получения и изменения куки внутри браузера)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            // if (e) {
            //     return e.message
            // }
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }


   

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }


    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers()
            return res.json(users)
        } catch (e) {
            next(e)
        }
    }


    async activate(req, res, next) {
        try {
            // в переменной храниться ссылка активации, только последние значения после http//:localhost3000?
            const activationLinc = req.params.link
            // Передаем значение этой ссылки в функуию activate

            await userService.activate(activationLinc)
            // После отработки функции перенаправляем пользователя на сайт фронта
            return res.redirect(process.env.CLIENT_URL + '/login')
        } catch (e) {
            next(e)
        }
    }


///////////////////////////////////////////////////////////////////////////////

    async login2(req, res, next) {
        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }


    async resetPass(req, res, next) {
        try {
            // const resetPassLink = req.params.link
            const {email} = req.body
            const users = await userService.resetPassword(email)
            return res.json(users.resetPassLink)
        } catch (e) {
            next(e)
        }
 
    }


    async resetPassMail(req, res, next) {
        try {
 
            const resetPassLink = req.params.link
            const users = await userService.resetPasswordMail(resetPassLink)
            // Редиректить должно на сверстанную страницу восстановления пароля
            res.redirect(process.env.CLIENT_URL_RESET_PASS + '/' + resetPassLink)
            
            return 
        } catch (e) {
            next(e)
        }
 
    }

   

    async resetPassMailFinal(req, res, next) {
        try {

            const resetPassLink = req.params.link

            const {email, newPassword } = req.body
            const users = await userService.resetPasswordMailFinal(email, newPassword, resetPassLink)
            return res.json(email, newPassword, resetPassLink)
        } catch (e) {
            next(e)
        }
 
    }
 
}

module.exports = new UserController()