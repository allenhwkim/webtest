'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
var assert = require('assert');
const RE_STR_WITH_QUOTE = '["]([^"]+)["]'; //e.g. 'foo bar', "foo bar"

function prefixVariable(str) {
  if (str.match(/^[a-z_A-Z]/)) { // if it is a varialbe, prefix it
    return `seleniumWebTestDriver.variables.${str}`;
  } else {
    return str;
  }
}

module.exports = {
  name: 'verify expression',
  help: 'verify expression "<expression>"',
  regExp: new RegExp(`^verify expression ${RE_STR_WITH_QUOTE}`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(expression) {
    let parsed = expression.match(/^([^\s]+)\s([^\s]+)\s(.*)/);
    let leftSide  = parsed[1];
    let operator  = parsed[2];
    let rightSide = parsed[3];
    if (operator === '=') {
      throw "Invalid operator for verify expression";
    }

    let evalString = `${prefixVariable(leftSide)} ${operator} ${prefixVariable(rightSide)}`;
    assert(eval(evalString));

    return seleniumWebTestDriver.lastFoundElement;
  }
};
