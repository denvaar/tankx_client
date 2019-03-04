import Phaser from 'phaser'

import PlayerInfoScene from './player_info_scene'
import Bullet from './bullet'
import PlayerClient from './player_client'
import Tank from './tank'
import { gameWidth, gameHeight } from './config'


export default class TestGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TestGameScene', active: true })
  }

  init() {
    this.cameras.main.roundPixels = true
    this.cameras.main.setBounds(0, 0, gameWidth, gameHeight)
    this.cameras.main.setBackgroundColor('rgba(105, 105, 105, 1)')
  }

  preload() {
    this.load.image('barrel', '../assets/barrel.png')
    this.load.spritesheet('tank', '../assets/blue-tank.png', { frameWidth: 32, frameHeight: 20 })
  }

  create() {
    this.client = new PlayerClient(this)

    this.scene.bringToTop('PlayerInfoScene')
    this.scene.manager.getScene('PlayerInfoScene').setPlayerName(this.client.playerId)

    this.anims.create({
      key: 'horiz',
      frames: this.anims.generateFrameNumbers('tank', { start: 1, end: 4 }),
      frameRate: 10
    })

    this.otherPlayers = {}
  }

  update() {
    if (this.player) {
      this.player.update()
    }
    Object.values(this.otherPlayers).forEach(otherPlayer => {
      otherPlayer.update()
    })
  }

  bulletHitTank(bullet, tank, id) {
    console.log('boom!')
    bullet.destroy()
    this.player.client.explode(id)
  }

  movePlayer({id, x, y, velocity, barrel_rotation}) {
    const player = this.otherPlayers[id]
    if (player) {
      player.barrel.rotation = barrel_rotation
      player.flipX = velocity >= 0 ? false : true
      player.setPosition(x, y)
    } else {
      console.error('Unable to find player!')
    }
  }

  killPlayer({id}) {
    const explodingPlayer = this.otherPlayers[id]

    if (explodingPlayer) {
      this.otherPlayers[id].explode()
      delete this.otherPlayers[id]
      console.log(`player ${id} has been killed`)
    } else {
      console.log('you\'re dead')
      this.player.explode()
    }
  }

  addPlayer({x, y, id}, clientId) {
    if (clientId === id) {
      this.player = new Tank({ scene: this, x, y, key: 'tank' }, this.client)
    } else {
      const otherPlayer = new Tank({ scene: this, x, y, key: 'tank' }, null)
      this.physics.add.overlap(
        this.player.bulletGroup,
        otherPlayer,
        (bullet, tank) => this.bulletHitTank(bullet, tank, id),
        null,
        this
      )
      this.otherPlayers[id] = otherPlayer
    }
  }

  removePlayer(id) {
    this.otherPlayers[id].barrel.destroy()
    this.otherPlayers[id].destroy()
    delete this.otherPlayers[id]
  }

  fireShot({id, rotation, power, velocity}) {
    const player = this.otherPlayers[id]

    let offset = new Phaser.Geom.Point(player.barrel.x + 20, player.barrel.y)
    Phaser.Math.RotateAround(offset, player.barrel.x, player.barrel.y, player.barrel.rotation)
    const bullet = new Bullet({
      scene: this,
      x: offset.x,
      y: offset.y
    })
    this.cameras.main.shake(20, 0.005)
    this.physics.velocityFromRotation(player.barrel.rotation, power, bullet.body.velocity)
  }
}
