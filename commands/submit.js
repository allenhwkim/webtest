'use strict';
var webtestDriver = require('../src/web-test-driver');

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

      return webtestDriver
        .findBy('css', selector)
        .then(element => element.click());
    }
};
