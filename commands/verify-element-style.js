'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"
const RE_STR_WITH_QUOTE = '[\'"]([\\s\\S]+)[\'"]'; //e.g. 'foo bar', "foo bar"

module.exports = {
  name: 'verify element style',
  help: 'verify element <selector> style <style-name> is "<style-value>"$',
  regExp: new RegExp(`^verify element ${RE_STR} style ${RE_STR} is ${RE_STR_WITH_QUOTE}`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(selector, styleName, styleValue) {
    return seleniumWebTestDriver.driver.wait( function() {
      return seleniumWebTestDriver.driver.findElement({css: selector})
        .getCssValue(styleName)
        .then( val => {
          return val === styleValue
        })
    }, seleniumWebTestDriver.config.timeout);
  }
};
