'use strict';
var argv = require('yargs').argv;

let chromedriver = require('chromedriver');
let seleniumWebDriver = require('selenium-webdriver');

let singletonInstance = null;

/**
 * Selenium WebDriver Substitute For Everything Asynchronous Operation
 */
class SeleniumWebTestDriver {

  constructor(config) {
    !singletonInstance && (singletonInstance = this);

    this.driver; //this is completed by open-browser command
    this.config= {};
    this.lastFoundElement = null;

    Object.assign(
      this.config,
      { browser: { name: 'chrome' }, timeout: 10000, speed: 0 },
      config
    );
    console.log('SeleniumWebTestDriver is initialized as', this.config);
    return singletonInstance;
  }

  /**
   * returns ManagedPromise<Element>
   */
  findBy(by, string, isVisible=true) {
    let locator;
    if (by == "linkText") {
      locator = {linkText: string};
    } else if (by == "css"
        && string.match(/[a-z0-9]*[#\[=\.][a-z]/i)) { //id, class, attribute
      locator = {css: string};
    } else if (by == "css") {
      locator = {
        css: `${string}, ` +
        `input[placeholder='${string}'], ` +
        `textarea[placeholder='${string}'], ` +
        `input[value='${string}'], ` +
        `input[title='${string}'] `
      };
    } else if (by === 'xpath') {
      locator = {xpath: string};
    }
    //console.log('SeleniumWebTestDriver#findBy', 'locator', locator);

    return this.driver.wait(
        seleniumWebDriver.until.elementLocated(locator), this.config.timeout
      )
      .then(el => {
        this.lastFoundElement = el;
        return isVisible ? this.driver.actions().mouseMove(el).perform() : null;
      })
      .then(() => this.driver.sleep(this.config.speed))
      .then(() => this.lastFoundElement)
      .catch(e => {throw e;});
  }

  /**
   * returns ManagedPromise<Element>
   */
  waitUntil(arg0, arg1, arg2) {
    let el, condition, locator;

    switch (arg0) {
      case 'alertIsPresent':
        condition = seleniumWebDriver.until[arg0](); break;
      case 'titleIs':
      case 'titleContains':
      case 'titleMatches':
        condition = seleniumWebDriver.until[arg0](arg1); break;
      case 'elementLocated':
        locator = {
          css: `${arg1}, ` +
          `input[placeholder='${arg1}'], ` +
          `textarea[placeholder='${arg1}']`
        };
        condition = seleniumWebDriver.until[arg0](locator); break;
      case 'elementIsVisible':
      case 'elementIsNotVisible':
      case 'elementIsEnabled':
      case 'elementIsDisabled':
      case 'elementIsSelected':
      case 'elementIsNotSelected':
        locator = {
          css: `${arg1}, ` +
          `input[placeholder='${arg1}'], ` +
          `textarea[placeholder='${arg1}']`
        };
        el = this.driver.findElement(locator);
        condition = seleniumWebDriver.until[arg0](el); break;
      case 'elementTextIs':
      case 'elementTextContains':
      case 'elementTextMatches':
        locator = {
          css: `${arg1}, ` +
          `input[placeholder='${arg1}'], ` +
          `textarea[placeholder='${arg1}']`
        };
        this.driver.sleep(50); // To prevent staleness of an element
        el = this.driver.findElement(locator);
        condition = seleniumWebDriver.until[arg0](el, arg2); break;
    }

    return this.driver.sleep(this.config.speed)
      .then(() => this.driver.wait(condition, this.config.timeout));
  }
}
var options = argv.speed ? {speed: argv.speed} : {};
module.exports =  new SeleniumWebTestDriver(options);

