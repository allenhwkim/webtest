'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_STR_WITH_QUOTE = '[\'"]([\\s\\S]+)[\'"]'; //e.g. 'foo bar', "foo bar"

module.exports = {
  name: 'verify alert text',
  help: 'verify alert text is "<string>"',
  regExp: new RegExp(`^verify alert text is ${RE_STR_WITH_QUOTE}$`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(text) {
    return seleniumWebTestDriver
      .waitUntil('alertIsPresent')
      .then(el => seleniumWebTestDriver.lastElement = el)
      .then(() => {
        let alert = seleniumWebTestDriver.driver.switchTo().alert();
        return alert.getText();
      }).then(alertText => {
        if (alertText !== text) {
          throw `alert text is not "${text}"`;
        }
        return true;
      })
  }
};
