var express = require('express');
var router = express.Router();
var _ = require("underscore");

// Pre-load list of providers
var providers = require('../public/data/providers.json');

// Parse answers from session hash into a more readable JSON object
var parsedAnswers = function(answers) {
  parsed = {
    interests: [] // So we can push
  }
  switch(answers['1']) {
    case '1':
      parsed.interests.push('shelter');
      break;
    case '2':
      parsed.interests.push('food');
      break;
    case '3':
      parsed.interests.push('medical');
  }
  switch(answers['2']) {
    case '1':
      parsed.gender = 'male';
      break;
    case '2':
      parsed.gender = 'female';
      break;
    default:
      parsed.gender = 'other';
  }
  parsed.age = String(answers['3']);

  return parsed;
}

// Filter the providers list based on the answers in the session hash
var filteredProviders = function(answers) {
  // Question IDs and answers:
  // "1" - Interests: "1" (Shelter), "2" (Food), "3" (Medical), "4" (Other)
  // "2" - Gender: "1" (Male), "2" (Female), "3" (Other)
  // "3" - Age: (numeric/string)
  filtered = filterProvidersByInterests(providers, answers['1']);
  filtered = filterProvidersByGender(filtered, answers['2']);
  filtered = filterProvidersByAge(filtered, answers['3']);
  for (var i = 0; i < filtered.length; i++) {
    filtered[i].serviceList = constructServiceList(filtered[i]);
  };
  return filtered;
}

// Filter providers by gender
var filterProvidersByGender = function(providers, answer) {
  switch(answer) {
    case '1': // Men only and all
      return _.filter(providers, function(provider) {
        return provider['Gender'] == 'men' || provider['Gender'] == 'all';
      });
    case '2': // Women only and all
      return _.filter(providers, function(provider) {
        return provider['Gender'] == 'women' || provider['Gender'] == 'all';
      });
    default: // Only all
      return _.filter(providers, function(provider) {
        return provider['Gender'] == 'all';
      });
  }
}

var constructServiceList = function(provider) {
  var services = [];
  if (provider.HIV == '1') {
    services.push('HIV');
  }
  if (provider.Veteran == '1') {
    services.push('Veteran');
  }
  if (provider.LGBTQ == '1') {
    services.push('LGBTQ');
  }
  if (provider.Sober == '1') {
    services.push('Dry Shelter');
  }
  if (provider.HomelessOnly == '1') {
    services.push('Homeless Only');
  }
  if (services.length === 0) {
    services.push('None');
  }
  return services.join(', ');
}

// Filter providers by interests
var filterProvidersByInterests = function(providers, answer) {
  switch(answer) {
    case '1': // Shelter
      return _.filter(providers, function(provider) {
        return provider['Category'] == 'SHELTER';
      });
    case '2': // Food
      return _.filter(providers, function(provider) {
        return provider['Category'] == 'FOOD';
      });
    case '3': // Medical
      return _.filter(providers, function(provider) {
        return provider['Category'] == 'MEDICAL';
      });
    default: // Unfilter, but avoid 'NO' category
      return _.filter(providers, function(provider) {
        return provider['Category'] != 'NO';
      });
  }
}

// Filter providers by age
var filterProvidersByAge = function(providers, answer) {
  return _.filter(providers, function(provider) {
    return parseInt(provider['MinAge']) <= parseInt(answer) &&
           parseInt(provider['MaxAge']) >= parseInt(answer);
  });
}

/* GET home page. */
router.get('/', function(req, res) {
  res.render('provider_table', {
    providers: filteredProviders(req.session.answers),
    answers: parsedAnswers(req.session.answers)
  });
});

module.exports = router;
