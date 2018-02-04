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

#### xPath text matching code
```
var search =  document.evaluate('//*[contains(text(), "ABC")]', document, null, XPathResult.ANY_TYPE, null)
search.iterateNex();
```
