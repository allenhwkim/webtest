'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_SELECTOR  = '[\'"]([\\s\\S]+)[\'"]'; //e.g. 'foo bar', "foo bar"

/**
 * e.g. mouse down on element "#a #b"
 */
module.exports = {
  name: 'mouse down on a specific element',
  help: 'mouse down on <element>',
  regExp: new RegExp(`^mouse down on element ${RE_SELECTOR}`),
  func: /** must return a Promise, so that it can be chained with next command*/
    function(selector) {
      return webtestDriver.findBy('css', selector)
        .then(element =>  {
          return webtestDriver.driver.actions().mouseMove(element).mouseDown().perform();
        });
    }
};
