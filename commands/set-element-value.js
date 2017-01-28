'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"

module.exports = {
  name: 'set element value',
  help: 'set element <selector> value <value>',
  regExp: new RegExp(`^set element ${RE_STR} value ${RE_STR}`),
  func:
    function(selector, value) {
      return seleniumWebTestDriver.findBy('css', selector)
        .then(element => {
          // console.log('element', element.constructor.name)
          seleniumWebTestDriver.driver.executeScript(
            `
              arguments[0].value = '${value}';
              arguments[0].dispatchEvent(new Event('change'));
            `,
            element
          );
          seleniumWebTestDriver.lastFoundElement = element;
        });
    }
};

