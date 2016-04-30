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
class Scenario {}

Scenario.SCENARIO = 1;
Scenario.TESTCASE = 2;
Scenario.TESTSTEP = 3;

Scenario.parse = scenarioStr =>  {
  var lines = scenarioStr.split('\n').filter((scenario)=> scenario.trim()!='');
  var indentLevel = 0;
  var scenario = {}, testCase, testStep;

  lines.forEach((line) => {

    indentLevel =
      line.match(/^    /) ? 3 :
        line.match(/^  /) ? 2 : 1;

    switch(indentLevel) {
      case 1: //test scenario
        scenario.name = line.trim();
        scenario.status = Status.PENDING;
        scenario.error = undefined;
        break;
      case 2: // test case
        scenario.testCases = scenario.testCases || [];
        testCase = {
          name: line.trim(),
          status: Status.PENDING
        };
        scenario.testCases.push(testCase);
        break;
      case 3: // test step
        testCase = scenario.testCases[scenario.testCases.length -1];
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

module.exports = Scenario;
