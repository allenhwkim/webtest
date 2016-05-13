var WebDriverRT = require('./index'),
    Reporter = WebDriverRT.Reporter;

// prepare report for a scenario
var reporter = new Reporter('/Users/allen/github/webdriver-rt/examples/scenario1.txt');

var I = new WebDriverRT({"expressionDirs":["lib/expressions"],"browser":{"name":"chrome","width":500,"height":800},"speed":1000}, reporter);

I.scenario('This is my test scenario');

I.testCase('Test case 1', () => 
  I.openBrowser('https://run.plnkr.co/plunks/3wZsyl/')
  .then(() => I.click('input.form-control'))
  .then(() => I.enterTextInto('Foo Bar','input.form-control'))
  .then(() => I.submit())
  .then(() => I.see('"greenCarName": "Foo Bar"'))
);


I.testCase('Test case 2', () => 
  I.clickLink('Angular 2 Form Builder')
  .then(() => I.see('Name : ( required )'))
  .then(() => I.click())
  .then(() => I.see('Color : ( required )'))
  .then(() => I.click())
  .then(() => I.see('Doors : ( required )'))
  .then(() => I.click())
  .then(() => I.enterTextInto('Foo','#no1'))
  .then(() => I.enterTextInto('Bar','#no2'))
  .then(() => I.enterTextInto('FooBar','#no3'))
  .then(() => I.see('true'))
);


I.testCase('Test case 3', () => 
  I.clickLink('Angular 2 Router')
  .then(() => I.see('Angular 2 Router Example'))
  .then(() => I.clickLink('Products'))
  .then(() => I.see('Angular 2 Products Component'))
  .then(() => I.clickLink('About Us'))
  .then(() => I.see('about us'))
  .then(() => I.clickLink('Contact'))
  .then(() => I.see('Angular 2 Contact Component'))
  .then(() => I.closeBrowser())
);

I.runScenario();
