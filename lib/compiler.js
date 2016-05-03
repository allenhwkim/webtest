'use strict';

var Mustache = require('mustache');
    Mustache.escape = v => v;
var fs = require('fs');
var path = require('path');
var Scenario = require('./scenario');
var WebDriverRT = require('./webdriver-rt');

const TEMPLATE = {
  header:
  `var WebDriverRT = require('./index'),\n` +
  `    Reporter = WebDriverRT.Reporter;\n` +
  `\n` +
  `// prepare report for a scenario\n` +
  `var reporter = new Reporter('{{scenarioPath}}');\n\n` +
  `var I = new WebDriverRT({{config}}, reporter);\n`,
  scenario:      `I.scenario('{{scenarioName}}');`,
  testCase:      `\n` + 
                 `I.testCase('{{testCaseName}}', () => `,
  testStepStart: `  I.{{testStep}}`,
  testStep:      `  .then(() => I.{{testStep}})`,
  testStepEnd:   `);\n`,
  footer:        `I.runScenario();`
};

/**
 *  Compiler compiles a text scenario file to Javascript
 */
class Compiler {
  
  constructor(scenarioPath, config) {
    try {
      fs.accessSync(scenarioPath);
    } catch(e) {
      throw "File " + scenarioPath + " does not exist";
    }
    
    this.config = config;
    this.scenarioPath = scenarioPath;
    this.scenario = fs.readFileSync(scenarioPath).toString();
    this.parsedScenario;
  }
  
  run(){
    new WebDriverRT().registerExpressionsFrom(this.config.expressionDirs);
    this.parsedScenario = Scenario.parse(this.scenario);
    this.printJs()
  }
  
  printJs() {
    let scenario = this.parsedScenario;

    let headerJS = Mustache.render(TEMPLATE.header, {
      scenarioPath: this.scenarioPath,
      config: JSON.stringify(this.config),
      expressionDirs: JSON.stringify(this.config.expressionDirs)
    });
    console.log(headerJS);
    
    let scenarioJS = Mustache.render(TEMPLATE.scenario, {
      scenarioName: scenario.name
    });
    console.log(scenarioJS);

    scenario.testCases.forEach(testCase => {
      let testCaseJS =
        Mustache.render(TEMPLATE.testCase, {testCaseName: testCase.name});
      console.log(testCaseJS);
      
      let testSteps = testCase.testSteps;
      var firstTestStep = testSteps.shift();
      let testStepJS = Mustache.render(TEMPLATE.testStepStart, {
        testStep: WebDriverRT.getCommandFrom(firstTestStep.name)
      });
      console.log(testStepJS);

      testSteps.forEach(testStep => {
        testStepJS = Mustache.render(TEMPLATE.testStep, {
          testStep: WebDriverRT.getCommandFrom(testStep.name)
        });
        console.log(testStepJS);
      });
      
      console.log(TEMPLATE.testStepEnd);
    });
    
    console.log(TEMPLATE.footer);
  }

}

module.exports = Compiler;
