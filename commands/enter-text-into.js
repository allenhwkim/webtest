'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"
const RE_STR_WITH_QUOTE = '[\'"]([\\s\\S]+)[\'"]'; //e.g. 'foo bar', "foo bar"

/**
 * e.g. enter text 'foo bar' into .foo.bar
 */
module.exports = {
  name: 'enter text',
  help: 'enter text <string> into <selector>',
  regExp: new RegExp(`^enter text ${RE_STR_WITH_QUOTE} into ${RE_STR}`),
  func: /** must return a Promise, so that it can be chained with next command*/
    function(text, selector) {
      return webtestDriver.findBy('css', selector)
        .then(element =>  element.sendKeys(text));
    }
};
