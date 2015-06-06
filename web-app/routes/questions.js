var express = require('express');
var router = express.Router();

/* GET questions page. */
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

/* POST answers. */
router.post('/', function(req, res) {
  var dummy_question = {
    id: 12,
    text: req.body.question,
    answer_mode: req.body.answer,
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
