class UserManager {
  constructor (_idbKeyval) {
    this.idbKeyval = _idbKeyval
  }

  async getUserCurrentChallenge (username) {
    console.log('Getting challenge for: ' + username)
    const registeredUser = await this.idbKeyval.get(username)

    if (!registeredUser.pendingChallenge.status) {
      return registeredUser.pendingChallenge.challenge
    } else {
      return false
    }
  }

  async completeUserRegistration (username, authenticator) {
    let registeredUser = await this.idbKeyval.get(username)
    const currentAuthenticators = registeredUser.authenticators ? registeredUser.authenticators : []
    const newAuthenticators = currentAuthenticators.concat(authenticator)
    registeredUser.authenticators = newAuthenticators
    registeredUser.registered = true
    await this.idbKeyval.set(username, registeredUser)
    console.log('User status: ')
    console.log(registeredUser)
  }

  async getUser (username) {
    let registeredUser = await this.idbKeyval.get(username)
    return registeredUser.registered ? registeredUser : false
  }

  async getUserAuthenticators (username) {
    const user = await this.getUser(username)
    return user.authenticators
  }

  async setUserCurrentChallenge (username, challenge) {
    console.log('Setting challenge for ' + username)
    console.log(challenge)
    const registeredUser = await this.idbKeyval.get(username)

    const pendingChallenge = {
      challenge: challenge,
      complete: false
    }

    registeredUser.pendingChallenge = pendingChallenge
    await this.idbKeyval.set(username, registeredUser)
    console.log('Challenge updated')
  }
}

module.exports.UserManager = UserManager
