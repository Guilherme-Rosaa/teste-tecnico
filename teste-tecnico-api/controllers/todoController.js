const db = require('../config/db');

const cadastrarTarefa = async (req, res) => {
    /*
        #swagger.tags = ['Tarefas']
        #swagger.summary = 'Criar nova tarefa'
        #swagger.description = 'Esse endpoint cria uma nova tarefa para um usuário logado.'
        #swagger.requestBody = {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            tarefa: {
                                type: 'string',
                                example: 'Comprar leite'
                            },
                            prioridade: {
                                type: 'integer',
                                example: 1
                            }
                        },
                        required: ['tarefa', 'prioridade']
                    }
                }
            }
        }
        #swagger.responses[201] = {
            description: 'Tarefa criada com sucesso',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'integer',
                                example: 1
                            },
                            tarefa: {
                                type: 'string',
                                example: 'Comprar leite'
                            },
                            prioridade: {
                                type: 'integer',
                                example: 1
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[500] = {
            description: 'Erro interno do servidor',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            error: {
                                type: 'string',
                                example: 'Erro interno do servidor'
                            }
                        }
                    }
                }
            }
        }
    */
    const { tarefa, prioridade } = req.body;

    try {
        const userInfo = req.user;
        const userId = userInfo.usuarioId;

        db.run("INSERT INTO tarefas (tarefa, prioridade, pendente, usuarioId) VALUES (?, ?, ?, ?)", [tarefa, prioridade, 1, userId], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID, tarefa, prioridade });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const buscarTarefasPendentes = (req, res) => {
    /*
        #swagger.tags = ['Tarefas']
        #swagger.summary = 'Buscar lista de tarefas'
        #swagger.description = 'Esse endpoint busca todas as tarefas pendentes de um usuário logado.'
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.responses[200] = {
            description: 'Lista de tarefas pendentes',
            content: {
                'application/json': {
                    schema: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'integer',
                                    example: 1
                                },
                                tarefa: {
                                    type: 'string',
                                    example: 'Comprar leite'
                                },
                                prioridade: {
                                    type: 'integer',
                                    example: 1
                                }
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[500] = {
            description: 'Erro interno do servidor',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            error: {
                                type: 'string',
                                example: 'Erro interno do servidor'
                            }
                        }
                    }
                }
            }
        }
    */
    
    const userInfo = req.user;
    const userId = userInfo.usuarioId;

    db.all(`SELECT id, tarefa, prioridade FROM tarefas WHERE usuarioId = ? AND pendente = 1`, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

const concluirTarefa = (req, res) => {
    /*
        #swagger.tags = ['Tarefas']
        #swagger.summary = 'Atualizar status de uma tarefa'
        #swagger.description = 'Esse endpoint atualiza o status de uma tarefa para concluída pelo seu ID.'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID da tarefa a ser atualizada',
            required: true,
            properties: {
                type: 'integer',
                example: 1
            }
        }
        #swagger.responses[200] = {
            description: 'Tarefa atualizada com sucesso',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            message: {
                                type: 'string',
                                example: 'Tarefa atualizada com sucesso.'
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[400] = {
            description: 'Solicitação inválida',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            error: {
                                type: 'string',
                                example: 'ID inválido. Verifique o ID da tarefa e tente novamente.'
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[404] = {
            description: 'Tarefa não encontrada',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            error: {
                                type: 'string',
                                example: 'Tarefa não encontrada.'
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[500] = {
            description: 'Erro interno do servidor',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            error: {
                                type: 'string',
                                example: 'Erro interno do servidor'
                            }
                        }
                    }
                }
            }
        }
    */
    
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: 'ID inválido. Verifique o ID da tarefa e tente novamente.' });
    }

    db.run("UPDATE tarefas SET pendente = 0 WHERE id = ?", [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada.' });
        }

        res.json({ message: 'Tarefa atualizada com sucesso.' });
    });
};


module.exports = {
    cadastrarTarefa,
    buscarTarefasPendentes,
    concluirTarefa
};
