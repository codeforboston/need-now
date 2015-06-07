var express = require('express');
var router = express.Router();

// Pre-load list of providers
var providers = require('../public/data/providers.json');

// Parse answers from session hash into a more readable JSON object
var parsedAnswers = function(answers) {
  // Mocked for now
  return {
    gender: "male",
    age: "under 29",
    interests: ["medical assistance", "other"]
  }
}

// Filter the providers list based on the answers in the session hash
var filteredProviders = function(answers) {
  // Question IDs and answers:
  // "1" - Interests: "1" (Shelter), "2" (Food), "3" (Medical)
  // "2" - Gender: "1" (Male), "2" (Female), "3" (Other)
  // "3" - Age: "1" (Under 30), "2" (30 to 44), "3" (45+)
  filtered = filterProvidersByInterests(providers, answers['1']);
  filtered = filterProvidersByGender(filtered, answers['2']);
  filtered = filterProvidersByAge(filtered, answers['3']);
  return filtered;
}

// Filter providers by interests
var filterProvidersByInterests = function(providers, answer) {
  // Mocked, just returns unfiltered results
  return providers;
}

// Filter providers by gender
var filterProvidersByGender = function(providers, answer) {
  // Mocked, just returns unfiltered results
  return providers;
}

// Filter providers by age
var filterProvidersByAge = function(providers, answer) {
  // Mocked, just returns unfiltered results
  return providers;
}

/* GET home page. */
router.get('/', function(req, res) {
  res.render('provider_table', {
    providers: filteredProviders(req.session.answers),
    answers: parsedAnswers(req.session.answers)
  });
});

module.exports = router;
