document.getElementById('clickMe').onclick = function () { console.log('hehehe') }
const utils = require('./webauthn/utils')

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

var p = document.createElement('p')
p.textContent = 'This content was added via JavaScript!'
document.body.appendChild(p)

let username = 'joaousername'
let name = 'joao'

if (!username || !name) {
  alert('Name or username is missing!')
}

getMakeCredentialsChallenge({username, name}).then(
     (response) => {
       console.log('SW response: ' + JSON.stringify(response))

       let publicKey = utils.preformatMakeCredReq(response)
       console.log('PUBLIC LEY: ' + JSON.stringify(publicKey))
       console.log('Creating credential...')
       return navigator.credentials.create({publicKey})
     }).then(resp => {
       console.log('Public key credential created')
       console.log(resp)
     }).catch((error) => console.error(error.message))
