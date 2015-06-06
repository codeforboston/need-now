var express = require('express');
var router = express.Router();

/* GET questions page. */
router.get('/', function(req, res) {
  res.render('results');
});

module.exports = router;
