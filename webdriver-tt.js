var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
var driver;
var defaultConfig = {
    browser: 'chrome',
    left: null,
    top: null,
    width: null,
    height: null,
    timeout: 10000
  };
var config = defaultConfig;
var doNothing = function(arg) { return arg};

module.exports = {
  setBrowser: setBrowser,
  openBrowser: openBrowser,
  closeBrowser: closeBrowser,
  find: find,
  moveMouseTo: moveMouseTo,
  enterTextInto: enterTextInto,
  click: click
}


function setBrowser(param) {
  Object.assign(config, param);
}

function openBrowser(url, options) {
  Object.assign(config, options || {});
  console.log('opening', config.browser, 'browser');
    
  driver = new webdriver.Builder()
    .forBrowser(config.browser||'chrome')
    .build()
  if (config.left >= 0 && config.top >= 0) {
    driver.manage().window().setPosition(config.left, config.top);
  }
  if (config.width >= 0 && config.height >= 0) {
    driver.manage().window().setSize(config.width, config.height);
  }
  return driver.get(url)
}

function closeBrowser() {
  driver.quit();
}

/**
 * returns ManagedPromise<Element>
 */
function moveMouseTo(locator) {
  var element;
  return driver.wait(until.elementLocated(locator), config.timeout)
    .then(function(response) {
      element = response;
      return driver.actions().mouseMove(element).perform()
    })
    .then(function() {return element});
};

/**
 * returns ManagedPromise<Element>
 */
function find(locator) {   // ManagedPromise<Element>
  var element;
  return driver.wait(until.elementLocated(locator), config.timeout)
    .then(function(response) {
       element = response;
       return element;
     })
    .then(function() {return element});
};

/**
 * returns ManagedPromise<Element>
 */
function click(locator) {   // ManagedPromise<Element>
  var element;
  return driver.wait(until.elementLocated(locator), config.timeout)
    .then(function(response) {
       element = response;
       return element.click();
     })
    .then(function() {return element});
}

/**
 * returns ManagedPromise<Element>
 */
function enterTextInto(element, text) {
  var element; 
  return driver.wait(until.elementLocated(element), config.timeout)
    .then(function(response) {
      element = response;
      element.clear();
      element.sendKeys(text);
      return element;
    })
};
