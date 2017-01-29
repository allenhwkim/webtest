'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"
const RE_STR_WITH_QUOTE = '[\'"]?([\\s\\S]*?)[\'"]?'; //e.g. 'foo bar', "foo bar"

module.exports = {
  name: 'verify element value',
  help: 'verify element <selector> value "<string>"',
  regExp: new RegExp(`^verify element ${RE_STR} value [is ]*${RE_STR_WITH_QUOTE}$`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(selector, value) {
    value = value || '';
    let cssSelector = `${selector}, [placeholder='${selector}']`;
    return seleniumWebTestDriver.driver.wait( function() {
      return seleniumWebTestDriver.driver.findElement({css: cssSelector})
        .getAttribute("value")
        .then( val => val == value);
    }, seleniumWebTestDriver.config.timeout);
  }
};
