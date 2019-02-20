import { Socket } from 'phoenix'

class PlayerClient {
  constructor(scene) {
    this.socket = new Socket("ws:localhost:4000/socket", {
      params: {
        token: window.userToken
      }
    })
    this.socket.connect()
    this.scene = scene

    // TODO: Move somewhere else probably
    const urlParams = new URLSearchParams(window.location.search)
    const playerId = urlParams.get('player_id')
    const gameId = urlParams.get('game_id') || "game_1"

    const x = Math.floor(Math.random() * 400) + 50
    const y = 0
    this.channel = this.socket.channel("game:lobby",
      {player_id: playerId, x, y, game_id: gameId})

    this.channel.join().receive("ok", resp => {
      console.log("Joined successfully", resp)
    }).receive("error", resp => {
      console.log("Unable to join", resp)
    })

    this.channel.on("player_joined", payload => {
      console.log("New player online:", payload)
      this.scene.addPlayer(payload)
    })

    this.channel.on("player_left", payload => {
      console.log("A player has left:", payload)
      this.scene.removePlayer(payload.id)
    })
  }
}

export default PlayerClient
