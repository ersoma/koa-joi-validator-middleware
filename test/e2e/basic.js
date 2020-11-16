'use strict';

const axios = require('axios');
const Joi = require('joi');
const FakeServer = require('../fake_server');
const koaJoiValidatorFactory = require('../../src/middleware');
const { expect } = require('chai');

const PORT = 8080;
const URL = `http://localhost:${PORT}`;

describe('tests middleware with default parameters', () => {

  let server;
  const schema = Joi.object({ param1: Joi.string().required() }).required();
  const middleware = koaJoiValidatorFactory(schema);

  afterEach(() => {
    server.stopFakeServer();
  });

  beforeEach(async () => {
    server = new FakeServer([middleware]);
    await server.startFakeServer(PORT);
  });

  it('shoud respond 500 if body is empty', async () => {
    let thrownError;
    try {
      await axios.post(URL);
    } catch (error) {
      thrownError = error;
    }
    expect(thrownError.response.status).to.be.eql(500);
  });

  it('shoud respond 200 if body is correct', async () => {
    const response = await axios.post(URL, { param1: 'hello' });
    expect(response.status).to.be.eql(200);
  });
});
