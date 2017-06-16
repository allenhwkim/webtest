'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_SELECTOR = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"
const RE_VARIABLE = '["\']?([a-z_$][a-zA-Z0-9_]+)["\']?';

module.exports = {
  name: 'save value of element',
  help: 'save value of element "<selector>" to <variable>',
  regExp: new RegExp(`^save value of element ${RE_SELECTOR} to ${RE_VARIABLE}`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(selector, variableName) {
    let cssSelector = `${selector}, [placeholder='${selector}']`;
    return webtestDriver.driver.wait( function() {
      return webtestDriver.driver.findElement({css: cssSelector})
        .getAttribute("value")
        .then( val => {
          let expr = `return window['${variableName}']=arguments[0];`;
          webtestDriver.driver.executeScript(expr, val);
          return webtestDriver.lastFoundElement;
        });
    }, webtestDriver.config.timeout);
  }
};
