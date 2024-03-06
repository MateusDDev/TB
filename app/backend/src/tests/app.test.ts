import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';


chai.use(chaiHttp);

const { expect } = chai;

describe('Testes do App', () => {
  /**
   * Exemplo do uso de stubs com tipos
   */

  let chaiHttpResponse: Response;

  // before(async () => {
  //   sinon
  //     .stub(Example, "findOne")
  //     .resolves({
  //       ...<Seu mock>
  //     } as Example);
  // });

  // after(()=>{
  //   (Example.findOne as sinon.SinonStub).restore();
  // })

  // it('...', async () => {
  //   chaiHttpResponse = await chai
  //      .request(app)
  //      ...

  //   expect(...)
  // });

  it('Verifica se a API está no ar', async () => {
    chaiHttpResponse = await chai.request(app).get('/');

    expect(chaiHttpResponse.body).to.be.deep.equal({ ok: true });
    expect(chaiHttpResponse.status).to.be.equal(200);
  });

  afterEach(() => {
    sinon.restore();
  })
});
