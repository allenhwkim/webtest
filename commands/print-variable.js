'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_EXPRESSION_STR = `["'](.*)["\']`;
const RE_VARIABLE    = `['"]?([a-z$][a-zA-Z0-9_]+)["']?`;

module.exports = {
  name: 'print variable',
  help: 'print variable <variable>',
  regExp: new RegExp(`^print variable ${RE_VARIABLE}`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(variableName) {
    let expr = `return window['${variableName}'].toString();`;
    return webtestDriver.driver.executeScript(expr)
      .then(result => {
        console.log(result);
        return webtestDriver.lastFoundElement;
      });
  }
};

