const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const activationMiddleware = require('../middlewares/activation-middleware');
const phoneNumberValidator = require('../validators/phoneNumberValidator');
const passwordValidator = require('../validators/passwordValidator');

// router.post('/role', userController.createRole);
// router.patch('/add/role', userController.addRole);
// router.patch('/delete/role', userController.deleteRole);

router.post('/registration',
    body('email').isEmail(),
    body('password').custom(passwordValidator),
    body("phoneNumber").custom(phoneNumberValidator), 
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh/:ip', userController.refresh);
// we can change the user email only if he / she has activated the current one
router.post('/change-email', 
    authMiddleware,
    activationMiddleware,
    body('email').isEmail(),
    userController.changeEmail
);
router.post('/change-phone-number', 
    authMiddleware,
    body("phoneNumber").custom(phoneNumberValidator),
    userController.changePhoneNumber
);
router.get('/activate/:link', userController.activate);

// an example of using function that requires both authorization and email activation
// router.get('/users', authMiddleware, activationMiddleware, userController.getUsers);

router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUser);

module.exports = router
