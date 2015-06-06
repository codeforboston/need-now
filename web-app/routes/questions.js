var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var dummy_question = {
    id: 12,
    text: "What is your gender?",
    answer_mode: "radio-buttons",
    answer_choices: [
      {
        id: 1,
        text: "Male"
      },
      {
        id: 2,
        text: "Female"
      }
    ]
  }
  res.render('question', { question: dummy_question });
});

module.exports = router;
