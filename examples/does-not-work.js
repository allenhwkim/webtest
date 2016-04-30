/**
 * This is to demonstrate a common webdriver coding does not work
 * without explicit wait and chained promises
 */
var webdriver = require('selenium-webdriver'),
    until = webdriver.until;

var driver = new webdriver.Builder().forBrowser('firefox').build();

driver.get('https://run.plnkr.co/plunks/aWTZswhBnUVLg7qyDr83/');

driver.findElement({css:'input'})
  .then(element => element.getAttribute('value'))
  .then(str => console.log('str', str) );

driver.findElement({css:'body'})
  .then(element =>  element.sendKeys('Cheese!') );

driver.findElement({css:'button'})
  .then(element => element.click() );

driver.quit();
