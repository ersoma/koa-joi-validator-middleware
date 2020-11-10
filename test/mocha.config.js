'use strict';

const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');

global.expect = chai.expect;

before(function() {
  chai.use(sinonChai);
  chai.use(chaiAsPromised);
});

beforeEach(function() {
  this.sandbox = sinon.createSandbox();
});

afterEach(function() {
  this.sandbox.restore();
});
