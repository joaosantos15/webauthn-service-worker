const {WebAuthnHandler} = require('../../src/client/webAuthnHandler')
const webAuthnHandler = new WebAuthnHandler()

document.getElementById('registerButton').onclick = handleRegistration
document.getElementById('loginButton').onclick = handleLogin

async function handleLogin () {
  let username = document.getElementById('username-input').value

  console.log('New login')

  if (!username) {
    alert('Username is missing!')
    return
  }
  const loginResult = await webAuthnHandler.handleLogin(username)

  if (loginResult.status === 'ok') {
    alert('You are LOGGED IN!! 🚀😅')
    return loginResult
  } else {
    throw new Error(`Server responed with error. The message is: ${loginResult.message}`)
  }
}

async function handleRegistration () {
  let username = document.getElementById('username-input').value
  let name = username

  let secret = prompt('Select password')

  if (!username || !name) {
    alert('Name or username is missing!')
  }

  let authState = await webAuthnHandler.handleRegistration(username, name, secret)
  console.log(authState)
}
