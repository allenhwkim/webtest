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
    speed: null
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
    this.lastElement;
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

    return this.driver.get(url);
  }

  closeBrowser() {
    this.driver.quit();
  }

  visit(url) {
    reporter.log('visit', url);
    return this.driver.get(url);
  }

  /**
   * returns ManagedPromise<Element>
   */
  __findBy(by, string) {
    let locator;
    if (by == "linkText") {
      locator = {linkText: string};
    } else if (by == "css" && string.match(/[a-z0-9]*[\#\[\=\.][a-z]/i)) { //id, class, attribute
      locator = {css: string};
    } else if (by == "css") {
      locator = {
        css: `input[placeholder='${string}'], textarea[placeholder='${string}'], input[value='${string}']`
      };
    }
    console.log('locator', locator);
      
    return this.driver.wait(
        until.elementLocated(locator), this.timeout
      )
      .then(el => {
        this.lastElement = el
        return this.driver.actions().mouseMove(el).perform()
      })
      .then(() => this.driver.sleep(this.speed))
      .then(() => this.lastElement)
  }

  /**
   * returns ManagedPromise<Element>
   */
  see(string) {
    reporter.log('see', string);
    let xpath =
      `//*[contains(., '${string}')][not(.//*[contains(., '${string}')])]`;
    return this.driver.wait(
        until.elementLocated({xpath: xpath}), this.timeout
      )
      .then(el => {
        this.lastElement = el;
        return this.driver.actions().mouseMove(el).perform()
      })
      .then(() => this.driver.sleep(this.speed))
      .then(() => this.lastElement)
  }

  /**
   * returns ManagedPromise<Element>
   */
  click(string) { 
    reporter.log('click', string||'');
    if (string) {
      return this.__findBy('css', string)
        .then(element => {
           this.lastElement = element;
           element.click();
           return element;
         })
    } else {
      return this.lastElement.click();
    }
  }

  /**
   * returns ManagedPromise<Element>
   */
  clickLink(string) { 
    reporter.log('click link', string);
    return this.__findBy('linkText', string)
      .then(element => {
         this.lastElement = element;
         element.click();
         return element;
       })
  }

  /**
   * returns ManagedPromise<Element>
   */
  submit() { 
    reporter.log('submit')
    return this.__findBy('css', 'input[type="submit"], button[type="submit"], form button:not([type])')
      .then(element => {
        this.lastElement = element;
         element.click();
         return element;
       })
  }

  /**
   * returns ManagedPromise<Element>
   */
  enterTextInto(string, text) {
    reporter.log('enter', text, 'into', string);
    return this.__findBy('css', string)
      .then(element =>  {
        this.lastElement = element;
        element.clear();
        element.sendKeys(text);
        return element;
      })
  };

  /**
   * returns ManagedPromise<Element>
   */
  waitForPageLoad() {
    reporter.log('wait for page load');
    return this.driver.wait( () => 
        this.driver.executeScript('return document.readyState')
        .then(resp => resp == 'complete')
      , this.timeout
      ).then(() => console.log('page loaded'));
  }

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
