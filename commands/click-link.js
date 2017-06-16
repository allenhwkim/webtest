'use strict';
var webtestDriver = require('../src/web-test-driver');
var retry = require('webdriverjs-retry');

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
      var fn = () => {
        webtestDriver.findBy('linkText', linkText)
        .then(element => {
          return element.click()
        });
      };
      return retry.run(fn, 5000, 200);
    }
};
