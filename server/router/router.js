const Router = require('express')
const UserController = require('../controllers/user-controller')
const router = new Router()
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware')



router.post('/registration', 
    body('email').isEmail(),
    body('password').isLength({min: 5, max: 15}),
    UserController.registration)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)
router.get('/activate/:link', UserController.activate)
router.get('/refresh', UserController.refresh)
router.get('/users', authMiddleware, UserController.getUsers)

router.post('/reset',  UserController.resetPass)
router.get('/reset/:link',  UserController.resetPassMail)
router.post('/reset/:link',  UserController.resetPassMailFinal)


module.exports = router