# Introduction To WebTest

Hello everyone.

My Name is Allen Kim, and I am here to introduce “webtest”, which is a simpler and easier way 
to do browser testing without knowing any computer language. What you need to know is English.

You can think of `webtest` as dialogue between "you" and "web browser" such as;

* open browser chrome
* goto www.google.com
* enter “allenhwkim” into “Search”
* submit it
* see "allenhwkim"

Technically `webtest` is written in Javascript and Selenium WebDriverJS,
but you don’t need to know Javascript to nor Selenium WebDriverJS.

There are two ways to run webtest;

* The first one is to run it in command line
* And the second one is to run as a script

There are two modes to run webtest; "Command line mode" and "Batch mode".

Command line mode is useful when you test each command one by one
to make it sure that you are writing the right script.

Batch mode is good to automate your test.

Let us begin with command line mode, which is easy to start.

Before that, you need to **install** `webtest`

    $ nam install web-test -g 

Please remember that the module name is **web-test**(web dash test), 
not webtest, although we are going to use `webtest` without dash as command name.

**-g** is to install webtest globally, so that you can run `webtest` at anywhere.

Now you are ready to run command line.

## Command Line Mode

$ webtest

![Imgur](http://i.imgur.com/XHXdODN.png)

You see what driver is ready, and what commands are available. OK, let’s start with 

    ? > open browser chrome

to open chrome browser. You want to go to google.com, then

    ? > go to www.google.com

Then you want to enter search string

    ? > enter “allenhwkim” into “Search”

So far, so good, right?

Now you want to verify the result, there are many verification commands.
To see all available commands, you simply enter “?” as a command

    ? > ?

Let’s verify you can see "allenhwkim" is on the page.

    ? > see "allenhwkim"

That’s it for command line mode. Just enter command to operate a web page.

Next, let’s get into the script mode. Script mode is to run all commands one by one.

## Script Mode

This is the test page, https://rawgit.com/allenhwkim/webtest/master/test/test-page.html

![Imgur](http://i.imgur.com/IIiqORL.png)

And this is the test script that we are going to run.

```
This is to test all core commands with test-page.html
  open browser chrome
  go to http://localhost:8080/test/test-page.html
  set window position 0 0
  set window size 100 600
  see "click here to change background color"
  click
  click "body div#change-color"
  click link "Click Here To Change Url"
  enter text 'Hello World' into text
  press "A" into text
  set speed 1 second
  verify element #submit is disabled
  set speed 1 millisecond
  click #enable
  verify element #submit is enabled
  click #radio1
  verify element #radio2 is not selected
  verify element #hidden is not visible
  click #show-hidden
  verify element #hidden is visible
  click #change-color
  verify element #change-color style background-color is "rgba(255, 255, 0, 1)"
  verify element #hidden text matches "^Hidden\ Element"
  verify title is "Test Form"
  verify title matches "Form"
  verify url matches "^http:\/\/"
  verify text "click here to change something" not present
  verify text "Click Here To Change Url" present
  click #enable
  submit
  wait for page load
  close browser
```

To run the script, you simply specify the file name next to `webtest` command

$ webtest test-page.txt

This is the result of the test.

![Imgur](http://i.imgur.com/2agAWIx.png)

That’s the introduction of `webtest`. You may want to do more than the given commands. 
Then, please fork [`webtest`](https://github.com/allenhwkim/webtest), the look into `commands` directory.
It’s not difficult to create a simple command.

Thanks for your time, and finally

“Happy Testing”

Allen Kim
