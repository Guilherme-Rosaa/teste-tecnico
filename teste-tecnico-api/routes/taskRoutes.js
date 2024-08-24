const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const authorize = require('./../middlewares/authMiddleware');

router.post('/CadastrarTarefa',authorize, todoController.cadastrarTarefa);
router.get('/BuscarTarefasPendentes',authorize, todoController.buscarTarefasPendentes);
router.post('/Concluir/:id',authorize, todoController.concluirTarefa);

module.exports = router;
