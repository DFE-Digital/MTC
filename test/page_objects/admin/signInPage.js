// Page class for SignIn page
/* global element by */

class SignInPage {
  constructor () {
    this.heading = element(by.css('.heading-xlarge'))
    this.instructions = element(by.css('p.lede'))
    this.usernameField = element(by.css('#username'))
    this.passwordField = element(by.css('#password'))
    this.signIn = element(by.css('input[value="Sign in"]'))
  }

  enterCredentials (username, password) {
    this.usernameField.sendKeys(username)
    this.passwordField.sendKeys(password)
  }

  login (username, password) {
    expect(this.usernameField.isPresent()).to.eventually.be.true
    this.enterCredentials(username, password)
    this.signIn.click()
  }
}

module.exports = new SignInPage()
