const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('../routes/taskRoutes');
const routerUser = require('../routes/userRoutes');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
app.use(bodyParser.json());
app.use('/api/usuario', routerUser);

let db;

// Configuração do banco de dados em memória
beforeAll(async () => {
    db = await open({
        filename: ':memory:',
        driver: sqlite3.Database,
    });

    await db.exec(`
        CREATE TABLE usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL
        )
    `);

    await db.exec(`
        CREATE TABLE tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tarefa TEXT NOT NULL,
            prioridade INTEGER NOT NULL,
            pendente INTEGER NOT NULL,
            usuarioId INTEGER NOT NULL,
            FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
        )
    `);

    const hashedPassword = await bcrypt.hash('senha123', 10);
    await db.run("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", ['João', 'joao@example.com', hashedPassword]);

    await db.run("INSERT INTO tarefas (tarefa, prioridade, pendente, usuarioId) VALUES (?, ?, ?, ?)", ['Comprar pão', 1, 1, 1]);
    await db.run("INSERT INTO tarefas (tarefa, prioridade, pendente, usuarioId) VALUES (?, ?, ?, ?)", ['Comprar leite', 3, 1, 1]);
});

afterAll(async () => {
    await db.close();
});

describe('GET /api/tarefa/BuscarTarefasPendentes', () => {
    let token;

    beforeAll(async () => {
        const response = await request(app)
            .post('/api/usuario/login')
            .send({
                email: 'joao@example.com',
                senha: 'senha123'
            });

        token = response.body.token;
    });

    test('Deve buscar todas as tarefas pendentes de um usuário com sucesso', async () => {

        app.use('/api/tarefa', router);

        const response = await request(app)
            .get('/api/tarefa/BuscarTarefasPendentes')
            .set('Authorization', `Bearer ${token}`);       

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(2);
    });

    test('Não deve buscar tarefas pendentes sem autenticação', async () => {
        const response = await request(app)
            .get('/api/tarefa/BuscarTarefasPendentes');

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'Acesso negado. Nenhum token fornecido.');
    });
});
