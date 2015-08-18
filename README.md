# Humanized Interval
Human readable interval parser and human-readable generator for Node.js/the Browser.

Merged and wrapped [rschmukler/human-interval](http://github.com/rschmukler/human-interval) and [EvanHahn/HumanizeDuration.js](https://github.com/EvanHahn/HumanizeDuration.js) into a single utility.

Heavily inspired by
[matthewmueller/date](http://github.com/matthewmueller/date).


## Example Usage

```js
var humanizedInterval = require('humanized-interval');

setTimeout(function() {
  // Do something crazy!
}, humanizedInterval('three minutes'));

```

## More sophisticated examples

humanizedInterval understands all of the following examples:

```js
humanizedInterval('one minute'); // 60000
humanizedInterval('1.5 minutes'); // 90000
humanizedInterval('3 days and 4 hours'); // 273600000
humanizedInterval('3 days, 4 hours and 36 seconds'); // 273636000

humanizedInterval(50000); // "5 seconds"
humanizedInterval(90000); // "1.5 minutes"

```

## The full list

### Supported Units

Humanized Interval supports the following units

- `seconds`
- `minutes`
- `hours`
- `days`
- `weeks`
- `months` -- assumes 30 days
- `years` -- assumes 365 days

### Wordy Numbers

Humanized Interval supports numbers up to ten being written out in English. If you
want to extend it, you can do so by adding more keys to the language map.
Alternatively you could add support for alternative languages.

```js
var humanizedInterval = require('humanized-interval');
humanizedInterval.languageMap['one-hundred'] = 100

// Adds support for the following:
humanizedInterval('one-hundred and fifty seconds') // returns 150000
```
