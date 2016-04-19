var Mustache = require('mustache');
Mustache.escape = (value) => value; // Disable html escaping

/**
 * returns a group of test cases from test cases definition
 * e.g.  the following text will be parsed
 *  ```
 *   Successful Login
 *     Fill the form
 *     Click Login
 *       check if logged`in
 *       check if forwaredd to a home page
 *   Unsuccessful Login
 * ```
 * into grouped hash
 * { 
 *   'Successful Login': { 
 *     'Fill the form': '',
 *     'Click Login': 'check if logged in\ncheck if forwaredd to a home page\n'
 *    },
 *   'Unsuccessful Login': {}
 * }
 */
var indentParser = module.exports = function (str) {
  var lines = str.split('\n').filter((str)=> str.trim()!='');
  var hash={};
  var key1, key2;
  var indentLevel = 0;
  lines.forEach((line) => {
    indentLevel =
      line.match(/^    /) ? 3 :
        line.match(/^  /) ? 2 : 1;
    switch(indentLevel) {
      case 1: //test scenario
        key1 = line;
        hash[key1] = {};
        break;
      case 2: // test case
        key2 = line.trim();
        hash[key1][key2] = []
        break;
      case 3: // test step
        hash[key1][key2].push(line.trim());
        break;
      default:
        throw "error 1000";
    }
  })
  return hash;
};

const TEMPLATE = {
  header:        'var WebDriverRT = require(\'webdriver-rt\'),\n' +
                 'Reporter = WebDriverRT.Reporter;\n' +
                 'var I = new WebDriverRT({\n' +
                 '  browser: {name: \'chrome\', width: 500, height: 800}, speed: 1000});\n\n',
  scenario:      `Reporter.log(Reporter.SCENARIO, '{{scenarioName}}');\n`,
  testcase:      `  I.addTestCase('{{testCaseName}}', () =>\n`,
  teststepStart: `    I.{{testStep}}\n`,
  teststep:      `    .then(() => I.{{testStep}})\n`,
  teststepEnd:   `  );\n\n`,
  footer:        `I.runTestCases();\n`
};

const EXPRESSIONS = {
  '^click link {{STR}}$': `clickLink('{{STR}}')`,
  '^click {{STR}}$': `click('{{STR}}')`,
  '^click$': `click()`,
  '^close browser': `closeBrowser()`,
  '^enter text {{STR1}} into {{STR2}}':
    `enterTextInto('{{STR2}}', '{{STR1}}')`,
  '^open browser {{STR}}': `openBrowser('{{STR}}')`,
  '^see {{STR}}$': `see('{{STR}}')`,
  '^submit$': `submit()`
};

//double, single, or not quoted string expressoion
const RE_STR = '([\'"])([\\s\\S]+)[\'"]',
      RE_STR1 = '([\'"])([\\s\\S]+)[\'"]',
      RE_STR2 = '([\'"])([\\s\\S]+)[\'"]';

var commands = {};
for (var key in EXPRESSIONS) {
  var keyStr = key
    .replace(/{{STR[1]?}}/g, RE_STR)
    .replace(/{{STR2}}/g, RE_STR2);
  var valueStr = EXPRESSIONS[key];
  commands[keyStr] = valueStr ;
}

//console.log('commands .....', commands)

var getCommand = (str) => {
  var reKey, command, matches;
  for (var key in commands) {
    var re = new RegExp(key);
    if (matches = str.match(re)) {
      reKey = key;
      break;
    }
  }
  
  if (matches) {
    var tmpl = commands[reKey];
    if (matches[2]) {
      tmpl = tmpl.replace(/{{STR[1]?}}/, matches[2].replace("'", "\'"));
    }
    if (matches[4]) {
      tmpl = tmpl.replace('{{STR2}}', matches[4].replace("'", "\'"));
    }
    command = tmpl;
  } 
  
  return command;
};

module.exports = string => {
  var output = '';
  var parsed = indentParser(string);

  var matches, js;

  output += TEMPLATE.header;
  for (var scenario in parsed) {
    output += Mustache.render(TEMPLATE.scenario, {scenarioName: scenario});

    var testcases = parsed[scenario];

    for (var testcase in testcases) {
      output += Mustache.render(TEMPLATE.testcase, {testCaseName: testcase});

      var steps = testcases[testcase];
      var firstStep = steps.shift();
      command = getCommand(firstStep);
      output += Mustache.render(TEMPLATE.teststepStart, {testStep: command});
      
      steps.forEach(step => {
        command = getCommand(step);
        output += Mustache.render(TEMPLATE.teststep, {testStep: command});
      });

      output += TEMPLATE.teststepEnd;
    }
  }

  output += TEMPLATE.footer;
  
  return output;
};
