'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_STR_WITH_QUOTE = '[\'"]([\\s\\S]+)[\'"]'; //e.g. 'foo bar', "foo bar"

/**
 * e.g. click link 'hello world'
 */
module.exports = {
  name: 'click link',
  help: 'click link <link-text>',
  regExp: new RegExp(`^click link ${RE_STR_WITH_QUOTE}`),
  func: /** must return a Promise, so that it can be chained with next command*/
    function(linkText) {
      return seleniumWebTestDriver.findVisibleBy('linkText', linkText)
        .then(element => element.click());
    }
};
