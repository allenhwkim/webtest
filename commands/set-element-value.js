'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"
const RE_STR_WITH_QUOTE = '[\'"]?([\\s\\S]*)[\'"]?'; //e.g. 'foo bar', "foo bar"

module.exports = {
  name: 'set element value',
  help: 'set element <selector> value "<string>"',
  regExp: new RegExp(`^set element ${RE_STR} value [as ]*${RE_STR_WITH_QUOTE}$`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(selector, value) {
    let cssSelector = `${selector}, [placeholder='${selector}']`;
    value = value || "";
    return webtestDriver.driver.wait( function() {
      return webtestDriver.driver.findElement({css: cssSelector})
        .then(element => {
          return webtestDriver.driver.executeScript(`
            arguments[0].value = '${value}';
            arguments[0].setAttribute('value', '${value}');
            arguments[0].dispatchEvent(new Event('change'));
            return true;
          `, element);
        })
    }, webtestDriver.config.timeout);
  }
};
