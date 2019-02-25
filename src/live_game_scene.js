import Phaser from 'phaser'

import PlayerClient from './player_client'

const gameWidth = 500
const gameHeight = 300

class LiveGameScene extends Phaser.Scene {
  constructor() {
    super({key: 'LiveGameScene', active: true})
  }

  init() {
    this.cameras.main.roundPixels = true
    this.cameras.main.setBounds(0, 0, gameWidth, gameHeight)
  }

  preload() {
    this.load.image('tank', '../assets/tank.png')
    this.load.image('ground', '../assets/ground.png')
  }

  create() {
    this.players = {}

    this.groundGroup = this.physics.add.staticGroup()
    this.groundGroup.create(20, 100, 'ground')
    this.groundGroup.create(50, 100, 'ground')
    this.groundGroup.create(80, 100, 'ground')
    this.groundGroup.create(110, 100, 'ground')
    this.groundGroup.create(140, 130, 'ground')
    this.groundGroup.create(170, 130, 'ground')
    this.groundGroup.create(210, 140, 'ground')

    this.client = new PlayerClient(this)
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  update() {
    if (this.cursors.left.isDown) {
      this.client.trackMove(this.player.x, this.player.y)
      this.player.setVelocityX(-60);
      this.player.setAngle(-1)
    } else if (this.cursors.right.isDown) {
      this.client.trackMove(this.player.x, this.player.y)
      this.player.setVelocityX(60);
      this.player.setAngle(1)
    } else {
      if (this.player) {
        this.player.setVelocityX(0);
      }
    }
  }

  addPlayer({x, y, id}, clientPlayerId) {
    const player = this.physics.add.sprite(x, y, 'tank')
    this.physics.add.collider(player, this.groundGroup)
    this.players[id] = player
    player.playerId = id
    player.setCollideWorldBounds(true)
    player.setBounce(0.2)

    if (id === clientPlayerId) {
      this.player = player
    }
  }

  removePlayer(id) {
    this.players[id].destroy()
    delete this.players[id]
  }

  movePlayer({id, x, y}) {
    const player = this.players[id]
    if (player) {
      player.setPosition(x, y)
    } else {
      console.error('Unable to find player!')
    }
  }
}

export default LiveGameScene
