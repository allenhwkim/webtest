'use strict';
let SeleniumWebDriver = require('selenium-webdriver');
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar"
const RE_STR_WITH_QUOTE = '[\'"]([\\s\\S]+)[\'"]'; //e.g. 'foo bar', "foo bar"
/**
 * e.g. enter text 'foo bar' into .foo.bar
 */
module.exports = {
  name: 'select option',
  help: 'select "<text>" from <selector>',
  regExp: new RegExp(`^select ${RE_STR_WITH_QUOTE} from ${RE_STR}`),
  func: /** must return a Promise, so that it can be chained with next command*/
    function(string, selector) {
      return seleniumWebTestDriver.findBy('css', selector)
        .then(element => element.sendKeys(string))
    }
};
