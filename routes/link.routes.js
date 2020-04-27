const {Router} = require('express');
const Link = require('../models/Link');
const router = Router();
const authMiddleware = require('../middleware/auth.middleware');
const config = require('config');
const shortId = require('shortid');

//создание ссылки
router.post('/generate', authMiddleware, async (req, res) => {
    try {

        const baseUrl = config.get('baseUrl');
        const {from} = req.body;

        const code = shortId.generate();

        //если такая ссылка уже есть, возвращаем ее
        const existing = await Link.findOne({from});
        if(existing) {
            return res.json({message: 'Ссылка уже есть', link: existing});
        }

        const to = baseUrl + '/t/' + code;

        const link = new Link({
            code, to, from, owner: req.user.userId
        });

        await link.save();

        res.json({message: 'Ссылка создана', link});

    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
});

//получение всех ссылок
router.get('/', authMiddleware, async (req, res) => {
    try {
        //req.user.userId - из jwt токена получаем
        const links = await Link.find({owner: req.user.userId});
        res.status(200).json(links);
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
});

//получение определенной ссылки
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const link = await Link.findById(req.params.id);
        res.status(200).json(link);
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
});



module.exports = router;