'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_STR = '([\\s\\S]+?)'; //e.g. 'foo bar', "foo bar"

module.exports = {
  name: 'switch to',
  help: 'switch to <target> <name-or-id>',
  regExp: new RegExp(`^switch to (frame|alert|defaultContent)[ ]?${RE_STR}$`, 'i'),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(target, nameOrId) {
    let alert;
    return webtestDriver.driver.switchTo()[target](nameOrId)
      .then( element => {
        webtestDriver.lastFoundElement = element;
        if (target === 'defaultContent') {
          delete webtestDriver.switchedTo;
        } else {
          webtestDriver.switchedTo = { target: target, nameOrId: nameOrId };
        }
      })
      .then(() => webtestDriver.driver.sleep(webtestDriver.config.speed))
      .then(() => webtestDriver.lastFoundElement);
  }
};
