import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import leaderboardMock from './mocks/leaderboard.mock';
import matchMock from './mocks/match.mock';
import MatchService from '../services/MatchService';
import SequelizeMatch from '../database/models/SequelizeMatch';
import LeaderboardService from '../services/LeaderboardService';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes da rota leaderboard', () => {
    let chaiHttpResponse: Response;

    it('Testa se retorna uma tabela corretamente', async () => {
        sinon.stub(SequelizeMatch, 'findAll').resolves(matchMock.matches as any);

        chaiHttpResponse = await chai.request(app).get('/leaderboard/home');

        expect(chaiHttpResponse.status).to.be.equal(200);
        expect(chaiHttpResponse.body).to.be.deep.equal(leaderboardMock.board);
    })
})