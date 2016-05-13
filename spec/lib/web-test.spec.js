'use strict';

var fs = require('fs');
var WebTest = require('./../../lib/web-test');
var Reporter = require('./../../lib/reporter');

var I;
describe('WebTest', () => {
  beforeEach(() => {
    spyOn(fs, "accessSync").and.returnValue(true);
    spyOn(fs, "readFileSync").and.returnValue('scenario 1');
    I = new WebTest({}, new Reporter('scenarioFile'));
  });
  
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
      expect(I.testCases[0]).toEqual({name: 'test case 1', func: fn1});
      I.testCase('test case 2', fn2);
      expect(I.testCases[1]).toEqual({name: 'test case 2', func: fn2});
    });
  });
  
  describe('#registerExpression', () => {
    it('should register expression', () => {
      let myFunc = function myFunc(string) {};
      I.registerExpression('my expression', myFunc);
      expect(WebTest.expressions['my expression'].regExp).toEqual(/^my expression$/i);
      expect(WebTest.expressions['my expression'].funcName).toBe('myFunc');
      expect(typeof I.myFunc).toBe('function');
    });
  });
  
  describe('#runScenario', () => {
    it('should run scenario', () => {
      let collection = [];
      I.testCases = [
        {name: 'a', function: function a() {collection.push(1)} },
        {name: 'a', function: function b() {collection.push(2)} },
        {name: 'a', function: function c() {collection.push(3)} },
        {name: 'a', function: function c() {collection.push(4)} } 
      ];

      I.runScenario().then( () => {
        expect(collection).toEqual([1,2,3,4]);
      })

    });
  });

})
