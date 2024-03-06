import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import { teams } from './mocks/teams.mock';
import SequelizeTeam from '../database/models/SequelizeTeam';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes da rota Teams', () => {
    let chaiHttpResponse: Response;

    it('Testa se retorna todos os times corretamente', async () => {
        sinon.stub(SequelizeTeam, 'findAll').resolves(teams as any)

        chaiHttpResponse = await chai.request(app).get('/teams');

        expect(chaiHttpResponse.status).to.be.equal(200);
        expect(chaiHttpResponse.body).to.be.deep.equal(teams);
    })
})