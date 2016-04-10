var WebDriverTT = require('../index');
var I = new WebDriverTT({
  browser: {name: 'chrome', width: 500, height: 800}
})

I.openBrowser('https://run.plnkr.co/plunks/aWTZswhBnUVLg7qyDr83/')

  .then(() => I.find('input'))
  .then(el => el.getAttribute('value'))
  .then(st => console.log('text', st))
  .then(() => I.enterTextInto('input', 'Foo Bar'))
  .then(() => I.click('button'))

  .then(() => I.visit('https://run.plnkr.co/plunks/9AF9PrxOWeb3JtmoHr9i/'))
  .then(() => I.waitUntil('titleIs', 'Angular 2 Form Builder'))
  .then(() => I.waitUntil('titleContains', 'Angular 2'))
  .then(() => I.waitUntil('titleMatches', /Angular 2/))

  .then(() => I.closeBrowser())
  .catch(e => {
    I.closeBrowser();
    throw e;
  });
