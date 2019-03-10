import Phaser from 'phaser'

import PlayerInfoScene from './player_info_scene'
import Bullet from './bullet'
import PlayerClient from './player_client'
import Tank from './tank'
import { gameWidth, gameHeight } from './config'


export default class TestGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TestGameScene', active: false })
  }

  init(data) {
    this.client = data.client
    this.player = data.player
    this.opponent = data.opponent

    // hacky...
    this.client.callbacks = {
      ...this.client.callbacks,
      movePlayer: this.movePlayer.bind(this),
      fireShot: this.fireShot.bind(this),
      killPlayer: this.killPlayer.bind(this)
    }

    this.scene.launch('PlayerInfoScene', {playerName: this.player.id})
    this.cameras.main.roundPixels = true
    this.cameras.main.setBounds(0, 0, gameWidth, gameHeight)
    this.cameras.main.setBackgroundColor('rgba(105, 105, 105, 1)')
  }

  preload() {
    this.load.image('barrel', '../assets/barrel.png')
    this.load.spritesheet('tank', '../assets/blue-tank.png', { frameWidth: 32, frameHeight: 20 })
    this.load.spritesheet('shot', '../assets/shot.png', { frameWidth: 30, frameHeight: 30 })
  }

  create() {
    this.scene.bringToTop('PlayerInfoScene')

    this.anims.create({
      key: 'horiz',
      frames: this.anims.generateFrameNumbers('tank', { start: 1, end: 4 }),
      frameRate: 10
    })

    const { x, y } = this.player
    this.player = new Tank({ scene: this, x, y, key: 'tank' }, this.client)

    this.otherPlayers = {}
    const otherPlayer = new Tank({ scene: this, x: this.opponent.x, y: this.opponent.y, key: 'tank' }, null)

    this.physics.add.overlap(
      this.player.bulletGroup,
      otherPlayer,
      (bullet, tank) => this.bulletHitTank(bullet, tank, this.opponent.id),
      null,
      this
    )
    this.otherPlayers[this.opponent.id] = otherPlayer
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

    this.scene.stop('PlayerInfoScene')
    if (explodingPlayer) {
      this.otherPlayers[id].explode()
      delete this.otherPlayers[id]
      this.scene.start('GameOverScene', {gameResult: 'win', player: id})
    } else {
      this.player.explode()
      this.scene.start('GameOverScene', {gameResult: 'loose', player: Object.keys(this.otherPlayers)[0]})
    }
  }

  // TODO: I think I need to use this
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
    player.shot.setPosition(offset.x, offset.y)
    player.shot.play('shot')
    player.shot.setVisible(true)
    this.cameras.main.shake(20, 0.005)
    this.physics.velocityFromRotation(player.barrel.rotation, power, bullet.body.velocity)
  }
}
