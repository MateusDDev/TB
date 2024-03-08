import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import SequelizeMatch from '../database/models/SequelizeMatch';
import matchMock from './mocks/match.mock';
import JWT from '../utils/JWT';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes da rota Matches', () => {
    let chaiHttpResponse: Response;

    it('Testa se retorna todas as partidas corretamente', async () => {
        sinon.stub(SequelizeMatch, 'findAll').resolves(matchMock.matches as any)

        chaiHttpResponse = await chai.request(app).get('/matches');

        expect(chaiHttpResponse.status).to.be.equal(200);
        expect(chaiHttpResponse.body).to.be.deep.equal(matchMock.matches);
    });

    it('Testa se filtra as partidas corretamente', async () => {
        sinon.stub(SequelizeMatch, 'findAll').resolves([matchMock.matches[0]] as any)

        chaiHttpResponse = await chai.request(app).get('/matches?inProgress=true');

        expect(chaiHttpResponse.status).to.be.equal(200);
        expect(chaiHttpResponse.body).to.be.deep.equal([matchMock.matches[0]]);
    });

    it('Testa se retorna uma mensagem de erro caso seja a query seja inválida', async () => {
        sinon.stub(SequelizeMatch, 'findAll').resolves([matchMock.matches[1]] as any)

        chaiHttpResponse = await chai.request(app).get('/matches?inProgress=InvalidQuery');

        expect(chaiHttpResponse.status).to.be.equal(400);
        expect(chaiHttpResponse.body).to.be.deep.equal({ message: "Invalid query, expected \"true\" or \"false\"" });
    });

    it('Testa se atualiza uma partida pelo id', async () => {
        sinon.stub(SequelizeMatch, 'update').resolves([1]);
        sinon.stub(JWT, 'sign').returns('validToken');
        sinon.stub(JWT, 'verify').returns({ email: 'admin@admin.com' })

        chaiHttpResponse = await chai.request(app)
            .patch('/matches/1')
            .set('authorization', 'validToken')
            .send({
                homeTeamGoals: 3,
                awayTeamGoals: 1,
            });

        expect(chaiHttpResponse.status).to.be.equal(200);
        expect(chaiHttpResponse.body).to.be.deep.equal({ message: "Match updated" });
    });

    afterEach(() => {
        sinon.restore();
    })
})