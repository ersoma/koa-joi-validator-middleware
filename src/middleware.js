'use strict';

const Joi = require('joi');

class KoaJoiValidatorMiddleware {
  constructor(schema, {
    onError = 'validation failed for given schema',
    getSubject = ctx => ctx.request.body
  }) {
    this.schema = schema;
    this.onError = onError;
    this.getSubject = getSubject;

    this._validateParameters();

    this.compiledSchema = Joi.compile(schema);
  }

  async execute(ctx, next) {
    const validationResult = this.compiledSchema.validate(this.getSubject(ctx));
    if (validationResult.error) {
      return this._handleValidationError(ctx, next, validationResult.error);
    }
    return next();
  }

  _validateParameters() {
    if (!this.schema) {
      throw new Error('schema parameter is missing');
    }

    const onErrorIsValid = ['string', 'function'].filter(v => v === typeof this.onError).length === 1;
    if (onErrorIsValid === false) {
      throw new Error('onError parameter is invalid');
    }

    if (typeof this.getSubject !== 'function') {
      throw new Error('getSubject parameter is invalid');
    }
  }

  _handleValidationError(ctx, next, error) {
    if (error instanceof Joi.ValidationError === false) {
      throw error;
    }
    if (typeof this.onError === 'string') {
      throw new Error(this.onError);
    } else if (typeof this.onError === 'function') {
      this.onError(ctx, next, error);
    }
  }
}

module.exports = (schema, config = {}) => {
  const instance = new KoaJoiValidatorMiddleware(schema, config);
  return (ctx, next) => instance.execute(ctx, next);
};
