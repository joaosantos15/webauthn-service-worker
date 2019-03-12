document.getElementById('clickMe').onclick = handleWebAuthn
document.getElementById('clickMe2').onclick = handleTestClick
document.getElementById('loginbutton').onclick = handleLogin
const utils = require('./webauthn/utils')
console.log('NONce: ' + 14)

let username

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
  console.log('Server response ' + JSON.stringify(response))

  if (response.status !== 'ok') { throw new Error(`Server responed with error. The message is: ${response.message}`) }

  return response.body
}).catch(error => {
  console.error(error)
})
}

function handleWebAuthn () {
  var p = document.createElement('p')
  p.textContent = 'This content was added via JavaScript!'
  document.body.appendChild(p)

  username = 'joaousername'
  let name = 'joao'

  if (!username || !name) {
    alert('Name or username is missing!')
  }

  getMakeCredentialsChallenge({username, name}).then(
           (response) => {
             console.log('SW response: ' + JSON.stringify(response))

             let publicKey = utils.preformatMakeCredReq(response)
             console.log('PUBLIC KEY: ' + JSON.stringify(publicKey))
             console.log('Creating credential...')
             return navigator.credentials.create({publicKey})
           }).then(response => {
             console.log('Public key credential created')
             let makeCredResponse = utils.publicKeyCredentialToJSON(response)
             console.log('Adding username: ' + username)
             makeCredResponse.username = username
             console.log('Generating credentials json')
             console.log(makeCredResponse)
             return sendWebAuthnResponse(makeCredResponse)
           }).then(console.log).catch((error) => console.error(error.message))
}

function handleLogin () {
  return fetch('/webauthn/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({a: '1'})
  }).then(res => {
    console.log('RESPONSE: 2')
    console.log(res)
    console.log(res.json())
  })
}

function handleTestClick () {
  return fetch('/webauthn/test', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username: username})
  }).then(res => {
    console.log('RESPONSE: 2')
    console.log(res)
    console.log(res.json())
  })
}
