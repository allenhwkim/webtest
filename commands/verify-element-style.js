'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"
const RE_STR_WITH_QUOTE = '[\'"]([\\s\\S]+)[\'"]'; //e.g. 'foo bar', "foo bar"

module.exports = {
  name: 'verify element style',
  help: 'verify element <selector> style <style-name> "<style-value>"',
  regExp: new RegExp(`^verify element ${RE_STR} style ${RE_STR} [is ]*${RE_STR_WITH_QUOTE}`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(selector, styleName, styleValue) {
    styleName = styleName.replace(/ is/g,'');
    return webtestDriver.driver.wait( function() {
      return webtestDriver.driver.findElement({css: selector})
        // .then(element => webtestDriver.showCircleOn(element))
        .getCssValue(styleName)
        .then( val => {
          return val === styleValue
        })
    }, webtestDriver.config.timeout);
  }
};
