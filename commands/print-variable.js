'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_VARIABLE    = '["]?([a-z$][a-zA-Z0-9_]+)["]?';

module.exports = {
  name: 'print variable',
  help: 'print variable <variable>',
  regExp: new RegExp(`^print variable ${RE_VARIABLE}`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(variableName) {
    console.log(variableName + ':', seleniumWebTestDriver.variables[variableName]);
    return seleniumWebTestDriver.lastFoundElement;
  }
};
