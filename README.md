**⚠️ This repo has been deprecated in favor of:**

* [webauthn-service-worker](https://github.com/joaosantos15/webauthn-sw)
* [webauthn-service-worker-client](https://github.com/joaosantos15/webauthn-ws-client)
* [webauthn-service-worker-example](https://github.com/joaosantos15/webauthn-sw-example)

## Usage

```js

// import the module
const webAuthnSw = require('../../../src/index')

self.addEventListener('install', function (event) {
})

// use the handlers to handle
// registration, login and response
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

```
