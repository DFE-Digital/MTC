const uuidV4 = require('uuid/v4')

const QuestionService = require('../lib/question-service')
const GoogleSheetService = require('../lib/google-sheet-service')
const Feedback = require('../models/feedback')
const Answer = require('../models/answer')
const Pupil = require('../models/pupil')
const Setting = require('../models/setting')
const config = require('../config')

const getStart = (req, res) => {
  res.locals.pageTitle = 'Multiplication Tables Check - start'
  res.render('check/start', { layout: 'question-layout' }) // Temp layout
}
const getConfirm = (req, res) => {
  res.locals.pageTitle = 'Multiplication tables check - confirmation'
  res.render('check/confirm', { layout: 'question-layout' }) // Temp layout
}
const getConnection = (req, res) => {
  res.locals.pageTitle = 'Multiplication tables check - setup'
  res.render('check/connection', { layout: 'question-layout' }) // Temp layout
}
const getQuestion = async (req, res, next) => {
  res.locals.pageTitle = 'Multiplication tables check - question'
  let num = parseInt(req.params.number, 10)

  if (isNaN(num)) {
    return next(new Error('Question not found'))
  }

  if (num === 1) {
    // First Question: create a new testId for this test
    req.session.testId = uuidV4()
    delete req.session.answer
    // Expire the pin on the first question
    try {
      const pupil = await Pupil.findOne({'_id': (((res || {}).req || {}).user || {})}).exec()
      if (!pupil.pinExpired) {
        pupil.pinExpired = true
        await pupil.save()
      }
    } catch (error) {
      return next(error)
    }
  }

  let loadingTime = config.TIME_BETWEEN_QUESTIONS
  let questionTimeLimit = config.QUESTION_TIME_LIMIT

  try {
    const timeSettings = await Setting.findOne().exec()
    if (timeSettings) {
      loadingTime = timeSettings.loadingTimeLimit
      questionTimeLimit = timeSettings.questionTimeLimit
    }
  } catch (error) {
    console.log('Custom time settings not found, default values used.')
  }

  let questionService = new QuestionService('sample-questions')
  let question = questionService.getQuestion(num)
  res.locals.loadingTime = loadingTime
  res.locals.questionTimeLimit = questionTimeLimit
  res.locals.factor1 = question[0]
  res.locals.factor2 = question[1]
  res.locals.expectedAnswer = question[2]
  res.locals.nextQuestion = questionService.getNextQuestionNumber(num)
  res.locals.num = num
  res.locals.answer = question[0] * question[1]
  res.locals.total = questionService.getNumberOfQuestions()

  res.render('check/question-virtual-keyboard', { layout: 'question-layout' })
}

const postQuestion = (req, res, next) => {
  let answer
  let num = parseInt(req.params.number, 10)
  let question
  let questionService
  let nextQuestion
  let redirectUrl

  if (isNaN(num)) {
    return next(new Error('Question not found'))
  }

  if (!req.session.testId) {
    return next(new Error('Missing testId'))
  }

  questionService = new QuestionService('sample-questions')
  question = questionService.getQuestion(num)

  if (!req.session.answer) {
    // Save the answer
    answer = new Answer()
    answer.sessionId = req.session.id
    answer.testId = req.session.testId
    answer.logonEvent = req.session.logonEvent._id
    answer.pupil = req.user._id
    answer.school = req.user.school._id
    const registeredInputs = JSON.parse(req.body['registered-inputs']).map((r) => JSON.parse(r))
    answer.isElectron = !!req.body['electron']
    answer.answers = [{
      pageLoadDate: req.body.pageLoadDate,
      answerDate: Date.now(),
      factor1: question[0],
      factor2: question[1],
      input: req.body.answer,
      registeredInputs
    }]
  } else {
    answer = new Answer(req.session.answer)
    answer.sessionId = req.session.id
    answer.testId = req.session.testId
    const registeredInputs = JSON.parse(req.body['registered-inputs']).map((r) => JSON.parse(r))
    answer.answers.push({
      pageLoadDate: req.body.pageLoadDate,
      answerDate: Date.now(),
      factor1: question[0],
      factor2: question[1],
      input: req.body.answer,
      registeredInputs
    })
  }

  req.session.answer = answer.toPojo()

  // This is debug, but useful for now.
  // TODO: change to use logger and DEBUG level
  // let correctAnswer = question[0] * question[1]
  // if (correctAnswer === (req.body.answer * 1)) {
  //   console.log(`Correct: ${question[0]} * ${question[1]} = ${correctAnswer}`)
  // } else {
  //   console.log(`Incorrect: ${question[0]} * ${question[1]} = ${correctAnswer} (got ${req.body.answer})`)
  // }

  nextQuestion = questionService.getNextQuestionNumber(num)
  if (!nextQuestion) {
    redirectUrl = '/check/complete'
  } else {
    redirectUrl = '/check/question/' + nextQuestion
  }

  // Mark the form if this is the answer to the last question.
  if (answer.answers.length === questionService.getNumberOfQuestions()) {
    answer.markResults()
  }

  answer.save((err) => {
    if (err) {
      return next(new Error('Failed to save answer: ' + err.message))
    }
  })

  res.redirect(redirectUrl)
}

