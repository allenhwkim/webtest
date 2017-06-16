'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"

module.exports = {
  name: 'show element',
  help: 'show element <selector>',
  regExp: new RegExp(`^show element ${RE_STR}$`),
  func:
    /** must return a Promise, so that it can be chained with next command*/
    function(selector) {
      return webtestDriver.findBy('css', selector)
        .then(element => {
          webtestDriver.lastFoundElement = element;
          element.getOuterHtml().then(html => console.log(html));
        });
    }
};
