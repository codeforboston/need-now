var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var dummy_providers = [
    {
      id: 1,
      name : "Pine Street Inn",
      public_transit: "Central Square MBTA",
      open_now: true,
      more_info: "This is a dry shelter open Monday - Friday"
    },
    {
      id: 2,
      name : "Harvard Square Shelter",
      public_transit: "Harvard Square MBTA",
      open_now: false,
      more_info: "This is a wet shelter open Monday - Friday"
    }
  ]
  res.render('provider_table', { providers: dummy_providers });
});

module.exports = router;
