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
    this.playerGroup = this.physics.add.group()

    this.groundGroup = this.physics.add.staticGroup()
    this.groundGroup.create(20, 100, 'ground')
    this.groundGroup.create(50, 100, 'ground')
    this.groundGroup.create(80, 100, 'ground')
    this.groundGroup.create(110, 100, 'ground')
    this.groundGroup.create(140, 130, 'ground')
    this.groundGroup.create(170, 130, 'ground')
    this.groundGroup.create(210, 140, 'ground')

    this.client = new PlayerClient(this)
  }

  update() {}

  addPlayer({x, y, id}) {
    const player = this.physics.add.sprite(x, y, 'tank')
    this.playerGroup.add(player)
    this.physics.add.collider(player, this.groundGroup)
    player.playerId = id
    player.setCollideWorldBounds(true)
    player.setBounce(0.2)
  }

  removePlayer(id) {
    const player = this.playerGroup.getChildren().find(player => player.playerId === id)
    this.playerGroup.remove(player, true, true)
  }
}

export default LiveGameScene
