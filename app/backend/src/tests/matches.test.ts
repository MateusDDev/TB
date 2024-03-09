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
    const JWTToken = 'validToken';

    beforeEach(() => {
        sinon.stub(JWT, 'sign').returns(JWTToken);
        sinon.stub(JWT, 'verify').returns({ email: 'admin@admin.com' })
    })

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

        chaiHttpResponse = await chai.request(app)
            .patch('/matches/1')
            .set('authorization', JWTToken)
            .send({
                homeTeamGoals: 3,
                awayTeamGoals: 1,
            });

        expect(chaiHttpResponse.status).to.be.equal(200);
        expect(chaiHttpResponse.body).to.be.deep.equal({ message: "Match updated" });
    });

    it('Testa se uma partida é cadastrada corretamente', async () => {
        sinon.stub(SequelizeMatch, 'create').resolves(matchMock.createdMatch as any);

        chaiHttpResponse = await chai.request(app)
            .post('/matches')
            .set('authorization', JWTToken)
            .send(matchMock.newMatch)

        expect(chaiHttpResponse.status).to.be.equal(201);
        expect(chaiHttpResponse.body).to.be.deep.equal(matchMock.createdMatch);
    })

    it('Testa se retorna uma mensagem de erro caso sejam passados dois times iguais', async () => {
        sinon.stub(SequelizeMatch, 'create').resolves({} as any);

        chaiHttpResponse = await chai.request(app)
            .post('/matches')
            .set('authorization', JWTToken)
            .send(matchMock.invalidNewMatch)

        expect(chaiHttpResponse.status).to.be.equal(422);
        expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'It is not possible to create a match with two equal teams' });
    })

    it('Testa se retorna uma mensagem de erro caso seja passado um time que não existe', async () => {
        sinon.stub(SequelizeMatch, 'create').resolves({} as any);

        chaiHttpResponse = await chai.request(app)
            .post('/matches')
            .set('authorization', JWTToken)
            .send(matchMock.matchWithInvalidTeam)

        expect(chaiHttpResponse.status).to.be.equal(404);
        expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'There is no team with such id!' });
    })

    afterEach(() => {
        sinon.restore();
    })
})