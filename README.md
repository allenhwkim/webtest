webtest
=========
[![Build Status](https://travis-ci.org/allenhwkim/webtest.svg?branch=master)](https://travis-ci.org/allenhwkim/webtest)
[![Join the chat at https://gitter.im/allenhwkim/webtest](https://badges.gitter.im/allenhwkim/webtest.svg)](https://gitter.im/allenhwkim/webtest?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Run Web Page Test In Plain English

Principle
---------
 
  1. Web browser test in plain English
  
     Not Javascript nor other language
     
  2. Test visible sections. 
  
     Not variable, attributes, nor properties
     
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

  * Run web browser test in plain English from command line or a file
  * Built-in chromedriver, firefox driver, and reporter
  * No need to run a selenium-server standalone jar file
  * Ability to control execution speed
  * No protractor, just test web page
  * Angular1-friendly, Angular2-friendly, Or, any framework friendly


Install 
-------
  * `npm install webtest`

Usage
-----

  1. **Run `webtest` in command line**
  
         webtest (master)$ node index.js 
         webTestDriver is initialized as { browser: { name: 'chrome' }, timeout: 10000 }
         ? > open browser chrome
         OK
         ? > go to https://www.google.com
         OK

  1. Or, write tests in plain English. e.g.,  my-test-scenario.txt

         My Google
           Test Case 1
             open browser chrome
             go to http://google.com
             enter 'Allen Kim' into 'Search'
             submit
             see 'allenhwkim'

    Then, and run the test file

        $ webtest my-test.txt

Core Commands
-------------

  * click link `<link-text>`
  * click `<selector>`
  * close browser
  * enter text `<string>` into `<selector>`
  * go to `<url>`
  * open browser `<browser-name>`
  * see "`<text>`"
  * set window position `<left>` `<top>`
  * set window size `<width>` `<height>`
  * submit
  * verify element `<selector>` is disabled
  * verify element `<selector>` is enabled
  * verify element `<selector>` is not selected
  * verify element `<selector>` is not visible
  * verify element `<selector>` is selected
  * verify element `<selector>` `<style-name>` is "`<style-value>`"
  * verify element `<selector>` text matches "`<string>`"
  * verify element `<selector>` text is "`<string>`"
  * verify element `<selector>` is visible
  * verify title matches "`<title>`"
  * verify title is "`<title>`"
  * verify url matches `<string>`
  * wait for page load
  
  * save value of expression `<js-expression>` to `<variable>`
  * save value of element `<selector>` to `<variable>`
  * print variable `<variable>`
  * verify expression `<js-expression>`

NOTE: 
-----
 
  * If webtest is run on TRAVIS CI environment, the browser is always `firefox` 
    although user specify the browser in `open browser` command


Developer Note
--------------

    $ npm install -g # to install this to run on local environment e.g., $ webtest
    
