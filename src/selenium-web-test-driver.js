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
    let elLocation;
    return this.driver.wait(
        seleniumWebDriver.until.elementLocated(locator), this.config.timeout
      )
      .then(el => {
        this.lastFoundElement = el;
        isVisible && this.driver.actions().mouseMove(el).perform();
        return el.getLocation();
      })
      .then(location => {
        elLocation = location;
        return this.lastFoundElement.getSize()
      })
      .then(dimension => { //show empty-circled cursor to see the movement
        let top = elLocation.y + (dimension.height/2) - (64/2);
        let left = elLocation.x + (dimension.width/2) - (64/2);
        return this.driver.executeScript(`
          if (!document.querySelector('#webtest-cursor')) {
            var webtestCursor=document.createElement("img");
            var imgSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEDklEQVR4Ae2bRXfrSBCFM7L1mF9WYYZNGBUPyrswL8O0CscY0h+fuT7nLjR12h35xNR6WnwPkuruqtsgqmpYOLv8panKIP82NFjgA2gEHWAQjIBxMgIG+btG2lpGC4AA3jOgBNgCZ+AW5MADeALP5Ik/y9HmjG0S7OO9EQLA0ThoAUlwArIM0BPB6ngWbbLsK8m+43UnAJyyQS/YBmngkacy4ZE02OZYds0F4N5uo1M54GlmmbMKaCfwSJA+chyzDVg1EQADfwIuuNPMtkfy4ALsgmW2c8AUcfizFdpcsI33Qt93bPepqgJQ+T3VvhazdAD+AT3gK7CDbCfa9rDtgWZ1PZM90FZxAbjkh8EV8DSzsgK6wbsynC/v2NeKZrV59Gm41C1R6gk/5zvZpQNZOtkMrArdSzRzjKwUgj5l6WOsrAIUOgR/gvsiy/AI9MuByw594VhHKl/o459BfQmq/JwM3jfYAvhC+6pRGBMsavyaA1Y5BBgGWcUgGTArb0yqCbelQ1+kf1kw/CoBeNpfKTpPgRHwG21rRsEH+pKSftL3Nr0A+uv8HvDkzMvg60gEuRI8sKe7T9B1mFQcMvfAqafghc8OfZQHo0ufAwvQDu4US2qh/Hu+7GfCovSbsbRrBRB3Ytti6XvgCHylXd3Cu8gj6T9jsoMI0AdyYhllQb+0rWMRBkBWxJADfRoBuITUs78CYgYJEKPPqlUQ1wnQCtLgWeyfFtoYA1+e3IlY0jIW2ShZZPYtAwWwiqyCpFIAvog8EQ1yoIc2xsFH6pwQ4AR8UAnQAbLC+BC8M1iAd4zBEwd6h0qAhOIu6h/+3lgKMSjuZhP/E4D7ZUsY5sXyN3kb5MXEbgHLL8AHcCZOzAvwLQQCfAMXIrYz8MEvQCO49Rl5YBfYIRDAZiyeT4Bb0OgXoENxWq6wE+NRXA5zoN0vwCB4EAK4IRLAFQI8gEG/ACOKR0gnRAI4ikf7Eb8AE4pHyKkQCTCliG88EiDaAtEhGF0Goxuh6FY4ehgK/eOwq30cjl6IRK/Eopei8lVyKsSvxVOMpeQPI6sGfhhZ1X8YKf3T2EB4Po2F/+PoscL/LWC/9vP4Yp1/Hrc1n8fbSk2QcMGT+QkSgAkS5UyRGa3DFJlRXYpM2JOkRvVJUpVLk3OAXeM9X7E0OZkomS+SkLhYh4mSeQpjlTVVVopAnsFxlVNlBzimypc8+COoLyUNHCBZerUKydKrLyRLOyAWtnT5nlqny6tyifY4uK5g4tBXMPEN2AFOdJu2LJhAH/qCiSf60mpKycyK8SUzUdGUvmwuVcGyuRTY4lh2PRdOuuC4jIWTx8Bl33GTSmfbRensTYDS2RtROtsO3oehePo9aATtmuLpdtq8N6R42nz+A/meWiah8Z1mAAAAAElFTkSuQmCC';
            webtestCursor.setAttribute('src', imgSrc);
            webtestCursor.setAttribute('id', 'webtest-cursor');
            webtestCursor.setAttribute('style', 
              'position: absolute; z-index: 99999999999; pointer-events: none;'
            );
            document.body.appendChild(webtestCursor);
          }

          document.querySelector('#webtest-cursor').style.top = '${top}px';
          document.querySelector('#webtest-cursor').style.left = '${left}px';
        `);
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

