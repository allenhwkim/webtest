'use strict';

var Scenario = require('./../../lib/scenario');
var Status = require('./../../lib/status');

describe('Scenario', () => {
  
  describe('#parse', () =>  {
    it('should parse scenario', () => {
      let input =
        'test scenario\n' +
        '  test case 1\n' +
        '    test step 1\n' +
        '    test step 2\n' +
        '    test step 3\n' +
        '\n' +
        '  test case 2\n' +
        '    test step 1\n' +
        '    test step 2\n' +
        '    test step 3\n';

      let output = new Scenario(input);

      var testCases = output.testCases;
      expect(output.name).toBe('test scenario');
      expect(output.status).toBe(Status.PENDING);
      expect(output.error).toBe(undefined);
      expect(testCases.length).toBe(2);

      expect(testCases[0].name).toBe('test case 1');
      expect(testCases[0].status).toBe(Status.PENDING);
      expect(testCases[0].testSteps.length).toBe(3);
      expect(testCases[0].testSteps[0]).toEqual({name: 'test step 1', status:Status.PENDING});
      expect(testCases[0].testSteps[1]).toEqual({name: 'test step 2', status:Status.PENDING});
      expect(testCases[0].testSteps[2]).toEqual({name: 'test step 3', status:Status.PENDING});

      expect(testCases[1].name).toBe('test case 2');
      expect(testCases[1].status).toBe(Status.PENDING);
      expect(testCases[1].testSteps.length).toBe(3);
      expect(testCases[1].testSteps[0]).toEqual({name: 'test step 1', status:Status.PENDING});
      expect(testCases[1].testSteps[1]).toEqual({name: 'test step 2', status:Status.PENDING});
      expect(testCases[1].testSteps[2]).toEqual({name: 'test step 3', status:Status.PENDING});
    })
  })
})