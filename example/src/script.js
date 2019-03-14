const utils = require('./client-webauthn/utils')

let username
document.getElementById('clickMe').onclick = handleWebAuthn
document.getElementById('loginbutton').onclick = handleLogin

let sendWebAuthnResponse = (body) => {
  return fetch('/webauthn/response', {
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

let getMakeCredentialsChallenge = (formBody) => {
  return fetch('/webauthn/register', {
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

  return response.body
}).catch(error => {
  console.error(error)
})
}

let getGetAssertionChallenge = ({username}) => {
  return fetch('/webauthn/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username})
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.status !== 'ok') { throw new Error(`Server responed with error. The message is: ${response.message}`) }

      return response
    })
}

function handleWebAuthn () {
  var p = document.createElement('p')
  p.textContent = 'This content was added via JavaScript!'
  document.body.appendChild(p)

  username = 'joaousername'
  let name = 'joao'

  let secret = prompt('Select password')

  if (!username || !name) {
    alert('Name or username is missing!')
  }

  getMakeCredentialsChallenge({username, name, secret}).then(
           (response) => {
             let publicKey = utils.preformatMakeCredReq(response)
             return navigator.credentials.create({publicKey})
           }).then(response => {
             let makeCredResponse = utils.publicKeyCredentialToJSON(response)
             makeCredResponse.username = username
             return sendWebAuthnResponse(makeCredResponse)
           }).then(console.log).catch((error) => console.error(error.message))
}

function handleLogin () {
  // let username = this.username.value

  if (!username) {
    alert('Username is missing!')
    return
  }

  getGetAssertionChallenge({username})
        .then((response) => {
          let publicKey = utils.preformatGetAssertReq(response)
        //   publicKey.rp = {}
        //   publicKey.rp.id = 'localhost'

          return navigator.credentials.get({ publicKey })
        })
        .then((response) => {
          let getAssertionResponse = utils.publicKeyCredentialToJSON(response)
          getAssertionResponse.username = username
          return sendWebAuthnResponse(getAssertionResponse)
        })
        .then((response) => {
          if (response.status === 'ok') {
            alert('You are LOGGED IN!! 🚀🚀')
          } else {
            alert(`Server responed with error. The message is: ${response.message}`)
          }
        })
        .catch((error) => alert(error))
}
