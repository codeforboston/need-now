var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var dummy_providers = [
    {
      "ID":1,
      "ProgramName":"Social Security Administration",
      "Gender":"all",
      "MinAge":"0",
      "MaxAge":"200",
      "Section":"Key",
      "Veteran":"0",
      "Sober":"0",
      "Location":"NCamb",
      "Days":"unspecified",
      "FIELD11":"",
      "LGBTQ":"0",
      "HIV":"0",
      "Seasonal":"0",
      "HomelessOnly":"0",
      "OffWeeks":"0",
      "Accessible":"1",
      "Address":"10 Fawcett Street",
      "City":"Cambridge",
      "State":"MA",
      "Zip":"",
      "Transit":"#74 or #78 bus from Harvard",
      "Phone":"800-772-1213",
      "Link":"www.ssa.gov",
      "Language":"",
      "Latitude":"42.39318933",
      "Longitude":"-71.14779137"
    },
    {
      "ID":2,
      "ProgramName":"Massachusetts Department of Transitional Assistance",
      "Gender":"all",
      "MinAge":"0",
      "MaxAge":"200",
      "Section":"Key",
      "Veteran":"0",
      "Sober":"0",
      "Location":"other",
      "Days":"unspecified",
      "FIELD11":"",
      "LGBTQ":"0",
      "HIV":"0",
      "Seasonal":"0",
      "HomelessOnly":"0",
      "OffWeeks":"0",
      "Accessible":"1",
      "Address":"80 Everett Avenue",
      "City":"Chelsea",
      "State":"MA",
      "Zip":"",
      "Transit":"#111 bus from Haymarket T",
      "Phone":"617-551-1700",
      "Link":"www.mass.gov/eohhs/gov/departments/dta F",
      "Language":"",
      "Latitude":"42.3936905",
      "Longitude":"-71.03921912"
    }
  ]
  res.render('provider_table', { providers: dummy_providers });
});

module.exports = router;
