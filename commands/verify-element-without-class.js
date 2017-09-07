'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"

module.exports = {
  name: 'verify element without class',
  help: 'verify element <selector> without class <class-name>',
  regExp: new RegExp(`^verify element ${RE_STR} without class ${RE_STR}`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(selector, className) {
    return webtestDriver.driver.wait( function() {
      return webtestDriver.driver.findElement({css: selector})
        .then(element => webtestDriver.lastFoundElement = element)
        .then(element => webtestDriver.showCircleOn(element))
        .then(element => element.getAttribute('class'))
        .then(classNames => classNames.split(' ').indexOf(className) === -1);
    }, webtestDriver.config.timeout);
  }
};
