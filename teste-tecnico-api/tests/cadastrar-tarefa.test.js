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
            prioridade TEXT NOT NULL,
            pendente INTEGER NOT NULL,
            usuarioId INTEGER NOT NULL,
            FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
        )
    `);

    const hashedPassword = await bcrypt.hash('senha123', 10);
    await db.run("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", ['João', 'joao@example.com', hashedPassword]);
});

afterAll(async () => {
    await db.close();
});

describe('POST /api/tarefa/CadastrarTarefa', () => {
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

    test('Deve criar uma nova tarefa com sucesso', async () => {

        app.use('/api/tarefa', router);


        const response = await request(app)
            .post('/api/tarefa/CadastrarTarefa')
            .set('Authorization', `Bearer ${token}`)
            .send({
                tarefa: 'Comprar leite',
                prioridade: 3
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('tarefa', 'Comprar leite');
        expect(response.body).toHaveProperty('prioridade', 3);
    });

    test('Não deve criar uma tarefa sem autenticação', async () => {
        const response = await request(app)
            .post('/api/tarefa/CadastrarTarefa')
            .send({
                tarefa: 'Comprar pão',
                prioridade: 1
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'Acesso negado. Nenhum token fornecido.');
    });
});
