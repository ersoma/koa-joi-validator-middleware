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
      expect(middlewareFactory).to.throw('schema parameter is missing');
    });

    it('should return a function when called', () => {
      const schema = {};
      const middleware = middlewareFactory(schema);
      expect(middleware).to.be.a('function');
    });
  });

  describe('uses default parameters', () => {
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

  describe('uses custom onError parameters', async () => {
    it('should throw custom error if body is invalid with given schema', async () => {
      const schema = Joi.object({ param1: Joi.string().required() });
      const fakeCtx = { request: { body: { param1: 1234 } } };
      const fakeNext = () => {};
      const customError = 'this is not good';

      const middleware = middlewareFactory(schema, { onError: customError });
      await expect(middleware(fakeCtx, fakeNext)).to.be.rejectedWith(customError);
    });

    it('should call onError function if body is invalid with given schema', async () => {
      const schema = Joi.object({ param1: Joi.string().required() });
      const fakeCtx = { request: { body: { param1: 1234 } } };
      const fakeNext = () => {};
      const customErrorSpy = global.sandbox.spy();

      const validationError = schema.validate(fakeCtx.request.body);

      const middleware = middlewareFactory(schema, { onError: customErrorSpy });
      await middleware(fakeCtx, fakeNext);
      expect(customErrorSpy).to.be.calledOnce;
      expect(customErrorSpy.args[0][0]).to.be.eql(fakeCtx);
      expect(customErrorSpy.args[0][1]).to.be.eql(fakeNext);
      expect(customErrorSpy.args[0][2].toString()).to.be.eql(validationError.error.toString());
      expect(customErrorSpy.args[0][2] instanceof Joi.ValidationError).to.be.true;
    });

    it('should throw error if factory\'s onError parameter is not a supported type', async () => {
      const schema = Joi.object({ param1: Joi.string().required() });
      const customError = { objectType: 'is not supported' };

      const shouldThrow = () => {
        middlewareFactory(schema, { onError: customError });
      };
      expect(shouldThrow).to.throw('onError parameter is invalid');
    });
  });
});
