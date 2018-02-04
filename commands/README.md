### Commands

| command      | target   | value
| ------------ | -------- | -----------------------------------------------
|clear         | selector |
|click         | selector |
|close         |          | window id
|enter         | selector | string
|goTo          |          | url
|keydown       | selector | character
|keyup         | selector | character
|mousedown     | selector |
|mousemove     |          | x,y
|mouseto       | selector |
|mouseup       |          |
|pause         |          | value
|runScript     | variable | script
|saveVariable  | selctor  | variable
|setValue      | selector | value (checkbox, radio, select, etc)
|setSpeed      |          | number
|verifyElement | selector | boolean
|verifyVisible | selector | boolean
|verifyStyle   | selector | name, value
|verifyValue   | selector | Regular Expression
|verifyScript  |          | script
|verifyText    | text     | boolean

* if command start with `verify`
  * run the command every second until it matches for 10 seconds
* else if target has a `selector`, wait for selector for 10 seconds
  * then run the command

#### xPath text matching code
```
var search =  document.evaluate('//*[contains(text(), "ABC")]', document, null, XPathResult.ANY_TYPE, null)
search.iterateNex();
```
