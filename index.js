(function(global){
  var humanInterval = function humanInterval(time) {
    if(!time) return time;
    if(typeof time == 'number') return humanizeDuration(time);
    time = swapLanguageToDecimals(time);
    time = time.replace(/(second|minute|hour|day|week|month|year)s?(?! ?(s )?and |s?$)/, '$1,');
    return time.split(/and|,/).reduce(function(sum, group) {
      return sum + (group != "" ? processUnits(group) : 0);
    }, 0);
  };

  humanInterval.languageMap = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'ten': 10
  };

  function swapLanguageToDecimals(time) {
    var language = humanInterval.languageMap;
    var languageMapRegex = new RegExp('(' + Object.keys(language).join('|') + ')', 'g');
    var matches = time.match(languageMapRegex);
    if(!matches) return time;

    matches.forEach(function(match) {
      var matchStr = language[match] > 1 ? language[match] : language[match].toString().slice(1);
      time = time.replace(match, matchStr);
    });

    return time;
  }

  function processUnits(time) {
    var num = parseFloat(time, 10),
        unit = time.match(/(second|minute|hour|day|week|month|year)s?/)[1];

    if(!num) num = 1;

    switch(unit) {
      case 'second': unit = 1000; break;
      case 'minute': unit = 1000 * 60; break;
      case 'hour':   unit = 1000 * 60 * 60; break;
      case 'day':    unit = 1000 * 60 * 60 * 24; break;
      case 'week':   unit = 1000 * 60 * 60 * 24 * 7; break;
      case 'month':  unit = 1000 * 60 * 60 * 24 * 30; break;
      case 'year':   unit = 1000 * 60 * 60 * 24 * 365; break;
    }

    return unit * num;
  }

  // HumanizeDuration.js - http://git.io/j0HgmQ
  var languages = {
    en: {
      y: function(c) { return "year" + ((c !== 1) ? "s" : ""); },
      mo: function(c) { return "month" + ((c !== 1) ? "s" : ""); },
      w: function(c) { return "week" + ((c !== 1) ? "s" : ""); },
      d: function(c) { return "day" + ((c !== 1) ? "s" : ""); },
      h: function(c) { return "hour" + ((c !== 1) ? "s" : ""); },
      m: function(c) { return "minute" + ((c !== 1) ? "s" : ""); },
      s: function(c) { return "second" + ((c !== 1) ? "s" : ""); },
      ms: function(c) { return "millisecond" + ((c !== 1) ? "s" : ""); },
      decimal: "."
    }
  };

  // You can create a humanizer, which returns a function with defaults
  // parameters.
  function humanizer(passedOptions) {
    var result = function humanizer(ms, humanizerOptions) {
      var options = extend({}, result, humanizerOptions || {});
      return doHumanization(ms, options);
    };

    return extend(result, {
      language: "en",
      delimiter: ", ",
      spacer: " ",
      units: ["y", "mo", "w", "d", "h", "m", "s"],
      languages: {},
      round: false,
      unitMeasures: {
        y: 31557600000,
        mo: 2629800000,
        w: 604800000,
        d: 86400000,
        h: 3600000,
        m: 60000,
        s: 1000,
        ms: 1
      }
    }, passedOptions);
  }

  // The main function is just a wrapper around a default humanizer.
  var defaultHumanizer = humanizer({});
  function humanizeDuration() {
    return defaultHumanizer.apply(defaultHumanizer, arguments);
  }

  // doHumanization does the bulk of the work.
  function doHumanization(ms, options) {

    // Make sure we have a positive number.
    // Has the nice sideffect of turning Number objects into primitives.
    ms = Math.abs(ms);

    var dictionary = options.languages[options.language] || languages[options.language];
    if (!dictionary) {
      throw new Error("No language " + dictionary + ".");
    }

    var result = [];

    // Start at the top and keep removing units, bit by bit.
    var unitName, unitMS, unitCount;
    for (var i = 0, len = options.units.length; i < len; i++) {

      unitName = options.units[i];
      unitMS = options.unitMeasures[unitName];

      // What's the number of full units we can fit?
      if ((i + 1) === len) {
        unitCount = ms / unitMS;
        if (options.round) {
          unitCount = Math.round(unitCount);
        }
      } else {
        unitCount = Math.floor(ms / unitMS);
      }

      // Add the string.
      if (unitCount) {
        result.push(render(unitCount, unitName, dictionary, options));
      }

      // Do we have enough units?
      if (options.largest && (options.largest <= result.length)) {
        break;
      }

      // Remove what we just figured out.
      ms -= unitCount * unitMS;

    }

    if (result.length) {
      return result.join(options.delimiter);
    } else {
      return render(0, options.units[options.units.length - 1], dictionary, options);
    }

  }

  function render(count, type, dictionary, options) {
    var decimal;
    if (options.decimal === void 0) {
      decimal = dictionary.decimal;
    } else {
      decimal = options.decimal;
    }

    var countStr = count.toString().replace(".", decimal);

    var dictionaryValue = dictionary[type];
    var word;
    if (typeof dictionaryValue === "function") {
      word = dictionaryValue(count);
    } else {
      word = dictionaryValue;
    }

    return countStr + options.spacer + word;
  }

  function extend(destination) {
    var source;
    for (var i = 1; i < arguments.length; i++) {
      source = arguments[i];
      for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
          destination[prop] = source[prop];
        }
      }
    }
    return destination;
  }

  // Internal helper function for Polish language.
  function getPolishForm(c) {
    if (c === 1) {
      return 0;
    } else if (Math.floor(c) !== c) {
      return 1;
    } else if (c % 10 >= 2 && c % 10 <= 4 && !(c % 100 > 10 && c % 100 < 20)) {
      return 2;
    } else {
      return 3;
    }
  }

  // Internal helper function for Russian and Ukranian languages.
  function getSlavicForm(c) {
    if (Math.floor(c) !== c) {
      return 2;
    } else if (c === 0 || (c >= 5 && c <= 20) || (c % 10 >= 5 && c % 10 <= 9) || (c % 10 === 0)) {
      return 0;
    } else if (c === 1 || c % 10 === 1) {
      return 1;
    } else if (c > 1) {
      return 2;
    } else {
      return 0;
    }
  }

  function getSupportedLanguages() {
    var result = [];
    for (var language in languages) {
      if (languages.hasOwnProperty(language)) {
        result.push(language);
      }
    }
    return result;
  }

  humanizeDuration.humanizer = humanizer;
  humanizeDuration.getSupportedLanguages = getSupportedLanguages;
  var humanizedInterval = humanInterval;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = humanizedInterval;
  } else {
    global.humanizedInterval = humanInterval;
  };
})(this);