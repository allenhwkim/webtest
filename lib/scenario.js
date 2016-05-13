'use strict';

var Status = require('./status');

/**
 * Parse scenario written in text into an object
 * 
 *   scenario: {
 *     name: 'test scenario',
 *     status: PENDING
 *     error: undefined
 *     testCases: [
 *       {
 *          name: 'test case 1',
 *          status: PENDING
 *          testSteps: [
 *            {name: 'test step 1', status: PENDING}
 *            {name: 'test step 2', status: PENDING}
 *          ],
 *       }
 *     ]
 *   }
 * 
 * @TODO
 *  users' scenario might not hava a valid expression
 *  check test step expressions against defined expxression and command
 *  and if not valid, set errors
 */
class Scenario {
  
  constructor(scenarioStr) {
    this.name;
    this.status;
    this.error;
    this.testCases = [];
    this.parse(scenarioStr);
  }
  
  print() {
    console.log(`\n\n\nTest Result`);
    console.log(`==================================`);
    console.log(`Scenario: ${this.name}`);
    this.testCases.forEach(testCase => {
      console.log(`  Test Case: ${testCase.name}`);
      testCase.testSteps.forEach(testStep => {
        // if still started status, it's a failure
        if (testStep.status === Status.STARTED) {
          testStep.status = Status.FAIL;
        }
        console.log(`     ${testStep.status}: ${testStep.name}`);
      });
      console.log('');
    });
  }

  parse(scenarioStr) {
    var lines = scenarioStr.split('\n')
      .filter(scenario => !!scenario.trim());
    var indentLevel = 0;
    var scenario = {}, testCase, testStep;

    lines.forEach((line) => {

      indentLevel =
        line.match(/^    /) ? 3 :
          line.match(/^  /) ? 2 : 1;

      switch(indentLevel) {
        case 1: //test scenario
          this.name = line.trim();
          this.status = Status.PENDING;
          this.error = undefined;
          break;
        case 2: // test case
          testCase = {
            name: line.trim(),
            status: Status.PENDING
          };
          this.testCases.push(testCase);
          break;
        case 3: // test step
          testCase = this.testCases[this.testCases.length -1];
          testCase.testSteps = testCase.testSteps || [];
          testStep = {
            name: line.trim(),
            status: Status.PENDING
          }
          testCase.testSteps.push(testStep);
          break;
        default:
          throw "error 1000";
      }
    });

    return scenario;
  }

}

Scenario.SCENARIO = 1;
Scenario.TESTCASE = 2;
Scenario.TESTSTEP = 3;

module.exports = Scenario;
