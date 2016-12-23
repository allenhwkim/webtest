'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_EXPRESSION_STR = '["](.*)["]';
const RE_VARIABLE    = '["]?([a-z$][a-zA-Z0-9_]+)["]?';

module.exports = {
  name: 'save value of expression',
  help: 'save value of expression "<expressions>" to <variable>',
  regExp: new RegExp(`^save value of expression ${RE_EXPRESSION_STR} to ${RE_VARIABLE}`),
  func: function(expressionStr, variableName) {
    let driver = seleniumWebTestDriver.driver;
    var fn = Function(expressionStr);
    seleniumWebTestDriver.variables[variableName] = fn();

    //still  need to return a promise, so that it can be chained with next command
    return seleniumWebTestDriver.lastFoundElement;
  }
};
