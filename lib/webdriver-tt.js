'use strict';
require('chromedriver');
var Reporter = require('./reporter'),
    reporter = new Reporter();
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
    timeout: 10000,
    speed: null,
    highlight: true
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
    this.highlightedEl;
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

    return this.driver.get(url).then(() => {
      this.driver.executeScript(`
        var style = document.createElement('style');
        style.innerHTML = 
          '*[wdtt-highlight] {background-color: yellow;}';
        document.body.appendChild(style);
      `);
    });
  }

  closeBrowser() {
    this.driver.quit();
  }

  visit(url) {
    reporter.log('visit', url);
    if (this.hilightedEl) { //remove existing highlight
      this.driver.executeScript(`
          arguments[0].removeAttribute('wdtt-highlight');
        `, this.hilightedEl);
    };
    return this.driver.get(url);
  }

  /**
   * returns ManagedPromise<Element>
   */
  moveMouseTo(locator) {
    locator = typeof locator === 'string' ? {css: locator} : locator;
    let element;
    return this.driver.wait(until.elementLocated(locator), this.timeout)
      .then(el => 
        (element = el) && this.driver.actions().mouseMove(el).perform()
      )
      .then(() => this.driver.sleep(this.speed))
      .then(() => {
        if (this.highlight) {
          this.driver.executeScript(`
              arguments[0] &&
                arguments[0].removeAttribute('wdtt-highlight');
              arguments[1].setAttribute('wdtt-highlight', '');
            `, this.highlightedEl, element);
          this.highlightedEl = element;
        }
        return element;
      });
  };

  /**
   * returns ManagedPromise<Element>
   */
  find(locator) {   // ManagedPromise<Element>
    reporter.log('find', locator);
    return this.moveMouseTo(locator)
      .then((element) => element);
  };

  /**
   * returns ManagedPromise<Element>
   */
  click(locator) {   // ManagedPromise<Element>
    reporter.log('click', locator);
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
    reporter.log('enter', text, 'into', locator);
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

    reporter.log('wait until', arg0, [arg1, arg2].join(' '));
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

    return this.driver.wait(condition, this.timeout);
  };

}

module.exports = WebDriverTT;
