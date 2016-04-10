'use strict';
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var defaultConfig = {
    browser: {
      name: 'chrome',
      left: null,
      top: null,
      width: null,
      height: null
    },
    timeout: 10000
  };

class WebDriverTT {

  constructor(config) {
    Object.assign(this, defaultConfig);
    for (var key in config) {
      if (key === 'browser') {
        for (var key2 in config.browser) {
          this.browser[key2] = config.browser[key2];
        }
      } else {
        this[key] = config[key];
      }
    }
    this.driver = new webdriver.Builder();
  }

  openBrowser(url) {
    console.log('opening browser', this.browser);
      
    this.driver = this.driver
      .forBrowser(this.browser.name||'chrome').build()

    var window = this.driver.manage().window();
    var bConfig = this.browser;
    if (parseInt(bConfig.left) >= 0 && parseInt(bConfig.top) >= 0) {
      window.setPosition(bConfig.left, bConfig.top);
    }
    if (parseInt(bConfig.width) >= 0 && parseInt(bConfig.height) >= 0) {
      window.setSize(bConfig.width,  bConfig.height);
    }

    return this.driver.get(url)
  }

  closeBrowser() {
    this.driver.quit();
  }

  visit(url) {
    return this.driver.get(url);
  }

  /**
   * returns ManagedPromise<Element>
   */
  moveMouseTo(locator) {
    locator = typeof locator === 'string' ? {css: locator} : locator;
    return this.driver.wait(until.elementLocated(locator), this.timeout)
      .then((element) => {
        return this.driver.actions().mouseMove(element).perform()
          .then( () => element );
      })
  };

  /**
   * returns ManagedPromise<Element>
   */
  find(locator) {   // ManagedPromise<Element>
    return this.moveMouseTo(locator)
      .then((element) => element);
  };

  /**
   * returns ManagedPromise<Element>
   */
  click(locator) {   // ManagedPromise<Element>
    return this.moveMouseTo(locator)
      .then(function(element) {
         element.click();
         return element;
       })
  }

  /**
   * returns ManagedPromise<Element>
   */
  enterTextInto(locator, text) {
    return this.moveMouseTo(locator)
      .then(function(element) {
        element.clear();
        element.sendKeys(text);
        return element;
      })
  };

  /**
   * returns ManagedPromise<Element>
   */
  waitUntil(arg0, arg1, arg2) {
    let condition;
    switch (arg0) {
      case 'alertIsPresent':
        condition = until[arg0](); break;
      case 'titleIs':
      case 'titleContains':
      case 'titleMatches':
      case 'elementLocated':
      case 'elementIsVisible':
      case 'elementIsNotVisible':
      case 'elementIsEnabled':
      case 'elementIsDisabled':
      case 'elementIsSelected':
      case 'elementIsNotSelected':
        condition = until[arg0](arg1); break;
      case 'elementTextIs':
      case 'elementTextContains':
      case 'elementTextMatches':
        condition = until[arg0](arg1, arg2); break;
    }
    console.log('wait until', arg0, [arg1, arg2].join(' '));

    return this.driver.wait(condition, this.timeout)
      .then( resp => resp )
  };

}

module.exports = WebDriverTT;
