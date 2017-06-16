'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_URL  = '([\\S]+)';            // e.g. foo.bar, "foo.bar", or 'foo.bar'. not "foo bar"

module.exports = {
  name: 'go to',
  help: 'go to <url>',
  regExp: new RegExp(`^go to ${RE_URL}`),
  func:
    /** must return a Promise, so that it can be chained with next command*/
    function(url) {
      let fullUrl = (`${webtestDriver.baseUrl||''}${url}`);

      return webtestDriver.driver.get(fullUrl);
    }
};
