Selenuim WebDriver is great! ..........  But, it's not that easy for
a beginner who does not understand full concept of Promise.

Also, you get the following error very easily, NoSuchElementError:
Unable to locate element.

    /Users/allen/github/webdriver-tt/node_modules/selenium-webdriver/lib/promise.js:654
        throw error;
        ^

    NoSuchElementError: Unable to locate element: {"method":"css selector","selector":"input"}

It is not only about timeout, but also about implicit/explicit wait.

This pain grows when we deal with Angular, especially Angular2.
I believe that's why `protractor` is invented.
However, even with `protractor`, timeout error, and not-found error is not avoidable.

WebDriver has very nice feature of wait/until to resolve things before to go
further tests.

We can change it to use explicit wait by using `driver.wait` and `webdriver.until`,
but almost all hates to deal with chainging these promises properly,
and even properly chained code is not so maintainable.

This is wait syntax

    driver.wait(CONDITION, MS);

We can combine this syntax with `driver.until`. **conditions**. For example,

    driver.until.elementIsVisible({css: '.my-class'})

The problem is that we can do only once. The following code is not guranteed to run in sequence

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

Although the above code works, the repeativive `function()`, `then`, and `{ ..}`
makes people not to focus on test, but the Javascript promise syntax.

That's the reason web-test is born.
