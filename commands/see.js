'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_STR_WITH_QUOTE = '[\'"]([\\s\\S]+)[\'"]'; //e.g. 'foo bar', "foo bar"

/**
 * e.g. see 'Hello World'
 */
module.exports = {
  name: 'see',
  help: 'see "<text>"',
  regExp: new RegExp(`^see ${RE_STR_WITH_QUOTE}`),
  func: /** must return a Promise, so that it can be chained with next command*/
    function(string) {
      let xpath = `//*[contains(., '${string}')][not(.//*[contains(., '${string}')])]`;
      return webtestDriver.driver.wait( () => {
        return webtestDriver.findBy('xpath', xpath)
          .then(el => {
            if (el.isEnabled()) {
              webtestDriver.lastFoundElement = el;
              return el.isEnabled();
            }
          })
      }, webtestDriver.config.timeout);
    }
};
