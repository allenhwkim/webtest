Selenuim WebDriver is great! ..........  But, it's not that easy for a beginner who does not understand full concept of Promise used in there.

For example, the following test code does make sense, but it will only work if you are super lucky;

    var webdriver = require('selenium-webdriver'),
        until = webdriver.until;

    var driver = new webdriver.Builder().forBrowser('firefox').build();

    driver.get('https://run.plnkr.co/plunks/aWTZswhBnUVLg7qyDr83/');
    driver.findElement({css:'input'}).then(function(element) {
      element.sendKeys('Cheese!');
      element.getAttribute('value').then(function(str) {
        console.log('str', str); 
      });
    });;

    driver.quit();

You may get this error very easily, NoSuchElementError: Unable to locate element.

    /Users/allen/github/webdriver-tt/node_modules/selenium-webdriver/lib/promise.js:654
        throw error;
        ^

    NoSuchElementError: Unable to locate element: {"method":"css selector","selector":"input"}

The reason is not only about timeout, but also every about implicit wait instruction is not executed insequence.

This pain grows when we deal with Angular, especially Angular2.
That might be the reason `protractor` is invented. However, even with `protractor`, timeout error, implicit and explicit wait still comes time to time, makes successful tests very inconsistent.

WebDriver has very nice feature of wait/until to resolve things before to go further tests.
We can change it to use explicit wait by using `driver.wait` and `webdriver.until`, 
but almost all hates to deal with chainging these properly, and even properly chained code is not so maintainable.

wait syntax

    driver.wait(CONDITION, MS);

We can combine this syntax with `driver.until` **conditions**

    driver.until.alertIsPresent()                      -> alert
    driver.until.titleIs(string)                       -> boolean
    driver.until.titleContains(stirng)                 -> boolean
    driver.until.titleMatches(RE)                      -> boolean
    driver.until.elementLocated(locator)               -> element
    driver.until.elementIsVisible(locator)             -> boolean
    driver.until.elementIsNotVisible(locator)          -> boolean
    driver.until.elementIsEnabled(locator)             -> boolean
    driver.until.elementIsDisabled(locator)            -> boolean
    driver.until.elementIsSelected(locator)            -> boolean
    driver.until.elementIsNotSelected(locator)         -> boolean
    driver.until.elementTextIs(locator, string)        -> string
    driver.until.elementTextContains(locator, string)  -> string
    driver.until.elementTextMatches(locator, RE)       -> string

The problem is that we can do only one. The following code is not guranteed to run in sequence

    driver.wait(CONDITION1, 2000).then(function() { console.log(1) });
    driver.wait(CONDITION2, 2000).then(function() { console.log(2) });
    driver.wait(CONDITION3, 2000).then(function() { console.log(3) });

To make it really sequenctial, we need to code like the following

    driver.get('http://www.primefaces.org/primeng/#/autocomplete');

    driver.wait(until.elementLocated({css:"h3.first"}), 20000).then(function() {
     console.log(1);
    }).then(function() {
      driver.wait(until.elementLocated({css:"div"}), 20000).then(function() {
       console.log(2);
     })
    }).then(function() {
      driver.wait(until.elementLocated({css:"body"}), 20000).then(function() {
       console.log(3);
     })
    })

Although the above code works, the repeativive `function()`, `then`, and `{ ..}` makes people not to focus on test, but the promise syntax.

webdriver-testcase is designed to focus on test cases, not Javascript syntax by genrating promise-chained `then..then..then..then..then..` code from clean test cases.

These are pattern of commands

  * visit {{URL}}
  * find {{ELEMENT}}
  * enter {{STRING}} into {{ELEMENT}}
  * move mouse to {{ELEMENT}}
  * scroll to {{ELEMENT}}
  * click {{ELEMENT}}
  * verify {{ELEMENT}} is located
  * verify {{ELEMENT}} is visible
  * verify {{ELEMENT}} is not visible
  * verify {{ELEMENT}} is enabled
  * verify {{ELEMENT}} is disabled
  * verify {{ELEMENT}} is selected
  * verify {{ELEMENT}} is not selected
  * verify title is {{STRING}}
  * verify title contains {{STRING}}
  * verify title matches {{REGULAR_EXPRESSION}}
  * verify {{TEXT}}
  * verify {{ELEMENT}} text is {{STRING}}
  * verify {{ELEMENT}} text contains {{STRING}}
  * verify {{ELEMENT}} text matches {{REGULAR_EXPRESSION}}


Error: The ChromeDriver could not be found on the current PATH. Please download the latest version of the ChromeDriver from http://chromedriver.storage.googleapis.com/index.html and ensure it can be found on your PATH.

Solution: download chromedriver into your current directory.
