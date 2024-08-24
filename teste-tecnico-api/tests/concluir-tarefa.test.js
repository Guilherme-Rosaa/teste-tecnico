const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('../routes/taskRoutes');
const routerUser = require('../routes/userRoutes');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
app.use(bodyParser.json());
app.use('/api/usuario', routerUser);
app.use('/api/tarefa', router);

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

    await db.run("INSERT INTO tarefas (tarefa, prioridade, pendente, usuarioId) VALUES (?, ?, ?, ?)", ['Comprar leite', 3, 1, 2]);
    await db.run("INSERT INTO tarefas (tarefa, prioridade, pendente, usuarioId) VALUES (?, ?, ?, ?)", ['Comprar pão', 1, 1, 2]);
    await db.run("INSERT INTO tarefas (tarefa, prioridade, pendente, usuarioId) VALUES (?, ?, ?, ?)", ['Comprar ovos', 2, 1, 2]);
});

afterAll(async () => {
    await db.close();
});

describe('POST /api/tarefa/Concluir/:id', () => {
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

    test('Deve concluir uma tarefa com sucesso', async () => {
        const response = await request(app)
            .post('/api/tarefa/Concluir/1')
            .set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Tarefa atualizada com sucesso.');
    });

    test('Não deve concluir uma tarefa com ID inválido', async () => {
        const response = await request(app)
            .post('/api/tarefa/Concluir/invalid-id')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'ID inválido. Verifique o ID da tarefa e tente novamente.');
    });

    test('Não deve concluir uma tarefa que não existe', async () => {
        const response = await request(app)
            .post('/api/tarefa/Concluir/999')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Tarefa não encontrada.');
    });
});
