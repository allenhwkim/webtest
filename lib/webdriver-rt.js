'use strict';
require('chromedriver');
var Reporter = require('./reporter');
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

/**
 * The base object to run a test scenario
 */
class WebDriverRT {

  constructor(config) {
    this.driver = new webdriver.Builder();
    this.browser = undefined;
    this.testScenario = '';
    this.testCases = [];

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
    this.lastElement = undefined;
  }

  scenario(name) {
    this.scenarioName = name;
  }
  
  testCase(name, fn) {
    this.testCases.push({name: name, function: fn});
  };

  runScenario() {
    function runPromiseInSequence(testCases) {
      var functions = testCases.map(testCase => {return testCase.function});
      
      var p = Promise.resolve(); //first promise

      var promises = functions.reduce(function (pacc, testCase) {
        return pacc = pacc.then(testCase);
      }, p);

      return promises.catch(e => {
          console.log(e.stack);
        });
    }
    
    return runPromiseInSequence(this.testCases);
  }

  /**
   * returns ManagedPromise<Element>
   */
  __findBy(by, string) {
    let locator;
    if (by == "linkText") {
      locator = {linkText: string};
    } else if (by == "css" && string.match(/[a-z0-9]*[#\[=\.][a-z]/i)) { //id, class, attribute
      locator = {css: string};
    } else if (by == "css") {
      locator = {
        css: `input[placeholder='${string}'], textarea[placeholder='${string}'], input[value='${string}']`
      };
    }

    return this.driver.wait(
      until.elementLocated(locator), this.timeout
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
  __waitUntil(arg0, arg1, arg2) {
    let condition;

    Reporter.log(Reporter.STEP, 'wait until', arg0, [arg1, arg2].join(' '));
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

WebDriverRT.expressions = {};

WebDriverRT.registerExpression = function(string, namedFunc) {
  if (typeof string !== 'string') {
    throw "ERROR: invalid string parameter"; 
  }
  if (typeof namedFunc !== 'function') {
    throw "ERROR: invalid named function parameter"; 
  }
  if (!namedFunc.name) {
    throw "ERROR: named function must have a name"; 
  }

  //double, single, or no-quote string expression
  let RE_STR  = '([\'"])([\\s\\S]+)[\'"]',
    RE_STR1 = '([\'"])([\\s\\S]+)[\'"]',
    RE_STR2 = '([\'"])([\\s\\S]+)[\'"]';

  var reStr =  string
    .replace(/{{STR(ING)?1?}}/g, RE_STR)
    .replace(/{{STR(ING)?2}}/g, RE_STR2);
  
  WebDriverRT.expressions[string] = {
    regExp : new RegExp(reStr, 'i'),
    func: namedFunc
  };
  WebDriverRT.prototype[namedFunc.name] = namedFunc;
};

module.exports = WebDriverRT;

