'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_DIRECTION = '(left|right|up|down)'; // e.g. foo.bar, "foo.bar", or "foo bar"
const RE_SELECTOR  = '[\'"]([\\s\\S]+)[\'"]'; //e.g. 'foo bar', "foo bar"
const RE_AMOUNT    = '([0-9]+)';

/**
 * e.g. enter text 'foo bar' into .foo.bar
 */
module.exports = {
  name: 'drag element, then drop',
  help: 'drag element <element> <direction> <amount> pixel, then drop',
  regExp: new RegExp(`^drag element ${RE_SELECTOR} ${RE_DIRECTION} ${RE_AMOUNT} pixel, then drop`),
  func: /** must return a Promise, so that it can be chained with next command*/
    function(selector, direction, amount) {
      let directionObj = {x:0, y:0};
      switch(direction) {
        case "left":  directionObj.x = parseInt(amount)*-1; break;
        case "right": directionObj.x = parseInt(amount)*1;  break;
        case "up":    directionObj.y = parseInt(amount)*-1; break;
        case "down":  directionObj.y = parseInt(amount)*1;  break;
      }
    console.log('directionObj', directionObj, selector, direction, amount);
      return seleniumWebTestDriver.findBy('css', selector)
        .then(element =>  {
          return seleniumWebTestDriver.driver
            .actions()
            .mouseMove(element)
            .mouseDown()
            .mouseMove(directionObj)
            .mouseUp()
            .perform();
        });
    }
};
