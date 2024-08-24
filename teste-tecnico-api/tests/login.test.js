const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('../routes/userRoutes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



let tokenFInal
const app = express();
app.use(bodyParser.json());
app.use('/api/usuario', router);

let db;

beforeAll(async () => {
    const sqlite3 = require('sqlite3');
    const { open } = require('sqlite');

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

    const hashedPassword = await bcrypt.hash('senha123', 10);
    await db.run("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", ['João', 'joao@example.com', hashedPassword]);
});

afterAll(async () => {
    await db.close();
});

test('Deve fazer login com sucesso', async () => {
    const response = await request(app)
        .post('/api/usuario/Login')
        .send({
            email: 'joao@example.com',
            senha: 'senha123'
        });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    const token = response.body.token;
    tokenFInal = token;
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        expect(decoded).toHaveProperty('usuarioId');
        expect(decoded).toHaveProperty('nomeUsuario');
       
    } catch (e) {
        throw new Error('Token inválido');
    }
});

test('Não deve fazer login com senha incorreta', async () => {
    const response = await request(app)
        .post('/api/usuario/Login')
        .send({
            email: 'joao@example.com',
            senha: 'senhaErrada'
        });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Senha incorreta');
});

test('Não deve fazer login com usuário não encontrado', async () => {
    const response = await request(app)
        .post('/api/usuario/Login')
        .send({
            email: 'naoexiste@example.com',
            senha: 'senha123'
        });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Usuário não encontrado');
});