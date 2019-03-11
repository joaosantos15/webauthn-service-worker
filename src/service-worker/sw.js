// Chrome's currently missing some useful cache methods,
// this polyfill adds them.
// importScripts('serviceworker-cache-polyfill.js')

// Here comes the install event!
// This only happens once, when the browser sees this
// version of the ServiceWorker for the first time.
const utils = require('./utils')

self.addEventListener('install', function (event) {
  // We pass a promise to event.waitUntil to signal how
  // long install takes, and if it failed
})

// The fetch event happens for the page request with the
// ServiceWorker's scope, and any request made within that
// page
self.addEventListener('fetch', function (event) {
  // Calling event.respondWith means we're in charge
  // of providing the response. We pass in a promise
  // that resolves with a response object
  console.log('Req: ' + event.request.url)

  if (event.request.url.includes('/webauthn/register')) {
    console.log('Found webauthn/register')
    let challengeMakeCred = utils.generateServerMakeCredRequest('username', 'name', utils.randomBase64URLBuffer())

    event.respondWith(new Response(JSON.stringify({status: 'ok', body: challengeMakeCred})))
  }
})
