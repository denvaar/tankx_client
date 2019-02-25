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

    this.channel = this.socket.channel(`game:tanks:play:${gameId}`,
      {player_id: playerId})

    this.channel.join().receive("ok", resp => {
      console.log("Joined successfully", resp)
    }).receive("error", resp => {
      console.log("Unable to join", resp)
    })

    this.channel.on("player_joined", payload => {
      console.log("New player online:", payload)
      this.scene.addPlayer(payload, playerId)
    })

    this.channel.on("player_left", payload => {
      console.log("A player has left:", payload)
      this.scene.removePlayer(payload.id)
    })

    this.channel.on("move", payload => {
      this.scene.movePlayer(payload)
    })
  }

  trackMove(x, y) {
    this.channel.push("move", {x, y})
  }
}

export default PlayerClient
