import { Socket } from 'phoenix'

class Client {
  constructor(scene) {
    this.socket = new Socket("ws:localhost:4000/socket", {
      params: {
        token: window.userToken
      }
    })
    this.socket.connect()

    this.scene = scene

    const urlParams = new URLSearchParams(window.location.search)
    const playerId = urlParams.get('player_id')
    const gameId = urlParams.get('game_id') || "game_1"

    const x = Math.floor(Math.random() * 400) + 50
    const y = 0 //Math.floor(Math.random() * 400) + 50
    this.channel = this.socket.channel("game:lobby", {player_id: playerId, x, y, game_id: gameId})

    this.channel.on("player_joined", payload => {
      console.log("New player online:", payload)
      this.scene.addOtherPlayer(payload)
    })

    this.channel.on("player_left", payload => {
      console.log("A player has left:", payload)
    })

    this.channel.on("player_moved", payload => {
      console.log("A player moved:", payload)
    })

    this.channel.on("fire", payload => {
      this.fireAction(payload)
      this.fireAction = null
    })

    this.channel.on("move", payload => {
      this.moveAction(payload)
      this.moveAction = null
    })

    this.channel.join()
      .receive("ok", resp => {
        console.log("Joined successfully", resp)
        this.scene.addPlayer(resp)
      })
      .receive("error", resp => { console.log("Unable to join", resp) })
  }

  fire(x, y, rotation, fireAction) {
    this.channel.push("fire", {x, y, rotation})
    this.fireAction = fireAction
  }

  move(x, y, moveAction) {
    this.channel.push("move", {x, y})
    this.moveAction = moveAction
  }
}

export default Client
