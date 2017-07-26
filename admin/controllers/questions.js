const CheckForm = require('../models/check-form')
const Pupil = require('../models/pupil')
const School = require('../models/school')
const { QUESTION_TIME_LIMIT, TIME_BETWEEN_QUESTIONS } = require('../config')

/**
 * Returns the set of questions, pupil details and school details in json format
 * @param req
 * @param res
 * @returns { object }
 */

const getQuestions = async (req, res) => {
  const { pupilId, schoolId } = req.body
  if (!pupilId || !schoolId) res.status(400).send('invalid input')
  let checkForm, pupil, school
  try {
    checkForm = await CheckForm.findOne({}).sort({createdAt: -1}).lean().exec()
    pupil = await Pupil.findOne({ '_id': pupilId }).lean().exec()
    school = await School.findOne({_id: schoolId}).lean().exec()
  } catch (error) {
    throw new Error(error)
  }
  if (!checkForm) res.status(404).send('Question set not found for pupil')
  if (!pupil) res.status(404).send('Pupil not found')
  if (!school) res.status(404).send('School not found')
  let { questions } = checkForm
  questions = questions.map((q, i) => { return { order: ++i, factor1: q.f1, factor2: q.f2 } })
  pupil = {
    firstName: pupil.foreName,
    lastName: pupil.lastName,
    sessionId: req.session.id,
    questionTime: QUESTION_TIME_LIMIT,
    loadingTime: TIME_BETWEEN_QUESTIONS
  }
  school = { id: school._id, name: school.name }
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify({
    questions,
    pupil,
    school
  }))
}

module.exports = {
  getQuestions
}