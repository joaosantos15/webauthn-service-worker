const utils = require('./utils')
let idb = require('idb')

const dbPromise = idb.openDb('keyval-store', 1, upgradeDB => {
  upgradeDB.createObjectStore('keyval')
})

const idbKeyval = {
  async get (key) {
    const db = await dbPromise
    return db.transaction('keyval').objectStore('keyval').get(key)
  },
  async set (key, val) {
    const db = await dbPromise
    const tx = db.transaction('keyval', 'readwrite')
    tx.objectStore('keyval').put(val, key)
    return tx.complete
  },
  async delete (key) {
    const db = await dbPromise
    const tx = db.transaction('keyval', 'readwrite')
    tx.objectStore('keyval').delete(key)
    return tx.complete
  },
  async clear () {
    const db = await dbPromise
    const tx = db.transaction('keyval', 'readwrite')
    tx.objectStore('keyval').clear()
    return tx.complete
  },
  async keys () {
    const db = await dbPromise
    return db.transaction('keyval').objectStore('keyval').getAllKeys(key)
  }
}

self.addEventListener('install', function (event) {
})

self.addEventListener('fetch', function (event) {
  if (event.request.url.includes('/webauthn/response')) {
    console.log('Found /webauthn/response')

    // let challengeMakeCred = utils.generateServerMakeCredRequest('username', 'name', utils.randomBase64URLBuffer())
    console.log('response nonce: ' + 23)
    event.respondWith(async function () {
      let response = {}
      const body = await event.request.json()
      console.log('/response received: ')
      console.log(JSON.stringify(body))
      if (!body || !body.id ||
        !body.rawId || !body.response ||
        !body.type || body.type !== 'public-key') {
        response = {
          'status': 'failed',
          'message': 'Response missing one or more of id/rawId/response/type fields, or type is not public-key!'
        }
        return new Response(JSON.stringify(response))
      }
      const username = body.username
      const clientData = utils.decodeClientData(body.response.clientDataJSON)
      console.log('Client data: ')
      console.log(clientData)

      console.log('Getting challenge')
      const pendingChallenge = await getUserCurrentChallenge(username)
      if (pendingChallenge !== clientData.challenge) {
        response = {
          'status': 'failed',
          'message': `Challenges don't match`
        }
        return new Response(JSON.stringify(response))
      }

      // add a check for origin ...

      if (body.response.attestationObject !== undefined) {
        const result = utils.verifyAuthenticatorAttestationResponse(body)
        console.log('Checking response...')
        console.log(result)

        if (result.verified) {
          await completeUserRegistration(username, result.authrInfo)
          // set session to logged in
          response = {'status': 'ok', 'message': 'user logged in'}
        } else {
          response = {
            'status': 'failed',
            'message': 'Can not authenticate signature!'
          }
        }
        return new Response(JSON.stringify(response))
      }

      response = {
        'status': 'failed',
        'message': 'attestationObject is not defined'
      }
      return new Response(JSON.stringify(response))
    }())
  }

  if (event.request.url.includes('/webauthn/register')) {
    console.log('Found webauthn/register' + 23)

    event.respondWith(async function () {
      let response = {}
      const body = await event.request.json()
      if (!body.name) {
        response = {
          'status': 'failed',
          'message': `No name provided`
        }
        return new Response(JSON.stringify(response))
      }

      if (!body.username) {
        response = {
          'status': 'failed',
          'message': `No username provided`
        }
        return new Response(JSON.stringify(response))
      }
      const username = body.username
      const name = body.name
      const user = await idbKeyval.get(username)
      console.log('Event')
      console.log(Object.keys(event))
      console.log(event)
      console.log('Received data: ')

      if (user !== undefined && user.registered) {
        response = {
          'status': 'failed',
          'message': `Username ${username} already exists`
        }
        return new Response(JSON.stringify(response))
      } else {
        const userId = utils.randomBase64URLBuffer()
        const newUser = {
          'name': name,
          'registered': false,
          'id': userId,
          'authenticators': []
        }

        await idbKeyval.set(username, newUser)
        const registeredUser = await idbKeyval.get(username)
        console.log('Registered new user: ' + JSON.stringify(registeredUser))
        let challengeMakeCred = utils.generateServerMakeCredRequest(userId, name, userId)
        await setUserCurrentChallenge(username, challengeMakeCred.challenge)
        return new Response(JSON.stringify({status: 'ok', body: challengeMakeCred}))
      }
    }())
  }

  async function setUserCurrentChallenge (username, challenge) {
    console.log('Setting challenge for ' + username)
    console.log(challenge)
    const registeredUser = await idbKeyval.get(username)

    const pendingChallenge = {
      challenge: challenge,
      complete: false
    }

    registeredUser.pendingChallenge = pendingChallenge
    await idbKeyval.set(username, registeredUser)
    console.log('Challenge updated')
  }

  async function getUserCurrentChallenge (username) {
    console.log('Getting challenge for: ' + username)
    const registeredUser = await idbKeyval.get(username)

    if (!registeredUser.pendingChallenge.status) {
      return registeredUser.pendingChallenge.challenge
    } else {
      return false
    }
  }

  async function completeUserRegistration (username, authenticator) {
    let registeredUser = await idbKeyval.get(username)
    const currentAuthenticators = registeredUser.authenticators ? registeredUser.authenticators : []
    const newAuthenticators = currentAuthenticators.concat(authenticator)
    registeredUser.authenticators = newAuthenticators
    registeredUser.registered = true
    await idbKeyval.set(username, registeredUser)
    console.log('User status: ')
    console.log(registeredUser)
  }

  if (event.request.url.includes('/webauthn/test')) {
    console.log('Found webauthn/test')
    console.log('noncez: ' + 8)
    // event.respondWith(new Response((() => { return 'Hello from your friendly neighbourhood service worker!' })()))
    event.respondWith(async function () {
      return new Response(JSON.stringify({status: 'ok', body: 'hello'}))
    }())
  }
})
