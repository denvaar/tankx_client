import { Socket } from 'phoenix'

import { serverHost, serverPort } from './config'


class PlayerClient {
  constructor({ callbacks, gameName }) {
    this.gameName = gameName
    this.callbacks = callbacks

    this.socket = new Socket(`ws:${serverHost}:${serverPort}/socket`, {
      params: {
        token: window.userToken
      }
    })
    this.socket.connect()

    this.channel = this.socket.channel(`game:tanks:play:${gameName}`, {})
    this.channel.join().receive("ok", resp => {
      console.log("Joined successfully", resp)
    }).receive("error", resp => {
      console.log("Unable to join", resp)
    })

    this.channel.on('list_players', payload => {
      this.callbacks.listPlayers(payload)
    })

    this.channel.on("player_joined", payload => {
      this.callbacks.addPlayer(payload)
    })

    this.channel.on("move", payload => {
      this.callbacks.movePlayer(payload)
    })

    this.channel.on("fire", payload => {
      this.callbacks.fireShot(payload)
    })

    this.channel.on("explode", payload => {
      this.callbacks.killPlayer(payload)
    })
  }

  listPlayers() {
    this.channel.push('list_players', {game_id: this.gameName})
  }

  addPlayer(playerName) {
    this.channel.push('add_player', {player_id: playerName})
  }

  trackMove(x, y, velocity, barrelRotation) {
    this.channel.push("move", {x, y, velocity, barrel_rotation: barrelRotation})
  }

  fire(rotation, power) {
    this.channel.push("fire", {rotation, power})
  }

  explode(playerId) {
    this.channel.push("explode", {player_id: playerId})
  }
}

export default PlayerClient
