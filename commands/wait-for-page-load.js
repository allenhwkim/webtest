'use strict';
var webtestDriver = require('../src/web-test-driver');

module.exports = {
  name: 'wait for page load',
  help: 'wait for page load',
  regExp: new RegExp(`^wait for page load`),
  func: /** must return a Promise, so that it can be chained with next command*/
    function() {
      return webtestDriver.driver.wait( function() {
        return webtestDriver.driver.executeScript('return document.readyState')
          .then(function(resp) {
            return resp === 'complete';
          })
      }, webtestDriver.config.timeout);
    }
};
