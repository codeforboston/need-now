var express = require('express');
var router = express.Router();

// Pre-load list of questions
var questions = require('../public/data/questions.json');

/* GET questions page. */
router.get('/', function(req, res) {
  // Just for testing, send first one
  res.render('question', { question: questions[0] });
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
  // Just for testing, if we have 3 diferent answers, go to results
  if (Object.keys(req.session.answers).length > 3) {
    res.render('results', { question: dummy_question });
  } else {
    // Send the first one, just for testing
    res.render('question', { question: questions[0] });
  }
});

module.exports = router;
