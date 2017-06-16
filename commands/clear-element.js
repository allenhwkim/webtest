'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar"

/**
 * e.g. enter text 'foo bar' into .foo.bar
 */
module.exports = {
  name: 'clear element',
  help: 'clear "<selector>"',
  regExp: new RegExp(`^clear ${RE_STR}`),
  func: /** must return a Promise, so that it can be chained with next command*/
    function(selector) {

      return webtestDriver.findBy('css', selector)
        .then(element => element.clear())
    }
};
