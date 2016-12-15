'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_EXPRESSIONS = '["](.*)["]';
const RE_VARIABLE    = '([a-z$][a-zA-Z0-9_]+)';

module.exports = {
  name: 'save value of expression',
  help: 'save value of expression "<expressions>" to <variable>',
  regExp: new RegExp(`^save value of expression ${RE_EXPRESSIONS} to ${RE_VARIABLE}`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(expressions, variableName) {
    for(var expression in expressions) {
      seleniumWebTestDriver.variables[variableName] = eval(expression);
    }
    return seleniumWebTestDriver.lastFoundElement;
  }
};
