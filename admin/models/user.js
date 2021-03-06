'use strict'

const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const Schema = mongoose.Schema

const User = new Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  school: {
    type: Schema.Types.Number,
    required: false,
    ref: 'School'
  },
  role: {
    type: String,
    // TE - teacher, TD - test developer, HD - head teacher
    enum: ['TEACHER', 'TEST-DEVELOPER', 'ADMINISTRATOR'],
    required: true
  }
}, {timestamps: true})

module.exports = mongoose.model('User', User)
