'use strict';

const Joi = require('joi');

const middlewareFactory = require('./middleware');
const { expect } = require('chai');

describe('koaJoiValidatorMiddleware', () => {

  describe('works as a Koa middleware', () => {
    it('should export a factory function', () => {
      expect(middlewareFactory).to.be.a('function');
    });

    it('should throw an error if required parameter is missing for factory', () => {
      expect(middlewareFactory).to.throw('schema is missing');
    });

    it('should return a function when called', () => {
      const schema = {};
      const middleware = middlewareFactory(schema);
      expect(middleware).to.be.a('function');
    });
  });

  describe('works with default parameters', () => {
    it('should call next if body is valid with given schema', async () => {
      const schema = Joi.object({ param1: Joi.string().required() });
      const fakeCtx = { request: { body: { param1: 'test' } } };
      const next = global.sandbox.stub();

      const middleware = middlewareFactory(schema);
      await middleware(fakeCtx, next);

      expect(next).to.be.calledOnce;
    });

    it('should throw error if body is invalid with given schema', async () => {
      const schema = Joi.object({ param1: Joi.string().required() });
      const fakeCtx = { request: { body: { param1: 1234 } } };
      const fakeNext = () => {};

      const middleware = middlewareFactory(schema);
      await expect(middleware(fakeCtx, fakeNext)).to.be.rejectedWith('validation failed for given schema');
    });
  });
});
