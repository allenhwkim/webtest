'use strict';

var WebDriverRT = require('./../../lib/webdriver-rt');

describe('WebDriverRT', () => {
  let I = new WebDriverRT();
  
  describe('#scenario', () =>  {
    it('should register scenario name', () => {
      I.scenario('scenario');
      expect(I.scenarioName).toBe('scenario');
    });
  });
  
  describe('#testCase', () =>  {
    it('should register testcase', () => {
      var fn1 = () => {};
      var fn2 = () => {};
      I.testCase('test case 1', fn1);
      expect(I.testCases[0]).toEqual({name: 'test case 1', function: fn1});
      I.testCase('test case 2', fn2);
      expect(I.testCases[1]).toEqual({name: 'test case 2', function: fn2});
    });
  });
  
  describe('#registerExpression', () => {
    it('should register expression', () => {
      let myFunc = function myFunc(string) {};
      WebDriverRT.registerExpression('my expression', myFunc);
      expect(WebDriverRT.expressions[`^my expression$`]).toBe(myFunc);
      expect(typeof I.myFunc).toBe('function');
    });
  });
  
  describe('#runScenario', () => {
    it('should run scenario', (done) => {
      let collection = [];
      I.testCases = [
        {name: 'a', function: function a() {collection.push(1)} },
        {name: 'a', function: function b() {collection.push(2)} },
        {name: 'a', function: function c() {collection.push(3)} },
        {name: 'a', function: function c() {collection.push(4)} } 
      ];

      I.runScenario().then( () => {
        expect(collection).toEqual([1,2,3,4]);
        done();
      })

    });
  });

})
