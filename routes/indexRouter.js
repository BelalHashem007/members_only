const {Router} = require('express');
const indexRouter = Router();
const controller = require('../controllers/indexController')

indexRouter.get('/sign-up',controller.getSignup);
indexRouter.post('/sign-up',controller.postSignup);
indexRouter.get('/log-in',controller.getLogin);
indexRouter.post('/log-in',controller.postLogin);
indexRouter.get('/log-out',controller.getLogout);
indexRouter.get('/secret',controller.getSecret);
indexRouter.post('/secret',controller.postSecret)
indexRouter.get('/',controller.getHome)

module.exports = indexRouter;