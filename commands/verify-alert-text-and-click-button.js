'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_STR_WITH_QUOTE = '[\'"]?([\\s\\S]+?)[\'"]?'; //e.g. 'foo bar', "foo bar"

module.exports = {
  name: 'verify alert text and click button',
  help: 'verify alert "<string>" and click OK|CANCEL',
  regExp: new RegExp(`^verify alert ${RE_STR_WITH_QUOTE} and click (ok|cancel)$`, 'i'),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(text, button) {
    let alert;
    return webtestDriver.waitUntil('alertIsPresent')
      .then(() => webtestDriver.driver.switchTo().alert())
      .then( ret => {
        alert = ret;
        return alert.getText()
      })
      .then( alertText => {
        if (alertText !== text) {
          throw `ERROR: alert text is not "${text}", but ${alertText}`;
        }
        (button.toUpperCase() === 'OK') ?
          alert.accept() : alert.dismiss();
        return webtestDriver.driver.switchTo().defaultContent();
      })
      .then(() => webtestDriver.driver.sleep(webtestDriver.config.speed))
      .then(() => webtestDriver.lastFoundElement);
  }
};
