'use strict';

module.exports =  {
  'open browser {{STR}}':
    function openBrowser(url) {
      this.driver = this.driver
        .forBrowser(this.browser.name||'chrome').build();

      var window = this.driver.manage().window();
      var bConfig = this.browser;
      if (parseInt(bConfig.left) >= 0 && parseInt(bConfig.top) >= 0) {
        window.setPosition(bConfig.left, bConfig.top);
      }
      if (parseInt(bConfig.width) >= 0 && parseInt(bConfig.height) >= 0) {
        window.setSize(bConfig.width,  bConfig.height);
      }

      return this.driver.get(url);
    },

  'click':
    function click(string) {
      return this.__findBy('css', string)
        .then(() => this.lastElement.click());
    },

  'click {{STR}}':
    function click(string) {
      if (string) {
        return this.__findBy('css', string)
          .then(element => element.click());
      }
    },

  'click link {{STR}}':
    function clickLink(string) {
      return this.__findBy('linkText', string)
        .then(element => element.click());
    },

  'close browser':
    function closeBrowser() {
      this.driver.quit();
    },

  'visit {{STR}}':
    function visit(url) {
      return this.driver.get(url);
    },

  'see {{STR}}':
    function see(string) {
      let xpath = `//*[contains(., '${string}')][not(.//*[contains(., '${string}')])]`;
      return this.__findBy('xpath', xpath);
    },

  'submit':
    function submit() {
      return this.__findBy('css', 'input[type="submit"], button[type="submit"], form button:not([type])')
        .then(element => element.click());
    },

  'enter text {{STR1}} into {{STR2}}': 
    function enterTextInto(text, string) {
      return this.__findBy('css', string)
        .then(element =>  {
          element.clear();
          element.sendKeys(text);
        });
    },

  'wait for page load':
    function waitFporPageLoad() {
      return this.driver.wait( () =>
          this.driver.executeScript('return document.readyState')
            .then(resp => resp == 'complete')
        , this.timeout
      );
    }
};
