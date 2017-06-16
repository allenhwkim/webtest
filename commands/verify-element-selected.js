'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"

module.exports = {
  name: 'verify element selected',
  help: 'verify element <selector> selected',
  regExp: new RegExp(`^verify element ${RE_STR} [is ]*selected`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(selector) {
    selector = selector.replace(/ is/g,'');
    return webtestDriver.waitUntil('elementIsSelected', selector)
      .then(el => webtestDriver.lastFoundElement = el);
  }
};
