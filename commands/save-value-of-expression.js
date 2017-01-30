'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_EXPRESSION_STR = `["'](.*)["\']`;
const RE_VARIABLE    = `['"]?([a-z$][a-zA-Z0-9_]+)["']?`;

module.exports = {
  name: 'save value of expression',
  help: 'save value of expression "<expressions>" to <variable>',
  regExp: new RegExp(`^save value of expression ${RE_EXPRESSION_STR} to ${RE_VARIABLE}`),
  func: function(expressionStr, variableName) {
    let func = `function webtestFunc() { ${expressionStr} }`;
    let expr = `return window['${variableName}']=(${func})();`
    return seleniumWebTestDriver.driver.executeScript(expr)
      .then(result => {
        return seleniumWebTestDriver.lastFoundElement;
      });
  }
};