const getComplete = async (req, res, next) => {
  res.locals.pageTitle = 'Multiplication tables check - complete'
  // Clean up session vars from the check
  delete req.session.testId
  delete req.session.answer
  // Save test end time
  try {
    const pupil = await Pupil.findOne({ '_id': (((res || {}).req || {}).user || {})._id || {} }).exec()
    pupil.checkEndDate = Date.now()
    await pupil.save()
  } catch (error) {
    return next(error)
  }
  res.render('check/complete', { layout: 'question-layout' }) // Temp layout
}

const getFeedback = (req, res) => {
  res.locals.pageTitle = 'Multiplication tables check - give feedback'
  res.render(
    'check/feedback',
    {
      error: {},
      form: {},
      layout: 'question-layout' // Temp layout
    })
}

const postFeedback = async (req, res, next) => {
  let feedback = new Feedback()
  let error

  feedback.comment = req.body.comment
  feedback.inputType = req.body['input-type']
  feedback.satisfactionRating = req.body['satisfaction-group']
  feedback.sessionId = req.session.id
  error = feedback.validateSync()

  if (error) {
    res.locals.pageTitle = 'Multiplication tables check - give feedback'
    res.render(
      'check/feedback',
      {
        error: error || {},
        form: req.body,
        layout: 'question-layout' // Temp layout
      })
  } else {
    try {
      const feedbackExists = await Feedback.findOne({ 'sessionId': feedback.sessionId }).exec()
      if (!feedbackExists) {
        feedback.save((err) => {
          if (err) {
            return next(err)
          }
          res.redirect('/check/feedback-thanks')
        })

        // Insert into Google Sheet
        let schoolName = ''
        if ((((res || {}).req || {}).user || {}).school) {
          schoolName = res.req.user.school.name
        }

        const googleSheetData = {
          'Timestamp': feedback.creationDate,
          'School Name': schoolName,
          'Satisfaction Rating': feedback.satisfactionRating,
          'Input Type': feedback.inputType,
          'Comment': feedback.comment || ''
        }
        GoogleSheetService.addFeedback(googleSheetData)
      } else {
        res.redirect('/check/feedback-sent')
      }
    } catch (error) {
      return next(error)
    }
  }
}

const getFeedbackThanks = (req, res) => {
  res.locals.pageTitle = 'Multiplication tables check - thank you for your feedback'
  res.render('check/feedback-thanks', { layout: 'question-layout' }) // Temp layout
}
const getFeedbackSent = (req, res) => {
  res.locals.pageTitle = 'Multiplication tables check - feedback already received'
  res.render('check/feedback-sent', { layout: 'question-layout' }) // Temp layout
}
const getSignInSuccess = async (req, res) => {
  if (((res || {}).req || {}).user) {
    const pupil = ((res || {}).req || {}).user

    if (pupil.foreName.length < 1 || pupil.lastName.length < 1 || pupil.school.name < 1) {
      res.redirect('/')
    } else {
      res.locals.foreName = pupil.foreName
      res.locals.lastName = pupil.lastName
      res.locals.school = pupil.school.name
      res.locals.pageTitle = 'Multiplication tables check - Welcome'
      res.render('sign-in-success-5pin', { layout: 'question-layout' }) // Temp layout
    }
  } else {
    res.redirect('/')
  }
}

const postStartCheck = async (req, res, next) => {
  try {
    const pupil = await Pupil.findOne({ '_id': (((res || {}).req || {}).user || {})._id || {} }).exec()
    pupil.checkStartDate = Date.now()
    await pupil.save()
  } catch (error) {
    return next(error)
  }
  res.redirect('/check/question/1')
}

module.exports = {
  getStart,
  getConfirm,
  getConnection,
  getQuestion,
  postQuestion,
  getComplete,
  getFeedback,
  postFeedback,
  getFeedbackThanks,
  getFeedbackSent,
  getSignInSuccess,
  postStartCheck
}
