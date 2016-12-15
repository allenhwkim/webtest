'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_SELECTOR = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"
const RE_VARIABLE = '([a-z$][a-zA-Z0-9_]+)';

module.exports = {
  name: 'save value of element',
  help: 'save value of element "<selector>" to <variable>',
  regExp: new RegExp(`^save value of expression ${RE_SELECTOR} to ${RE_VARIABLE}`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(selector, variableName) {
    let cssSelector = `${selector}, [placeholder='${selector}']`;
    return seleniumWebTestDriver.driver.wait( function() {
      return seleniumWebTestDriver.driver.findElement({css: cssSelector})
        .getAttribute("value")
        .then( val => {
          seleniumWebTestDriver.variables[variable] = eval(expression);
        });
    }, seleniumWebTestDriver.config.timeout);
  }
};
