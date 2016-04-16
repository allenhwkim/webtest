var Mustache = require('mustache');
var indentParser = require('./indent-parser');

var template = {
  header:        'var WebDriverTT = require(\'webdriver-tt\'),\n' +
                 'Reporter = WebDriverTT.Reporter;\n' +
                 'var I = new WebDriverTT({\n' +
                 '  browser: {name: \'chrome\', width: 500, height: 800}, speed: 1000});\n\n',
  scenario:      `Reporter.log(Reporter.SCENARIO, '{{scenarioName}}');\n`,
  testcase:      `  I.addTestCase('{{testCaseName}}', () =>\n`,
  teststepStart: `    I.{{testStep}}\n`,
  teststep:      `    .then(() => I.{{testStep}})\n`,
  teststepEnd:   `  );\n\n`,
  footer:        `I.runTestCases();\n`
};

module.exports = function(string) {
  var output = '';
  var parsed = indentParser(string);

  output += template.header;

  for (var scenario in parsed) {
    output += Mustache.render(template.scenario, {scenarioName: scenario});

    var testcases = parsed[scenario];

    for (var testcase in testcases) {
      output += Mustache.render(template.testcase, {testCaseName: testcase});

      var steps = testcases[testcase];
      var firstStep = steps.shift();
      output += Mustache.render(template.teststepStart, {testStep: firstStep});

      steps.forEach(step => {
        output += Mustache.render(template.teststep, {testStep: step});
      });

      output += template.teststepEnd;
    }
  }

  output += template.footer;
  return output;
};
