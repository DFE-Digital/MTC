/* global browser */

const {defineSupportCode} = require('cucumber')
const protractor = require('protractor')
const EC = protractor.ExpectedConditions

function CustomWorld ({attach, parameters}) {
  this.signIn = require('../../page_objects/admin/signInPage')
  this.landingPage = require('../../page_objects/admin/landingPage')
  this.signInFailure = require('../../page_objects/admin/signInFailure')
  this.administratorPage = require('../../page_objects/admin/administratorPage')
  this.checkSettingsPage = require('../../page_objects/admin/checkSettingsPage')
  this.config = require('../../data/config.json')[browser.params.testEnv]
  this.checkSignInPage = require('../../page_objects/check/CheckSignInPage')
  this.attach = attach
  this.parameters = parameters
  this.mongo = require('../../lib/mongoDbHelper')
  this.warmUp = require('../../page_objects/check/warmUpPage')
  this.confirmationPage = require('../../page_objects/check/confirmationPage')
  this.startPage = require('../../page_objects/check/startPage')
  this.checkPage = require('../../page_objects/check/checkPage')


  this.waitForVisibility = function (element, timeOut = 5000) {
    browser.wait(EC.visibilityOf(element), timeOut)
  }
  this.waitForInVisibility = function (element, timeOut = 5000) {
    browser.wait(EC.invisibilityOf(element), timeOut)
  }
}

defineSupportCode(function ({setWorldConstructor}) {
  setWorldConstructor(CustomWorld)
})
