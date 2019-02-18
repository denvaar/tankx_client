import Client from './client'

const client = new Client()

document.getElementById("fire-btn").addEventListener("click", (event) => {
  client.fire(result => {
    if (result.permitted === true) {
      console.log('Bang!')
    } else {
      console.log('It\'s not your turn...')
    }
  })
})
