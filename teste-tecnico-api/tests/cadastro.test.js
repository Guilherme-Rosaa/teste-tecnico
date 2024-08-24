const request = require('supertest');
const app = require('../server');

describe('POST /api/usuario/Cadastrar', () => {
    test('Deve criar um novo usuário com sucesso', async () => {

        let email = "gabriel@example.com"

        const response = await request(app)
            .post('/api/usuario/Cadastrar')
            .send({
                nome: 'Maria',
                email: email,
                senha: 'senha123'
            });



        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('nome', 'Maria');
        expect(response.body).toHaveProperty('email', email);
    });

    test('Não deve criar usuário se o email já existir', async () => {
        const response = await request(app)
            .post('/api/usuario/Cadastrar')
            .send({
                nome: 'João',
                email: 'joao@example.com',
                senha: 'senha123'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Usuário já existe');
    });
});
