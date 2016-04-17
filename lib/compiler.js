var compile = require('mustache').render;
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

var EXPRESSIONS = {
  '^click link {{STR}}': 'clickLink({{STR}})',
  '^click {{STR}}': 'click("{{STR}}")',
  '^click$': 'click()',
  '^close browser': 'closeBrowser()',
  '^enter text {{STR1}} into {{STR2}}':
    'enterTextInto({{STR2}}, {{STR1}}"',
  '^open browser {{STR}}': 'openBrowser("{{STR}}")',
  '^submit$': 'submit()'
};

module.exports = function(string) {
  var output = '';
  var parsed = indentParser(string);
  var expressions = {};

  var matches, js;
  //double, single, or not quoted string expressoion
  var reSTR = reSTR1 = '([\'"]?)([^\1]+)\1?';
  var reSTR2 = '([\'"]?)([^\3]+)\3?';
  var rePressions = {};
  for (var key in EXPRESSIONS) {
    var keyStr = key.replace(/{{STR[1]?}}/g, reSTR);
    var keyStr = keyStr.replace(/{{STR2}}/g, reSTR2);
    var valueStr = EXPRESSIONS[key];
    expressions[keyStr] = valueStr ;
  }
  
  function getMatches(str) {
    for (var key in expressions) {
      var re = new RegExp(key);
      var matches = str.match(re);
      if (matches) {
        return {
          matches: matches,
          command: expressions[key]
        };
      }
    }
  }

  output += template.header;
  for (var scenario in parsed) {
    output += compile(template.scenario, {scenarioName: scenario});

    var testcases = parsed[scenario];

    for (var testcase in testcases) {
      output += compile(template.testcase, {testCaseName: testcase});

      var steps = testcases[testcase];
      var firstStep = steps.shift();
      // Change DSL to Js
      output += compile(template.teststepStart, {testStep: firstStep});

      steps.forEach(step => {
        // Change DSL to Js
        console.log('matches .....', getMatches(step));
        output += compile(template.teststep, {testStep: step});
      });

      output += template.teststepEnd;
    }
  }

  output += template.footer;
  
  return output;
};
