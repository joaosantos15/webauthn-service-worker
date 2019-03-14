'use strict'
import utils from './utils'

let getMakeCredentialsChallenge = (formBody) => {
  return window.fetch('/webauthn/register', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formBody)
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.status !== 'ok') { throw new Error(`Server responed with error. The message is: ${response.message}`) }

      return response
    })
}

let sendWebAuthnResponse = (body) => {
  return window.fetch('/webauthn/response', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.status !== 'ok') { throw new Error(`Server responed with error. The message is: ${response.message}`) }

      return response
    })
}

/* Handle for register form submission */
$('#register').submit(function (event) {
  event.preventDefault()

  let username = this.username.value
  let name = this.name.value

  if (!username || !name) {
    window.alert('Name or username is missing!')
    return
  }

  getMakeCredentialsChallenge({username, name})
        .then((response) => {
          console.log('RES: \n' + JSON.stringify(response))
          let publicKey = utils.preformatMakeCredReq(response)
          console.log('PUB: \n' + JSON.stringify(publicKey))
          return navigator.credentials.create({ publicKey })
        })
        .then((response) => {
          console.log('RESPONDE: ' + JSON.stringify(response))
          let makeCredResponse = utils.publicKeyCredentialToJSON(response)
          console.log('makeCredResponse: ' + JSON.stringify(makeCredResponse))
          return sendWebAuthnResponse(makeCredResponse)
        })
        .then((response) => {
          if (response.status === 'ok') {
            loadMainContainer()
          } else {
            window.alert(`Server responed with error. The message is: ${response.message}`)
          }
        })
        .catch((error) => window.alert(error))
})

let getGetAssertionChallenge = (formBody) => {
  return window.fetch('/webauthn/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formBody)
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.status !== 'ok') { throw new Error(`Server responed with error. The message is: ${response.message}`) }

      return response
    })
}

/* Handle for login form submission */
$('#login').submit(function (event) {
  event.preventDefault()

  let username = this.username.value

  if (!username) {
    window.alert('Username is missing!')
    return
  }

  getGetAssertionChallenge({username})
        .then((response) => {
          console.log(response)
          let publicKey = utils.preformatGetAssertReq(response)
          return navigator.credentials.get({ publicKey })
        })
        .then((response) => {
          let getAssertionResponse = utils.publicKeyCredentialToJSON(response)
          return sendWebAuthnResponse(getAssertionResponse)
        })
        .then((response) => {
          if (response.status === 'ok') {
            loadMainContainer()
          } else {
            window.alert(`Server responed with error. The message is: ${response.message}`)
          }
        })
        .catch((error) => window.alert(error))
})