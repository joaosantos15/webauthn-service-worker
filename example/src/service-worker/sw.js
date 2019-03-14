// const {RegisterHandler} = require('./handlers/register')
// const {ResponseHandler} = require('./handlers/response')
// const {LoginHandler} = require('./handlers/login')

// const utils = require('./lib/utils')
// const {IdbKeyVal} = require('./lib/idbKeyVal')
// const {UserManager} = require('./lib/userManager')

// const idbKeyval = new IdbKeyVal()
// const userManager = new UserManager(idbKeyval)
// const registerHandler = new RegisterHandler(idbKeyval, utils, userManager)
// const loginHandler = new LoginHandler(idbKeyval, utils, userManager)
// const responseHandler = new ResponseHandler(idbKeyval, utils, userManager)

const webAuthnSw = require('../../../src/index')

self.addEventListener('install', function (event) {
})

self.addEventListener('fetch', function (event) {
  if (event.request.url.includes('/webauthn/response')) {
    event.respondWith(webAuthnSw.responseHandler.handle(event))
  }

  if (event.request.url.includes('/webauthn/register')) {
    event.respondWith(webAuthnSw.registerHandler.handle(event))
  }

  if (event.request.url.includes('/webauthn/login')) {
    event.respondWith(webAuthnSw.loginHandler.handle(event))
  }
})
