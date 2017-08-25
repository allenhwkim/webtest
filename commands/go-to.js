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
      return webtestDriver.driver.executeScript(`window.location.href = '${fullUrl}';`)
        .then( () => { // wait for page to load
           return webtestDriver.driver.wait( function() {
             return webtestDriver.driver.executeScript('return document.readyState')
               .then(function(resp) {
                 return resp === 'complete';
               })
          }, webtestDriver.config.timeout);
        });
    }
};
