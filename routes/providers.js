var express = require('express');
var router  = express.Router();
var _       = require('underscore');
var request = require('request');

// Pre-load list of providers. This was a previous method of loading provider information from a static JSON file.
// var providers = require('../public/data/providers.json'); 

// Parse answers from session hash into a more readable JSON object
var parsedAnswers = function(answers) {
  var parsed = { interests: [] }; // So we can push
  switch (answers['1']) {
    case '1': {
      parsed.interests.push('shelter');
      break;
    }
    case '2': {
      parsed.interests.push('food');
      break;
    }
    case '3': {
      parsed.interests.push('medical');
    }
  }
  switch (answers['2']) {
    case '1': {
      parsed.gender = 'male';
      break;
    }
    case '2': {
      parsed.gender = 'female';
      break;
    }
    default: {
      parsed.gender = 'other';
    }
  }
  parsed.age = String(answers['3']);

  return parsed;
};

var constructServiceList = function(provider) {
  var services = [];
  if (provider.HIV == '1') {
    services.push('Provides HIV/AIDS services or testing');
  }
  if (provider.Veteran == '1') {
    services.push('Serves veterans');
  }
  if (provider.LGBTQ == '1') {
    services.push('Serves LGBTQ community');
  }
  if (provider.Sober == '1') {
    services.push('Only permits guests who are not actively using');
  }
  return services;
};

// Returns the status of the provider for the current day and time. The format
// we expect from the 'days' field is:
//
// DayOfTheWeek OpenTime-CloseTime;DayOfTheWeek OpenTime-CloseTime...
//
// With OpenTime/CloseTime in 24hr format (1700, 1830...)
//
// The return value is numeric, so we can use if for sorting:
//    0: Open (Definitely open)
//    1: See details (couldn't decypher 'days' string)
//    2: Unsure (Field 'days' was 'unspecified')
//    3: Closed (Definitely closed)
var obtainOpenStatus = function(days) {
  var d = new Date();
  var daysOfTheWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  var todaysDay = daysOfTheWeek[d.getDay()];

  var hours = parseInt((d.getHours()) + '' + d.getMinutes());

  if (days == 'unspecified') {
    return 2;
  }
  if (days.indexOf(todaysDay) >= 0) {
    var result = { open: 1 };
    _.each(days.split(';'), function(day) {
      if (day.indexOf(todaysDay) >= 0) {
        if (day.split(' ').length == 0) { // No hours specified, open
          this.open = 0;
        } else if (day.split(' ').length == 2) { // We have hours specified
          var hoursFrom = parseInt(day.split(' ')[1].split('-')[0]);
          var hoursTo = parseInt(day.split(' ')[1].split('-')[1]);
          if (hours >= hoursFrom && hours <= hoursTo) {
            this.open = 0;
          } else {
            this.open = 3;
          }
        }
      }
    }, result);
    return result.open;
  } else {
    return 3;
  }
  return 1;
};

// Filter providers by gender
var filterProvidersByGender = function(providers, answer) {
  switch (answer) {
    case '1': { // Men only and all
      return _.filter(providers, function(provider) {
        return provider.Gender == 'men' || provider.Gender == 'all';
      });
    }
    case '2': { // Women only and all
      return _.filter(providers, function(provider) {
        return provider.Gender == 'women' || provider.Gender == 'all';
      });
    }
    default: { // Only all
      return _.filter(providers, function(provider) {
        return provider.Gender == 'all';
      });
    }
  }
};

// Filter providers by interests
var filterProvidersByInterests = function(providers, answer) {
  switch (answer) {
    case '1': { // Shelter
      return _.filter(providers, function(provider) {
        return provider.Category == 'SHELTER';
      });
    }
    case '2': { // Food
      return _.filter(providers, function(provider) {
        return provider.Category == 'FOOD';
      });
    }
    case '3': { // Medical
      return _.filter(providers, function(provider) {
        return provider.Category == 'MEDICAL';
      });
    }
    default: { // Unfilter, but avoid 'NO' category
      return _.filter(providers, function(provider) {
        return provider.Category != 'NO';
      });
    }
  }
};

// Filter providers by age
var filterProvidersByAge = function(providers, answer) {
  return _.filter(providers, function(provider) {
    return parseInt(provider.MinAge) <= parseInt(answer) &&
           parseInt(provider.MaxAge) >= parseInt(answer);
  });
};

var sortProvidersByOpenStatus = function(providers) {
  return _.sortBy(providers, 'open');
};

// Filter the providers list based on the answers in the session hash, then renders the page through the callback.
var filteredProviders = function(answers, callback) {
  // Simple GET call to the Google Apps Script, which will redirect to a block of JSON text. request traverses the redirect by default.
  request('https://script.google.com/macros/s/AKfycbxDgI7u4IHiai0ZsG2sXdG846Ulc06aKCxV1UF228mPhv8fo7c/exec', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // Parse the returned JSON string into an array of providers objects
      var providers = JSON.parse(body);

      // Run the answer filters consecutively
      // Question IDs and answers:
      // "1" - Interests: "1" (Shelter), "2" (Food), "3" (Medical), "4" (Other)
      // "2" - Gender: "1" (Male), "2" (Female), "3" (Other)
      // "3" - Age: (numeric/string)
      var filtered = filterProvidersByInterests(providers, answers['1']);
      filtered = filterProvidersByGender(filtered, answers['2']);
      filtered = filterProvidersByAge(filtered, answers['3']);

      for (var i = 0; i < filtered.length; i++) {
        filtered[i].servicesArray = constructServiceList(filtered[i]);
        filtered[i].open = obtainOpenStatus(filtered[i].Days);
      }

      filtered = sortProvidersByOpenStatus(filtered);

      // Run the provided callback function, most likely the page renderer
      callback(filtered);
    }
  });
};

/* GET home page. */
router.get('/', function(req, res) {
  // Because of the asynchronous GET call, we need to pass the renderer as a callback that waits on the GET request to complete and be processed.
  filteredProviders(req.session.answers, function(providers) {
    res.render('provider_table', {
      providers: providers,   // filteredProviders will provide the callback with the filtered provider list.
      answers: parsedAnswers(req.session.answers)
    });
  });
});

module.exports = router;
