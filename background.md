Selenuim WebDriver is great! ..........  But, it's not that easy for
a beginner who does not understand full concept of DOM and Promise.

What is Promise? Yeh, you don't even want to know.

Even you know about Promise and DOM well. you get this error,
 NoSuchElementError, easily;

    /Users/allen/github/webdriver-tt/node_modules/selenium-webdriver/lib/promise.js:654
        throw error;
        ^

    NoSuchElementError: Unable to locate element: {"method":"css selector","selector":"input"}

"WT*, the element is there, you see!!!! #$#!%!$!@!"
baning your head on table.

To explain, it is about timeout. Even more, it's also about implicit/explicit wait.
And to explain more, you should not mix implicit and explicit wait
when you test a web page.

"What the &%@$ is implicit wait and explicit wait?"
It's pretty clear that you don't want to know about it.
You just simply want your test to work as you coded.

Sadly, this is not the end. The pain grows
test pain grows when you deal with Angular, especially Angular2.

That's why `protractor` is invented.
You may react to this as
"What is protractor? Do I have to know that too?".
your question is valid and many have raised the same question.

Let's assume that you know protractor too. The worst part of
web browser test of Angular appliction is, even with `protractor`, timeout error, and not-found error is not avoidable.

That's the end? Yes it's the end of your nightmare.
You suffered enough.

WebDriver has very nice feature of wait/until to make it sure you
get the element you want to test.

 * `driver.wait`
 * `webdriver.until`,

Both returns promise, and to make your test to work properly, you
need to chain these functions properly.

Almost all hate to deal with chainging these promises properly,
and even properly chained code is not so looking good and not so maintainable.

Let me explain this with some Javascript code.

This is wait syntax

    driver.wait(CONDITION, millisecond);

We can combine this syntax with `driver.until`. **conditions**.
For example,

    driver.until.elementIsVisible({css: '.my-class'})

The problem is that the following code is not guranteed
 to run in sequence

    driver.wait(until.elementLocated({css:"h3.first"}), 2000)
      .then(function() { console.log(1) });
    driver.wait(until.elementLocated({css:"div"}), 2000)
      .then(function() { console.log(2) });
    driver.wait(until.elementLocated({css:"body"}), 2000)
      .then(function() { console.log(3) });

To make it really sequenctial, we need to code like this;

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

Although the above code works, repeativive
`function()`, `then`, and `{ ..}`
makes people not to focus on test, but the Javascript promise syntax.

That's the reason web-test is born.

Allen Kim's solution [web-test](https://github.com/jsvalley/web-test)
will accept the following command and just run it by doing all chaning
properly within it.

With `web-test`, this is how to write a test

    open browser '/login'
    enter text 'John' into 'username'
    submit
    close browser

And this is how to run a test

    $ web-test my-test-scenario.txt

[web-test](https://github.com/jsvalley/web-test) is still in
early stage though at this time. It will get mature with your
interest and contributoin.

Cheers,

Happy Testing


