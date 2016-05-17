Web-Test
=========
Run Web Page Test In Plain English

Goal
------
The web browser test script should be like this;

    open browser '/login'
    enter text 'John' into 'username'
    submit
    close browser

Instead of;

    var webdriver = require('selenium-webdriver'),
        until = webdriver.until;

    var driver = new webdriver.Builder().forBrowser('chrome').build();

    driver.get('/login');
    driver.findElement({css:'input[placeholder="username"'})
      .then(function(element) {
        element.sendKeys('John');
      })
    });

    ... even more javascript here ...

    driver.quit();

Features
----------

  * Run test as plain English test scenario
  * Built-in chromedriver, firefox driver, and reporter
  * No need to run a selenium-server standalone jar file
  * Ability to control execution speed
  * No protractor, just test web page
  * Angular1-friendly and Angular2-friendly


Install 
-------
  * `npm install web-test`
  * or, `npm install web-test -g` to enable `web-test` command globally

Usage
-----

  1. Write test scenario in plain English. e.g.,  my-test-scenario.txt

         My Google
           Test Case 1open browser 'http://google.com'
             enter 'Allen Kim' into 'Search'
             submit
             see 'allenhwkim (Allen Kim) · GitHub'

  2. Run the test

         web-test my-test-scenario.txt

  3. Done

Scenario File Example
---------------------

    This is my scenario

      Angular2 test 1 and this is a test case
        open browser 'https://run.plnkr.co/plunks/3wZsyl/'
        click 'input.form-control'
        enter text 'Foo Bar' into 'input.form-control'
        submit
        see '"greenCarName": "Foo Bar"'

      Angular2 test 2 and this is a test case
        click link 'Angular 2 Form Builder'
        close browser

Core Commands
--------------
  * open browser {{STR}}
  * click
  * click {{STR}}
  * click link {{STR}}
  * close browser
  * visit {{STR}}
  * see {{STR}}
  * submit
  * enter text {{STR1}} into {{STR2}}
  * wait for page load
  * verify title is {{STR}}
  * verify title matches {{STR}}
  * verify element {{STR}} located
  * verify element {{STR}} is visible
  * verify element {{STR}} is not visible
  * verify element {{STR}} is enabled
  * verify element {{STR}} is disabled
  * verify element {{STR}} is selected
  * verify element {{STR}} is not selected
  * verify element {{STR1}} text is {{STR2}}
  * verify element {{STR1}} text matches {{STR2}}
