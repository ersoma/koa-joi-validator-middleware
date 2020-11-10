'use strict';

const middlewareFactory = require('./middleware');

describe('koaJoiValidatorMiddleware', () => {

  describe('works as a Koa middleware', () => {
    it('should export a function', () => {
      expect(middlewareFactory).to.be.a('function');
    });

    it('should return a function when called', () => {
      const params = {schema: {}};
      const middleware = middlewareFactory(params);
      expect(middleware).to.be.a('function');
    });
  });

});