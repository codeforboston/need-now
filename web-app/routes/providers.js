var express = require('express');
var router = express.Router();

// Pre-load list of providers
var providers = require('../public/data/providers.json');

/* GET home page. */
router.get('/', function(req, res) {
  // Just for testing, send the first 2 providers
  res.render('provider_table', { providers: providers.slice(0,2) });
});

module.exports = router;
