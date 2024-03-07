import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import loginMock from './mocks/login.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes da rota Login', () => {
    let chaiHttpResponse: Response;

    it('Se o login for feito com sucesso retorna um token', async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send(loginMock.validLogin);

        expect(chaiHttpResponse.status).to.be.equal(200);
        expect(chaiHttpResponse.body).to.haveOwnProperty('token').that.is.a('string');
    })

    it('Se não for passado um email tem o retorno correto', async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send(loginMock.loginWithoutEmail);

        expect(chaiHttpResponse.status).to.be.equal(400);
        expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'All fields must be filled' });
    })

    it('Se não for passado um password tem o retorno correto', async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send(loginMock.loginWithoutPassword);

        expect(chaiHttpResponse.status).to.be.equal(400);
        expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'All fields must be filled' });
    })

    it('Se for passado um password inválido tem o retorno correto', async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send(loginMock.invalidLogin);

        expect(chaiHttpResponse.status).to.be.equal(401);
        expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'Invalid user' });
    })

    afterEach(() => {
        sinon.restore();
    })
})