'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_URL  = '([\\S]+)';            // e.g. foo.bar, "foo.bar", or 'foo.bar'. not "foo bar"

module.exports = {
  name: 'go to',
  help: 'go to <url>',
  regExp: new RegExp(`^go to ${RE_URL}`),
  func:
    /** must return a Promise, so that it can be chained with next command*/
    function(url) {
      let fullUrl = (`${webtestDriver.baseUrl||''}${url}`);
      return webtestDriver.driver.executeScript(`window.location.href = '${fullUrl}';`)
        .then( () => { // wait for page to load
          return webtestDriver.driver.wait( function() {
            return webtestDriver.driver.executeScript('return document.readyState')
              .then(function(resp) {
                if (resp === 'complete' && !url.match(/^http[s]?:\/\/localhost:[0-9]+$/)) {
                  webtestDriver.driver.executeScript(`
                    (function() {
                      // insert script tag
                      var s = document.createElement('script'), cssSelector, cssSelectorFrozen;
                      s.setAttribute('src', 'https://rawgit.com/fczbkk/css-selector-generator/master/build/css-selector-generator.js');
                      s.onload = function() { cssSelector = new CssSelectorGenerator(); };
                      document.body.appendChild(s);
                      // insert div#selector-display tag
                      var d = document.createElement('div');
                      d.setAttribute('id', 'selector-display');
                      d.setAttribute('style', 'position: fixed; top: 0; border: 1px solid #ccc; background: #eee');
                      document.body.appendChild(d);

                      // add mouseover event to document.body
                      document.body.addEventListener('mouseover', function(e) {
                        if (!cssSelectorFrozen) d.innerHTML = cssSelector.getSelector(e.target);
                      });
                      document.body.addEventListener('click', e => cssSelectorFrozen = !!!cssSelectorFrozen);
                    })();
                  `);
                }
                return resp === 'complete';
              })
          }, webtestDriver.config.timeout);
        });
    }
};
