const config = require('../config')
const passport = require('passport')
const url = require('url')

const home = (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 'TEACHER' || req.user.role === 'HEADTEACHER') {
      return res.redirect('/school/school-home')
    } else {
      return res.redirect('/school/school-home')
    }
  } else {
    res.redirect('/sign-in')
  }
}

const getSignIn = (req, res) => {
  res.locals.pageTitle = 'Check Development - Login'
  if (req.isAuthenticated()) {
    res.redirect('/school/school-home')
  } else {
    if (config.NCA_TOOLS_AUTH_URL) {
      res.redirect(config.NCA_TOOLS_AUTH_URL)
    } else {
      res.render('sign-in')
    }
  }
}

const postSignIn = (req, res) => {
  if (req.user.role === 'TEACHER' || req.user.role === 'HEADTEACHER') {
    return res.redirect('/school/school-home')
  }
  // There is no landing page for Test Developers yet.
  res.redirect('/school/school-home')
}

const getSignOut = (req, res) => {
  console.log(passport)
  if (req.user.id_token) {
    let id_token = req.user.id_token
    let issuer = passport._strategies['oidc']._issuer
    const return_url = `${req.protocol}://${req.get('host')}${req.baseUrl}`
    req.logout()
    res.redirect(url.format(Object.assign(url.parse(issuer.end_session_endpoint), {
      search: null,
      query: {
        id_token_hint: id_token,
        post_logout_redirect_uri: return_url
      }
    })))
  } else {
    req.logout()
    req.session.regenerate(function () {
      // session has been regenerated

      res.redirect('/')
    })
  }
}

const getSignInFailure = (req, res) => {
  res.locals.pageTitle = 'Check Development App - Sign-in error'
  res.render('sign-in-failure')
}

const getProfile = (req, res) => {
  res.locals.pageTitle = 'Check Development - Profile'
  res.render('profile')
}
const postAuth = (req, res) => {
  // Please leave this in until we are confident we have identified all the NCA Tools roles.
  console.log(req.user)
  // Schools roles should redirect to school-home:
  // no mapping provided yet.
  return res.redirect('/school/school-home')
}

module.exports = {
  home,
  getSignIn,
  postSignIn,
  getSignOut,
  getSignInFailure,
  getProfile,
  postAuth
}
