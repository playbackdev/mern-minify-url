const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS') {
        return next();
    }
    try {
        //получаем строку в заголовке, содержащую токен
        //сплитим на массив, где [1] будет как раз токеном
        const token = req.headers.authorization.split(' ')[1]; //Bearer TOKEN

        if(!token) {
            console.log('Нет Токена');
            return res.status(401).json({message: 'Нет авторизации'});
        }

        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded;
        next();
    } catch (e) {
        console.log('Ошибка авторизации: ', e);
        if(e instanceof jwt.TokenExpiredError) {
            console.log('Токен просрочен: ', e);
        }
        return res.status(401).json({message: 'Нет авторизации'});
    }
};