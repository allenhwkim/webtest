'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_EXPRESSION_STR = `["'](.*?)["']`;
const RE_VARIABLE    = `['"]?([a-z$]?[a-zA-Z0-9_]*)["']?`;

module.exports = {
  name: 'run script and save',
  help: 'run script "<expressions>"( and save to )?<variable>',
  regExp: new RegExp(`^run script ${RE_EXPRESSION_STR}( and save to )?${RE_VARIABLE}`),
  func: function(expressionStr, save, variableName) {
    let func = `function webtestFunc() { ${expressionStr} }`;
    let expr;
    if (save) {
      expr = `return window['${variableName}']=(${func})();`
    } else {
      expr = `(${func})();`
    }
    return seleniumWebTestDriver.driver.executeScript(expr)
      .then(result => {
        save && console.log(result);
        return seleniumWebTestDriver.lastFoundElement;
      });
  }
};
