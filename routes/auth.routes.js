const {Router} = require('express');
const router = Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');


//  /api/auth/register
router.post('/register',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля - 6 символов')
            .isLength({min: 6})
    ], async (req, res) => {
    console.log(req.body);
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при регистрации'
            })
        }

        const {email, password} = req.body;

        const candidate = await User.findOne({email});

        if(candidate) {
            return res.status(400).json( {message: 'Такой пользователь уже существует'} )
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({email, password: hashedPassword});

        await user.save();

        res.status(201).json( {message: 'Регистрация прошла успешно'} )


    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
});

//  /api/auth/login
router.post('/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при авторизации'
            })
        }

        const {email, password} = req.body;

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({message: 'Такого пользователя не существует'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({message: 'Неверный пароль, попробуйте снова'});
        }

        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecret'),
            { expiresIn: '1h' }
        );

        res.status(200).json({message: 'Вы успешно авторизовались', token, userId: user.id});
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }

});

//  /api/auth/checkAuth
router.post('/checkAuth', async (req, res) => {
    try {
        //получаем строку в заголовке, содержащую токен
        //сплитим на массив, где [1] будет как раз токеном
        const token = req.headers.authorization.split(' ')[1]; //Bearer TOKEN
        if(!token) {
            console.log('checkAuth: Нет Токена');
            return res.status(401).json({checkAuth: false});
        }

        const decoded = jwt.verify(token, config.get('jwtSecret'));
        return res.status(200).json({checkAuth: true});
    } catch (e) {
        console.log('checkAuth: ', e);
        return res.status(401).json({checkAuth: false});
    }

    });

module.exports = router;