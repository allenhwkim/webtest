Web-Test
=========
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
  * `npm install web-test`
  * or, `npm install web-test -g` to enable `webtest` command anywhere

Usage
-----

  1. **Run `webtest` in command line**
  
         web-test (master)$ node index.js 
         SeleniumWebTestDriver is initialized as { browser: { name: 'chrome' }, timeout: 10000 }
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

        $ web-test my-test.txt

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

