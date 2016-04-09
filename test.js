var webdriverTT = require('./webdriver-tt');
for(var key in webdriverTT) {
  global[key] = webdriverTT[key];
}

setBrowser({browser:'chrome', left:0, top: 0, width: 500, height: 900});

openBrowser('https://run.plnkr.co/plunks/aWTZswhBnUVLg7qyDr83/')
  .then(()=> find({css:'input'}))
  .then((element) => element.getAttribute('value'))
  .then((str) => console.log('text', str))
  .then(() => enterTextInto({css:'input'}, 'Foo Bar'))
  .then(() => moveMouseTo({css: 'button'}))
  .then(() => click({css: 'button'}))
  //.then(() => closeBrowser())
  .catch((e) => {
    closeBrowser();
    throw e;
  });
 
