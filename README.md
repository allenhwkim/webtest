Selenuim WebDriver is great! ..........
But, it's not that easy for a beginner who does not understand full concept of Promise used in there.

For example, the following test code does make sense, but it will only work if you are super lucky;

    driver.get('https://run.plnkr.co/plunks/aWTZswhBnUVLg7qyDr83/');
    driver.findElement({css:'input'}).then(function(element) {
       element.getAttribute('value').then(function(str) {
         console.log('str', str); 
       });
    });;

    driver.findElement({css:'input'}).then(function(element) {
       element.sendKeys('Cheese!');
    });;

    driver.findElement({css:'button'}).then(function(element) {
       element.click();
    });;

    driver.quit();

You may get this error very easily, NoSuchElementError: Unable to locate element.

The reason is not only about timeout, but also every instruction is not executed insequence.
Almost all hates to deal with chainging these properly, and even properly chained code is not so maintainable.

WebDriver has very nice feature of wait/until to resolve things before to go further tests.

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




