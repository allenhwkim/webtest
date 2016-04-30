var WebDriverRT = require('./index'),
    reporter =  new WebDriverRT.Reporter('/Users/allen/github/webdriver-rt/examples/test-case-1.txt');

var I = new WebDriverRT({
  browser: {name: 'chrome', width: 500, height: 800}, speed: 1000});

I.sceanrio('xxxxxxxxxxx');

I.testCase('Test case 1', () =>
  I.openBrowser('https://run.plnkr.co/plunks/3wZsyl/')
  .then(() => I.click('input.form-control'))
  .then(() => I.enterTextInto('input.form-control', 'Foo Bar'))
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
  .then(() => I.enterTextInto('#no1', 'Foo'))
  .then(() => I.enterTextInto('#no2', 'Bar'))
  .then(() => I.enterTextInto('#no3', 'FooBar'))
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

