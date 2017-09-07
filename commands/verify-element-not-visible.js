'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"

module.exports = {
  name: 'verify element not visible',
  help: 'verify element <selector> not visible',
  regExp: new RegExp(`^verify element ${RE_STR} [is ]*not visible`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(selector) {
    selector = selector.replace(/ is/g,'');
    return webtestDriver.waitUntil('elementIsNotVisible', selector)
      .then(element => webtestDriver.lastFoundElement = element)
      .then(element => webtestDriver.showCircleOn(element));
  }
};
