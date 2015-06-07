var express = require('express');
var router = express.Router();

// Pre-load list of providers
var providers = require('../public/data/providers.json');

// Parse answers from session hash into a more readable JSON object
var parsedAnswers(answers) {
  // Mocked for now
  return {
    gender: "male",
    age: "under 29",
    interests: ["medical assistance", "other"]
  }
}

// Filter the providers list based on the answers in the session hash
var filteredProviders(answers) {
  return providers.slice(0,2);
}

/* GET home page. */
router.get('/', function(req, res) {
  res.render('provider_table', {
    providers: filteredProviders(req.session.answers),
    answers: parsedAnswers(req.session.answers)
  });
});

module.exports = router;
