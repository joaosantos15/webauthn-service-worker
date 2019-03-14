const {RegisterHandler} = require('./handlers/register')
const {ResponseHandler} = require('./handlers/response')
const {LoginHandler} = require('./handlers/login')

const utils = require('./lib/utils')
const {IdbKeyVal} = require('./lib/idbKeyVal')
const {UserManager} = require('./lib/userManager')

const idbKeyval = new IdbKeyVal()
const userManager = new UserManager(idbKeyval)
const registerHandler = new RegisterHandler(idbKeyval, utils, userManager)
const loginHandler = new LoginHandler(idbKeyval, utils, userManager)
const responseHandler = new ResponseHandler(idbKeyval, utils, userManager)

self.addEventListener('install', function (event) {
})

self.addEventListener('fetch', function (event) {
  console.log('New versio')
  if (event.request.url.includes('/webauthn/response')) {
    console.log('Found /webauthn/response')

    // let challengeMakeCred = utils.generateServerMakeCredRequest('username', 'name', utils.randomBase64URLBuffer())
    console.log('response nonce: ' + 26)
    event.respondWith(responseHandler.handle(event))
  }

  if (event.request.url.includes('/webauthn/register')) {
    console.log('Found webauthn/register' + 23)

    event.respondWith(registerHandler.handle(event))
  }

  if (event.request.url.includes('/webauthn/login')) {
    event.respondWith(loginHandler.handle(event))
  }
})
