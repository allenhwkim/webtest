'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');

module.exports = {
  name: 'submit',
  help: 'submit',
  regExp: new RegExp(`^submit`),
  func: /** must return a Promise, so that it can be chained with next command*/
    function() {
      let selector =
        'input[type="submit"],'+
        ' button[type="submit"],'+
        ' form button:not([type])';

      return seleniumWebTestDriver
        .findBy('css', selector)
        .then(element => element.click());
    }
};
