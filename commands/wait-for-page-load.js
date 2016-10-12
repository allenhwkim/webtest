'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');

module.exports = {
  name: 'wait for page load',
  help: 'wait for page load',
  regExp: new RegExp(`^wait for page load`),
  func: /** must return a Promise, so that it can be chained with next command*/
    function() {
      return seleniumWebTestDriver.driver.wait( function() {
        return seleniumWebTestDriver.driver.executeScript('return document.readyState')
          .then(function(resp) {
            return resp === 'complete';
          })
      }, seleniumWebTestDriver.config.timeout);
    }
};
