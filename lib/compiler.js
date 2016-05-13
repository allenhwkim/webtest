'use strict';

var Mustache = require('mustache');
    Mustache.escape = v => v;
var fs = require('fs');
var path = require('path');
var Scenario = require('./scenario');
var WebDriverRT = require('./webdriver-rt');
var argv = require('yargs').argv,
    debug = !!argv.debug;

const TEMPLATE = {
  header:
  `//var WebDriverRT = require('webdriver-rt'),\n` +
  `//    Reporter = WebDriverRT.Reporter;\n` +
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
    this.scenarioStr = fs.readFileSync(scenarioPath).toString();
    this.scenario;
  }
  
  compile(){
    new WebDriverRT().registerExpressionsFrom(this.config.expressionDirs);
    this.scenario =  new Scenario(this.scenarioStr);
    debug && console.log('this.scenario', this.scenario);
    return this.__compile()
  }
  
  __compile() {
    let output = [];
    let headerJS = Mustache.render(TEMPLATE.header, {
      scenarioPath: this.scenarioPath,
      config: JSON.stringify(this.config),
      expressionDirs: JSON.stringify(this.config.expressionDirs)
    });
    output.push(headerJS);
    
    let scenarioJS = Mustache.render(TEMPLATE.scenario, {
      scenarioName: this.scenario.name
    });
    output.push(scenarioJS);

    this.scenario.testCases.forEach(testCase => {
      let testCaseJS =
        Mustache.render(TEMPLATE.testCase, {testCaseName: testCase.name});
      output.push(testCaseJS);
      
      let testSteps = testCase.testSteps;
      var firstTestStep = testSteps.shift();
      let cmd = WebDriverRT.getCommandFrom(firstTestStep.name);
      if (!cmd) {
        throw "Invalid expression: " + firstTestStep.name;
      }
      let testStepJS = Mustache.render(
        TEMPLATE.testStepStart, { testStep: cmd }
      );
      output.push(testStepJS);

      testSteps.forEach(testStep => {
        let cmd = WebDriverRT.getCommandFrom(testStep.name);
        if (!cmd) {
          throw "Invalid expression: " + testStep.name;
        }
        testStepJS = Mustache.render(
          TEMPLATE.testStep, { testStep: cmd }
        );
        output.push(testStepJS);
      });
      
      output.push(TEMPLATE.testStepEnd);
    });
    
    output.push(TEMPLATE.footer);
    return output.join('\n');
  }

}

module.exports = Compiler;
