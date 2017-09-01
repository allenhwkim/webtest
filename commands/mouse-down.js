'use strict';
var webtestDriver = require('../src/web-test-driver');
var retry = require('../src/webdriverjs-retry');

module.exports = {
  name: 'mouse down',
  help: 'mouse down on a last found element',
  regExp: new RegExp(`^mouse down`),
  func: /** must return a Promise, so that it can be chained with next command*/
    function() {
      webtestDriver.driver.sleep(100); //To prevent stale element error
      let fn = () => {
        let element = Promise.resolve(webtestDriver.lastFoundElement);
        element.then(element => webtestDriver.driver.actions().mouseMove(element).mouseDown().perform());
      };
      return retry.run(fn, 5000, 200);
    }
};
