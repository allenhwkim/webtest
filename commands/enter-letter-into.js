'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar"

/**
 * e.g. enter text 'foo bar' into .foo.bar
 */
module.exports = {
  name: 'enter letter into',
  help: 'enter letter <letter> into <selector>',
  regExp: new RegExp(`^enter letter ${RE_STR} into ${RE_STR}`),
  func: /** must return a Promise, so that it can be chained with next command*/
    function(letter, selector) {
      return seleniumWebTestDriver.findBy('css', selector)
        .then(element =>  {
          element.sendKeys(letter);
        });
    }
};
