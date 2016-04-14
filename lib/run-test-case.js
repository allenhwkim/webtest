'use strict';
var fs = require('fs'),
    Reporter = require('./reporter'),
    indentParser = require('./indent-parser');

var rpt = new Reporter();

var contents = fs.readFileSync('../examples/test-case-1.txt').toString();

var parsed = indentParser(contents);
console.log('parsed', parsed);
console.log('parsed', JSON.stringify(parsed, null, '  '));

for (var scenario in parsed) {
  rpt.log(scenario);
  var testcases = parsed[scenario]

  for(var testcase in testcases) {
    rpt.log('\n  ' + testcase);

    var steps = testcases[testcase];
    steps.forEach(step => {
      rpt.log('    ' + step);
    });

  }
}


