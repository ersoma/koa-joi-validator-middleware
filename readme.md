# koa-joi-validator-middleware

Koa 2 middleware for validating Joi schemas

[![Codeship Status for ersoma/koa-joi-validator-middleware](https://app.codeship.com/projects/a6b0bd5e-e04e-496c-94f1-fe525981ddaa/status?branch=master)](https://app.codeship.com/projects/418184)

## TLDR

**Problem:**
* Have a [Koa 2](https://koajs.com/) web server
* Want to validate with [Joi](https://joi.dev/)

**Solution:**
```JavaScript
const Koa = require('koa');
const Joi = require('joi');
class koaJoiValidator = require('koa-joi-validator-middleware');

const schema = Joi.object({...});
const config = {...};

const app = new Koa();
app.use(koaJoiValidator(schema, config));

app.use(async ctx => {
  // Here you can be sure that the specified validation passed
});
```
## Examples

### 1. Basic usage

By default, only the schema parameter is needed. In this case the middleware will validate the `ctx.request.body` object and throws an Error with a default message if it fails.

```JavaScript
...
const schema = Joi.object({...});

const app = new Koa();
app.use(koaJoiValidator(schema));
...
```

### 2. Custom onError string parameter

You can specify an `onError` key in the second, `config` parameter. If this is a string it overwrites the default error message thrown.

```JavaScript
...
const schema = Joi.object({...});
const config = {
  onError: 'Hey You, send me a proper request!'
};

const app = new Koa();
app.use(koaJoiValidator(schema, config));
...
```

### 3. Custom onError function parameter

The `onError` parameter can be a function as well which is called when the validation fails with the following parameters: `ctx`, `next`, `error`. Here `ctx` and `next` are the standard Koa middleware parameters and `error` is the `ValidationError` returned by Joi.

```JavaScript
...
const schema = Joi.object({...});
const config = {
  onError: ctx => ctx.render('errorPage')
};

const app = new Koa();
app.use(koaJoiValidator(schema, config));
...
```

### 4. Custom getSubject function parameter

By default, the middleware validates the `ctx.request.body` object but this can be overwritten with the `getSubject` function. It takes `ctx` as the input parameter and is expected to return the object that should be validated.

```JavaScript
...
const schema = Joi.object({...});
const config = {
  getSubject: ctx => ctx.session
};

const app = new Koa();
app.use(koaJoiValidator(schema, config));
...
```

## API

Parameter | Optional | Type
--- | --- | ---
schema | no | Joi schema
config | yes | Object
config.onError | yes | String or Function(ctx, next, error)
config.getSubject | yes | Function(ctx)

**Note:** This middleware does not contain Joi as an inner dependency, only as peer dependency. This means it can be updated individually when a new version comes out but it also means you need to install it separately.

