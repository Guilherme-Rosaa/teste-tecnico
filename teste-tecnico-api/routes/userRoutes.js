const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/Cadastrar', userController.cadastrarUsuario);
router.post('/Login', userController.login);

module.exports = router;
