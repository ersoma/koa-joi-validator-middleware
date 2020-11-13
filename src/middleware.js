/* eslint no-unused-vars: 0 */
'use strict';

const Joi = require('joi');

module.exports = (schema, {
  onError = 'validation failed for given schema'
} = {}) => {

  if (!schema) {
    throw new Error('schema is missing');
  }

  return async (ctx, next) => {
    try {
      Joi.attempt(ctx.request.body, schema);
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        throw new Error(onError);
      } else {
        throw error;
      }
    }
    await next();
  };

};
