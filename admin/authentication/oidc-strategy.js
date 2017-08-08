'use strict'

const bcrypt = require('bcrypt')
const User = require('../models/user')
const AdminLogonEvent = require('../models/admin-logon-event')

module.exports =  (tokenset, userinfo, done) => {
  console.log('tokenset', tokenset)
  console.log('access_token', tokenset.access_token)
  console.log('id_token', tokenset.id_token)
  console.log('claims', tokenset.claims)
  console.log('userinfo', userinfo)

  return User.findOne({ email: tokenset.claims.mtc_id }, function (err, user) {
    if (err) return done(err)
    const mock = {
      EmailAddress: tokenset.claims.email,
      UserName: tokenset.claims.email,
      UserType: 'SchoolNom',
      School: user.school,
      role: user.role,
      logonAt: Date.now()
    }
    // await saveValidLogonEvent(logonEvent, mock)
    return done(null, mock)
  })
}
