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
