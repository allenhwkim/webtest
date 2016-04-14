/**
 * returns a group of test cases from test cases definition
 * e.g.  the following text will be parsed 
 *  ```
 *   Successful Login
 *     Fill the form
 *     Click Login
 *       check if logged in
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
var parseTestCase = module.exports = function (str) {
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
}
