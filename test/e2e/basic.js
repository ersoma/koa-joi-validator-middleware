'use strict';

const axios = require('axios');
const Joi = require('joi');
const FakeServer = require('../fake_server');
const koaJoiValidatorFactory = require('../../src/middleware');
const { expect } = require('chai');
const { assert } = require('joi');

const PORT = 8080;
const URL = `http://localhost:${PORT}`;

describe('tests middleware with default parameters', () => {

  let server;

  afterEach(() => {
    server.stopFakeServer();
  });

  it('shoud respond 500 if body is empty', async () => {
    const schema = Joi.object({ param1: Joi.string().required() }).required();
    const middleware = koaJoiValidatorFactory(schema);
    server = new FakeServer([middleware]);
    await server.startFakeServer(PORT);

    let thrownError;
    try {
      await axios.post(URL);
    } catch (error) {
      thrownError = error;
    }
    expect(thrownError.response.status).to.be.eql(500);
  });
});
