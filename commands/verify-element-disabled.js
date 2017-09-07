'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"

module.exports = {
  name: 'verify element disabled',
  help: 'verify element <selector> disabled',
  regExp: new RegExp(`^verify element ${RE_STR} [is ]*disabled`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(selector) {
    selector = selector.replace(/ is/g,'');
    return webtestDriver.waitUntil('elementIsDisabled', selector)
      .then(element => webtestDriver.lastFoundElement = element)
      .then(element => webtestDriver.showCircleOn(element));
  }
};
