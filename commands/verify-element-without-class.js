'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"

module.exports = {
  name: 'verify element without class',
  help: 'verify element <selector> does not have class <class-name>',
  regExp: new RegExp(`^verify element ${RE_STR} does not have class ${RE_STR}`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(selector, className) {
    return seleniumWebTestDriver.driver.wait( function() {
      return seleniumWebTestDriver.driver.findElement({css: selector})
        .then(element => seleniumWebTestDriver.lastFoundElement = element)
        .then(element => element.getAttribute('class'))
        .then(classNames => classNames.indexOf(className) === -1);
    }, seleniumWebTestDriver.config.timeout);
  }
};
