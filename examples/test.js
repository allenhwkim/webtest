var WebDriverRT = require('../index'),
    Reporter = require('../lib/reporter');

var I = new WebDriverRT({
  browser: {name: 'chrome', width: 500, height: 800},
  speed: 1000
});

Reporter.log(Reporter.SCENARIO, 'Test Scenario');

I.addTestCase('Test Case 1', () =>
  I.openBrowser('https://run.plnkr.co/plunks/3wZsyl/')
    .then(I.click('input.form-control'))
    .then(() => I.enterTextInto('input.form-control', 'Foo Bar'))
    .then(() => I.submit())
    .then(() => I.see('"greenCarName": "Foo Bar"'))
);

I.addTestCase('Test Case 2', () =>
  I.clickLink('Angular 2 Form Builder')
    .then(() => I.waitForPageLoad())
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

I.addTestCase('Test Case 3', () =>
  I.clickLink('Angular 2 Router')
    .then(() => I.waitForPageLoad())
    .then(() => I.see('Angular 2 Router Example'))
    .then(() => I.click('#route1'))
    .then(() => I.see('Angular 2 Products Component'))
    .then(() => I.click('#route2'))
    .then(() => I.see('about us'))
    .then(() => I.click('#route3'))
    .then(() => I.see('Angular 2 Contact Component'))
    .then(() => I.closeBrowser())
);

I.runTestCases();
