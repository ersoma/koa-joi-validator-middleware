'use strict';

const axios = require('axios');
const Joi = require('joi');
const FakeServer = require('./fake_server');
const koaJoiValidatorFactory = require('../src/middleware');
const { expect } = require('chai');

const PORT = 8080;
const URL = `http://localhost:${PORT}`;

describe('Tests koaJoiValidatorFactory middleware', () => {

  let server;
  let middleware;
  const schema = Joi.object({ param1: Joi.string().required() }).required();

  beforeEach(async () => {
    server = new FakeServer([middleware]);
    await server.startFakeServer(PORT);
  });
  afterEach(() => server.stopFakeServer());

  describe('with default parameters', () => {
    before(() => middleware = koaJoiValidatorFactory(schema));

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

  describe('with custom getSubject parameters', () => {
    before(() => middleware = koaJoiValidatorFactory(schema, { getSubject: ctx => ctx.request.query }));

    it('should respond 500 if query string is not correct', async () => {
      let thrownError;
      try {
        await axios.get(URL);
      } catch (error) {
        thrownError = error;
      }
      expect(thrownError.response.status).to.be.eql(500);
    });

    it('shoud respond 200 if query string is correct', async () => {
      const response = await axios.get(`${URL}?param1=test`);
      expect(response.status).to.be.eql(200);
    });
  });

  describe('with custom onError parameters', () => {
    const errorMessage = 'Invalid body, please try again';
    before(() => middleware = koaJoiValidatorFactory(schema, { onError: ctx => ctx.body = errorMessage }));

    it('should respond with custom response if body is missing', async () => {
      const response = await axios.post(URL, {});
      expect(response.data).to.be.eql(errorMessage);
    });
  });
});
