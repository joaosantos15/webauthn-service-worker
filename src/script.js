document.getElementById('clickMe').onclick = handleWebAuthn
document.getElementById('loginbutton').onclick = handleLogin
const utils = require('./webauthn/utils')
console.log('NONce: ' + 26)

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
  // let username = this.username.value

  if (!username) {
    alert('Username is missing!')
    return
  }

  getGetAssertionChallenge({username})
        .then((response) => {
          console.log('Login 1st response')
          console.log(response)
          let publicKey = utils.preformatGetAssertReq(response)
        //   publicKey.rp = {}
        //   publicKey.rp.id = 'localhost'

          console.log('Login public key')
          console.log(publicKey)

          return navigator.credentials.get({ publicKey })
        })
        .then((response) => {
          console.log('Loaded credential...')
          console.log(response)
          let getAssertionResponse = utils.publicKeyCredentialToJSON(response)
          getAssertionResponse.username = username
          console.log('getAssertionResponse')
          console.log(getAssertionResponse)
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
