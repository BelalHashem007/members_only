const {Router} = require('express');
const indexRouter = Router();
const controller = require('../controllers/indexController')

//Authentication
indexRouter.get('/sign-up',controller.getSignup);
indexRouter.post('/sign-up',controller.postSignup);
indexRouter.get('/log-in',controller.getLogin);
indexRouter.post('/log-in',controller.postLogin);
indexRouter.get('/log-out',controller.getLogout);

//secret
indexRouter.get('/secret',controller.getSecret);
indexRouter.post('/secret',controller.postSecret);

//messageForm
indexRouter.get('/message',controller.getMessageForm);
indexRouter.post('/message',controller.postMessage);

//home
indexRouter.get('/',controller.getHome);

module.exports = indexRouter;