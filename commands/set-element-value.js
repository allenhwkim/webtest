'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
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
    return seleniumWebTestDriver.driver.wait( function() {
      return seleniumWebTestDriver.driver.findElement({css: cssSelector})
        .then(element => {
          return seleniumWebTestDriver.driver.executeScript(`
            arguments[0].value = '${value}';
            arguments[0].setAttribute('value', '${value}');
            arguments[0].dispatchEvent(new Event('change'));
            return true;
          `, element);
        })
    }, seleniumWebTestDriver.config.timeout);
  }
};
