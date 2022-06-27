const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const { body, validationResult } = require('express-validator');

router.post('/signup',[
    body('email', "le format d'email n'est pas correct").isEmail(),
    body('password', 'password doit contenir plus de 5 charactères').isLength({ min: 5 }),
 ] , userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
