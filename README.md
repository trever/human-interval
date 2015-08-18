# Humanized Interval
Human readable interval parser and human-readable generator for Node.js/the Browser.

Merged and wrapped [rschmukler/human-interval](http://github.com/rschmukler/human-interval) and [EvanHahn/HumanizeDuration.js](https://github.com/EvanHahn/HumanizeDuration.js) into a single utility.

Heavily inspired by
[matthewmueller/date](http://github.com/matthewmueller/date).


## Example Usage

```js
var humanInterval = require('human-interval');

setTimeout(function() {
  // Do something crazy!
}, humanInterval('three minutes'));

```

## More sophisticated examples

humanInterval understands all of the following examples:

```js
humanInterval('one minute'); // 60000
humanInterval('1.5 minutes'); // 90000
humanInterval('3 days and 4 hours'); // 273600000
humanInterval('3 days, 4 hours and 36 seconds'); // 273636000

humanInterval(50000); // "5 seconds"
humanInterval(90000); // "1.5 minutes"

```

## The full list

### Supported Units

Human Interval supports the following units

- `seconds`
- `minutes`
- `hours`
- `days`
- `weeks`
- `months` -- assumes 30 days
- `years` -- assumes 365 days

### Wordy Numbers

Human Interval supports numbers up to ten being written out in English. If you
want to extend it, you can do so by adding more keys to the language map.
Alternatively you could add support for alternative languages.

```js
var humanInterval = require('human-interval');
humanInterval.languageMap['one-hundred'] = 100

// Adds support for the following:
humanInterval('one-hundred and fifty seconds') // returns 150000
```
