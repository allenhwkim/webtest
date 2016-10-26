'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');

module.exports = {
  name: 'click button in alert',
  help: 'click <text> button in alert',
  regExp: new RegExp(`^click (ok|cancel) in alert$`, 'i'),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(okOrCancel) {
    return seleniumWebTestDriver
      .waitUntil('alertIsPresent')
      .then(el => seleniumWebTestDriver.lastElement = el)
      .then(() => {
        let alert = seleniumWebTestDriver.driver.switchTo().alert();
        if (okOrCancel.toUpperCase() === 'OK') {
          alert.accept();
        } else {
          alert.dismiss();
        }
        seleniumWebTestDriver.driver.switchTo().defaultContent();
        return true;
      });
  }
};
