/* eslint no-unused-vars: 0 */
'use strict';

const Joi = require('joi');

module.exports = (schema, {
  onError = 'validation failed for given schema'
} = {}) => {

  if (!schema) {
    throw new Error('schema parameter is missing');
  }

  const onErrorIsValid = ['string', 'function'].filter(v => v === typeof onError).length === 1;
  if (onErrorIsValid === false) {
    throw new Error('onError parameter is invalid');
  }

  return async (ctx, next) => {
    try {
      Joi.attempt(ctx.request.body, schema);
      await next();
    } catch (error) {
      if (error instanceof Joi.ValidationError === false) {
        throw error;
      }
      if (typeof onError === 'string') {
        throw new Error(onError);
      } else if (typeof onError === 'function') {
        onError(ctx, next, error);
      }
    }
  };

};
