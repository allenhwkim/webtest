var WebDriverTT = require('../index');
var I = new WebDriverTT({
  browser: {name: 'chrome', width: 500, height: 800},
  speed: 1000
})

I.openBrowser('https://angular.io/')

  .then(() => I.click('a[href="/docs/ts/latest/api/"]'))
  .then(() => I.waitForPageLoad())
  .then(() => I.enterTextInto('#search-io', 'Direc'))
  .then(() => I.see('Directive - ts'))

  .then(() => I.click('.swiftype-widget ul li'))
  .then(() => I.waitForPageLoad())
  .then(() => I.see('working on the Dart version'))

  .then(() => I.closeBrowser())
  .catch(e => {
    I.closeBrowser();
    throw e;
  });

