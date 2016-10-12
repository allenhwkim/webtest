'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_URL  = '([\\S]+)';            // e.g. foo.bar, "foo.bar", or 'foo.bar'. not "foo bar"

module.exports = {
  name: 'go to',
  help: 'go to <url>',
  regExp: new RegExp(`^go to ${RE_URL}`),
  func:
    /** must return a Promise, so that it can be chained with next command*/
    function(url) {
      let fullUrl = (`${seleniumWebTestDriver.baseUrl||''}${url}`);

      return seleniumWebTestDriver.driver.get(fullUrl);
    }
};
