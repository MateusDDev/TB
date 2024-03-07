import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import SequelizeTeam from '../database/models/SequelizeTeam';
import teamsMock from './mocks/teams.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes da rota Teams', () => {
    let chaiHttpResponse: Response;

    it('Testa se retorna todos os times corretamente', async () => {
        sinon.stub(SequelizeTeam, 'findAll').resolves(teamsMock.teams as any)

        chaiHttpResponse = await chai.request(app).get('/teams');

        expect(chaiHttpResponse.status).to.be.equal(200);
        expect(chaiHttpResponse.body).to.be.deep.equal(teamsMock.teams);
    });

    it('Testa se retorna um time pelo id corretamente', async () => {
        sinon.stub(SequelizeTeam, 'findOne').resolves(teamsMock.team as any);

        chaiHttpResponse = await chai.request(app).get('/teams/5');

        expect(chaiHttpResponse.status).to.be.equal(200);
        expect(chaiHttpResponse.body).to.be.deep.equal(teamsMock.team);
    })

    afterEach(() => {
        sinon.restore();
    })
})