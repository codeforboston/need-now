var express = require('express');
var router = express.Router();
var _ = require("underscore");

// Pre-load list of questions
var questions = require('../public/data/questions.json');

// Figure out which question comes next by comparing the answers hash stored
// in the session object and the list of questions. Return then first non-
// answered question or null if they all have responses recorded.
var nextQuestion = function(answers) {
  // If we have all the answers, return null
  if (answers && Object.keys(answers).length == questions.length) return null;

  // If no answers yet, return the first non-answered question and return it
  if (!answers || answers == {})
    return questions[0];

  // Otherwise, return the first non-answered question
  var unanswered = _.filter(questions, function(question) {
    return !_.contains(Object.keys(answers), String(question.id));
  });

  // Return first unanswered (or null if for some weird reason we got none
  if (unanswered.length > 0) return unanswered[0];
  return null;
}

/* GET questions page. */
router.get('/', function(req, res) {
  // Mocking answers, remove!!!
  req.session.answers = {
    '1': '1',
    '2': '2',
    '3': '3'
  }
  next = nextQuestion(req.session.answers);
  if (next == null) // No more questions, show providers
    res.redirect('/providers');
  else // Render next question
    res.render('question', { question: next });
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
  console.log('Questions so far:');
  console.log(req.session.answers);

  next = nextQuestion(req.session.answers);
  if (next == null) // No more questions, show providers
    res.redirect('/providers');
  else // Render next question
    res.render('question', { question: next });
});

module.exports = router;
