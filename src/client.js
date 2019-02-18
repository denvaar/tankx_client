import { Socket } from 'phoenix'

class Client {
  constructor() {
    this.socket = new Socket("ws:localhost:4000/socket", {
      params: {
        token: window.userToken
      }
    })
    this.socket.connect()

    const urlParams = new URLSearchParams(window.location.search)
    const playerId = urlParams.get('player_id')
    const gameId = urlParams.get('game_id') || "game_1"

    this.channel = this.socket.channel("game:lobby", {player_id: playerId, game_id: gameId})

    this.channel.on("player_joined", payload => {
      console.log("New player online:", payload)
    })

    this.channel.on("player_left", payload => {
      console.log("A player has left:", payload)
    })

    this.channel.on("player_moved", payload => {
      console.log("A player moved:", payload)
    })

    this.channel.on("fire", payload => {
      this.fireAction(payload);
      this.fireAction = null
    })

    this.channel.join()
      .receive("ok", resp => {
        console.log("Joined successfully", resp)
      })
      .receive("error", resp => { console.log("Unable to join", resp) })
  }

  fire(fireAction) {
    this.channel.push("fire", {})
    this.fireAction = fireAction
  }
}

export default Client
