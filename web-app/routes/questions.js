var express = require('express');
var router = express.Router();

/* GET questions page. */
router.get('/', function(req, res) {
  var dummy_question = {
    id: 12,
    text: "What is your gender?",
    answer_mode: "single",
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
  // Save question in session hash variable 'answers':
  // {
  //   'question1': 'answer',
  //   'question2': 'answer2'
  // }
  req.session.answers = req.session.answers || {}
  req.session.answers[req.body.question] = req.body.answer;
  console.log(req.session.answers);
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
