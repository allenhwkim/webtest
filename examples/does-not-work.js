/**
 * This is to demonstrate a normal webdriver command does not work
 * without giving explicit wait for every command
 */
var webdriver = require('selenium-webdriver'),
    until = webdriver.until;

var driver = new webdriver.Builder().forBrowser('firefox').build();

driver.get('https://run.plnkr.co/plunks/aWTZswhBnUVLg7qyDr83/');
driver.findElement({css:'input'}).then(function(element) {
  element.getAttribute('value').then(function(str) {
    console.log('str', str); 
  });
});;

driver.findElement({css:'body'}.then(function(element) {
  element.sendKeys('Cheese!');
});;

driver.findElement({css:'button'}).then(function(element) {
  element.click();
});;

driver.quit();
