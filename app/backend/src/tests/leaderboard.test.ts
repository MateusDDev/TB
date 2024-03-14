import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import leaderboardMock from './mocks/leaderboard.mock';
import matchMock from './mocks/match.mock';
import SequelizeMatch from '../database/models/SequelizeMatch';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes da rota leaderboard', () => {
    let chaiHttpResponse: Response;

    it('Testa se retorna a classificação de partidas em casa corretamente', async () => {
        sinon.stub(SequelizeMatch, 'findAll').resolves(matchMock.matches as any);

        chaiHttpResponse = await chai.request(app).get('/leaderboard/home');

        expect(chaiHttpResponse.status).to.be.equal(200);
        expect(chaiHttpResponse.body).to.be.deep.equal(leaderboardMock.homeLeaderboard);
    })

    it('Testa se retorna a classificação de partidas fora de casa corretamente', async () => {
        sinon.stub(SequelizeMatch, 'findAll').resolves(matchMock.matches as any);

        chaiHttpResponse = await chai.request(app).get('/leaderboard/away');

        expect(chaiHttpResponse.status).to.be.equal(200);
        expect(chaiHttpResponse.body).to.be.deep.equal(leaderboardMock.awayLeaderboard);
    })

    afterEach(() => {
        sinon.restore();
    })
})