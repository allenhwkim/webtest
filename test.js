/**
 * this is to try webdriver commands for new development
 * this is not an official test
 * please use `npm test` for the test of this module
 */
require('chromedriver');
var webdriver = require('selenium-webdriver');
var driver = new webdriver.Builder().forBrowser('chrome').build();
var promise = webdriver.promise;

driver.get('http://www.google.com/ncr');

driver.wait( () => {
    var elements = driver.findElements({css: 'input'});
    return promise.filter(elements, el => el.isDisplayed());
  }, 1000)
  .then(els => els[0])
  .then(el => el.sendKeys('hello world'))

