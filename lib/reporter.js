'use strict';

var fs = require('fs');
var Scenario = require('./scenario');
var Status = require('./status');
var argv = require('yargs').argv,
    debug = !!argv.debug;

/**
 * Prepare reports to generate from the given scenario file
 */
class Reporter {
  
  constructor(scenarioFile) {
    this.scenario = this.init(scenarioFile);
    this.testCaseNdx = 0
    this.testStepNdx = 0;
  }

  init(scenarioFile) {
    let scenarioStr;
    try {
      fs.accessSync(scenarioFile);
      scenarioStr = fs.readFileSync(scenarioFile).toString();
    } catch(e) {
      throw "File " + scenarioFile + " does not exist";
    }
    
    return new Scenario(scenarioStr);
  }
  
  start(level, testCaseName) {
    this.__setStatus(level, Status.STARTED, testCaseName);
  }

  pass(level, testCaseName) {
    this.__setStatus(level, Status.PASS, testCaseName);
  }

  fail(level, testCaseName) {
    this.__setStatus(level, Status.FAIL, testCaseName);
  }
  
  print() {
    this.scenario.print();
  }

  __setStatus(level, status, testCaseName) {
    debug && console.log('testCaseNdx', this.testCaseNdx);
    debug && console.log('testStepNdx', this.testStepNdx);
    switch(level) {
      case Scenario.SCENARIO:
        this.scenario.status = status;
        break;
      // this is called ONLY if passed
      // at the end of execution
      case Scenario.TESTCASE:
        this.testCaseNdx = this.__getTestCaseIndex(testCaseName);
        this.testCase = this.scenario.testCases[this.testCaseNdx];
        this.testCase.status = status;
        if (status == Status.PASS) {
          // set the last test step as passed 
          // since moved on to next text case
          this.testStep.status = Status.PASS;
          this.testCaseNdx++;
          this.testStepNdx = 0;
          
          console.log('  ');
        }
        break;
      case Scenario.TESTSTEP:
        if (this.testStep) {
          this.testStep.status = Status.PASS;
        }
        this.testStep = this.scenario
          .testCases[this.testCaseNdx]
          .testSteps[this.testStepNdx];
        this.testStep.status = status;
        
        if (status == Status.STARTED) {
          console.log('    ', this.testStep.name);
          this.testStepNdx++;
        }
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
