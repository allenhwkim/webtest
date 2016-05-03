'use strict';

var fs = require('fs');
var Scenario = require('./scenario');
var Status = require('./status');

/**
 * Prepare reports to generate from the given scenario file
 */
class Reporter {
  
  constructor(scenarioFile) {
    this.scenario = this.init(scenarioFile);
    this.testCaseNdx = 0
    this.testStepNdx = 0;
  }

  /**
   * set reporting items to be set to start/pass/fail
   * @param scenarioFile {string} scenario file path
   */
  init(scenarioFile) {
    let scenario;
    try {
      fs.accessSync(scenarioFile);
      scenario = fs.readFileSync(scenarioFile).toString();
    } catch(e) {
      throw "File " + filePath + " does not exist";
    }
    
    let parsed = Scenario.parse(scenario);
    return parsed;
  }
  
  /**
   * set reporting item started
   * @param level {integer} e.g., Scenario.TESTCASE, Scenario.TESTSTEP
   * @param testCaseName {string} optional, the name of testCase
   */
  start(level, testCaseName) {
    this.__setStatus(level, Status.STARTED, testCaseName);
  }

  /**
   * set reporting item succeeded
   * @param level {integer} e.g., Scenario.TESTCASE, Scenario.TESTSTEP
   * @param testCaseName {string} optional, the name of testCase
   */
  pass(level, testCaseName) {
    this.__setStatus(level, Status.PASS, testCaseName);
  }

  /**
   * set reporting item failed
   * @param level {integer} e.g., Scenario.TESTCASE, Scenario.TESTSTEP
   * @param testCaseName {string} optional, the name of testCase
   */
  fail(level, testCaseName) {
    this.__setStatus(level, Status.FAIL, testCaseName);
  }

  __setStatus(level, status, testCaseName) {
    switch(level) {
      case Scenario.SCENARIO:
        this.scenario.status = status;
        break;
      case Scenario.TESTCASE:
        this.testCaseNdx = this.__getTestCaseIndex(testCaseName);
        this.scenario.testCases[this.testCaseNdx].status = status;
        break;
      case Scenario.TESTSTEP:
        this.scenario
          .testCases[this.testCaseNdx]
          .testSteps[this.testStepNdx].status = status;
        this.testStepNdx++;
        break;
      default:
    }
  }
  
  __getTestCaseIndex(testCaseName) {
    let index;
    this.scenario.testCases.forEach( (testCase, ndx) => {
      if (testCaseName === testCase.name) {
        index = ndx;
      }
    });
    return index;
  }
}

module.exports = Reporter;
