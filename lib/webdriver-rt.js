'use strict';
require('chromedriver');
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
var fs = require('fs');
var path = require('path');
var Scenario = require('./scenario');
var argv = require('yargs').argv,
    debug = !!argv.debug;

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

  constructor(config, reporter) {
    this.driver = new webdriver.Builder();
    this.expressionDirs = undefined;
    this.browser = undefined;
    this.speed = undefined;
    this.testCases = [];
    this.lastElement = undefined;
    this.reporter = reporter;
    debug && this.reporter && console.log('scenario', this.reporter.scenario);

    Object.assign(this, defaultConfig);

    for (var key in config) {
      if (key === 'browser') {
        for (var key2 in config.browser) {
          this.browser[key2] = config.browser[key2];
        }
      } else if (key == 'expressionDirs') {
        this.registerExpressionsFrom(config[key], true);
      } else {
        this[key] = config[key];
      }
    }
  }

  scenario(name) {
    this.scenarioName = name;
  }
  
  testCase(name, fn) {
    this.testCases.push({name: name, function: fn});
  };

  runScenario() {
    var reporter = this.reporter;
    
    function runPromiseInSequence(testCases) {
      var functions = testCases.map(testCase => {return testCase.function});
      
      var p = Promise.resolve(); //first promise

      var promises = functions.reduce(function (pacc, testCase) {
        // let reportingTestCase = function() {
        //   reporter.start(Scenario.TESTCASE);
        //   return testCase.then(
        //     () => reporter.pass(Scenario.TESTCASE),
        //     () => reporter.fail(Scenario.TESTCASE)
        //   ).then( () => {
        //     reporter.testCaseNdx++;
        //     reporter.testStepNdx = 0;
        //   });
        // };
        return pacc = pacc.then(testCase);
      }, p);

      return promises.catch(e => {
          console.log(e.stack);
        });
    }
    
    return runPromiseInSequence(this.testCases);
  }
  
  registerExpressionsFrom(dirs, print) {
    print && console.log("Registering expressions from ", dirs);

    dirs.forEach(dir => {
      let files = fs.readdirSync(dir);
      files.forEach(file => {
        let absPath = path.resolve(path.join(dir, file));
        var expressions = require(absPath);
        for(var key in expressions) {
          var expression = expressions[key];
          this.registerExpression(key, expression);
        }
      })
    });
  }

  registerExpression(string, namedFunc) {
    if (typeof string !== 'string') {
      throw "FAIL: invalid string parameter";
    }
    if (typeof namedFunc !== 'function') {
      throw "FAIL: invalid named function parameter";
    }
    if (!namedFunc.name) {
      throw "FAIL: named function must have a name";
    }

    //double, single, or no-quote string expression
    let RE_STR  = '([\'"])([\\s\\S]+)[\'"]',
      RE_STR1 = '([\'"])([\\s\\S]+)[\'"]',
      RE_STR2 = '([\'"])([\\s\\S]+)[\'"]';

    var reStr =  string
      .replace(/{{STR(ING)?1?}}/g, RE_STR)
      .replace(/{{STR(ING)?2}}/g, RE_STR2);

    /**
     * The original function needs to be modified for reporting
     */
    var funcName = namedFunc.name;
    var func = function() { // don't use arrow function here
      debug && console.log('funcName', funcName, 'arguments', arguments);
      this.reporter.start(Scenario.TESTSTEP);
      return namedFunc.apply(this, arguments);
    };

    WebDriverRT.expressions[string] = {
      regExp : new RegExp(`^${reStr}$`, 'i'),
      funcName: funcName,
      func: func
    };
    WebDriverRT.prototype[funcName] = func;
  }

  /**
   * returns ManagedPromise<Element>
   */
  __findBy(by, string) {
    let locator;
    if (by == "linkText") {
      locator = {linkText: string};
    } else if (by == "css" 
      && string.match(/[a-z0-9]*[#\[=\.][a-z]/i)) { //id, class, attribute
      locator = {css: string};
    } else if (by == "css") {
      locator = {
        css: `input[placeholder='${string}'], ` + 
             `textarea[placeholder='${string}'], ` +
             `input[value='${string}']`
      };
    } else if (by === 'xpath') {
      locator = {xpath: string};
    }
    debug && console.log('__findBy', 'locator', locator);
    
    return this.driver.wait(until.elementLocated(locator), this.timeout)
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

WebDriverRT.getCommandFrom = (testStep) => {

  let expression, command;

  for (var key in WebDriverRT.expressions) {
    let expr = WebDriverRT.expressions[key];
    if (testStep.match(expr.regExp)) {
      expression = expr;
      break;
    }
  }

  if (expression) {
    let matches = testStep.match(expression.regExp);
    let funcName = expression.funcName;
    let args = [matches[2], matches[4], matches[6]];
    args = args.filter( el => !!el).map(el => `'${el}'`);
    command = `${funcName}(${args.join(',')})`;
  }
  return command;
};

module.exports = WebDriverRT;

