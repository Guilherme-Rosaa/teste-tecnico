const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
require('dotenv').config();

const cadastrarUsuario = async (req, res) => {
    /*
        #swagger.tags = ['Usuarios']
        #swagger.summary = 'Criar novo usuário'
        #swagger.description = 'Esse endpoint cria um novo usuário.'
        #swagger.requestBody = {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            nome: {
                                type: 'string',
                                example: 'João Silva'
                            },
                            email: {
                                type: 'string',
                                example: 'joao.silva@example.com'
                            },
                            senha: {
                                type: 'string',
                                example: 'senha123'
                            }
                        },
                        required: ['nome', 'email', 'senha']
                    }
                }
            }
        }
        #swagger.responses[201] = {
            description: 'Usuário criado com sucesso',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'integer',
                                example: 1
                            },
                            nome: {
                                type: 'string',
                                example: 'João Silva'
                            },
                            email: {
                                type: 'string',
                                example: 'joao.silva@example.com'
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[400] = {
            description: 'Usuário já existe',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            error: {
                                type: 'string',
                                example: 'Usuário já existe'
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
    const { nome, email, senha } = req.body;

    try {
        db.get("SELECT * FROM usuarios WHERE email = ?", [email], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (user) {
                return res.status(400).json({ error: 'Usuário já existe' });
            }

            const hashedPassword = await bcrypt.hash(senha, saltRounds);
            db.run("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", [nome, email, hashedPassword], function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ id: this.lastID, nome, email });
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    /*
        #swagger.tags = ['Usuarios']
        #swagger.summary = 'Fazer login'
        #swagger.description = 'Esse endpoint faz o login com email e senha e retorna um token para autenticação nos outros endpoints.'
        #swagger.requestBody = {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            email: {
                                type: 'string',
                                example: 'joao.silva@example.com'
                            },
                            senha: {
                                type: 'string',
                                example: 'senha123'
                            }
                        },
                        required: ['email', 'senha']
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Login bem-sucedido, retorna um token de autenticação',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            token: {
                                type: 'string',
                                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[401] = {
            description: 'Senha incorreta',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            error: {
                                type: 'string',
                                example: 'Senha incorreta'
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[404] = {
            description: 'Usuário não encontrado',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            error: {
                                type: 'string',
                                example: 'Usuário não encontrado'
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
    const { email, senha } = req.body;

    db.get("SELECT * FROM usuarios WHERE email = ?", [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        try {
            const match = await bcrypt.compare(senha, user.senha);
            if (match) {
                const token = jwt.sign(
                    { usuarioId: user.id, nomeUsuario: user.nome },
                    process.env.SECRET_KEY,
                    { expiresIn: '1h' }
                );

                res.json({ token });
            } else {
                res.status(401).json({ error: 'Senha incorreta' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};



module.exports = {
    cadastrarUsuario,
    login
};
