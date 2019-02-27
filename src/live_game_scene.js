import Phaser from 'phaser'

import { gameWidth, gameHeight } from './config'
import PlayerClient from './player_client'


class LiveGameScene extends Phaser.Scene {
  constructor() {
    super({key: 'LiveGameScene', active: true})
  }

  init() {
    this.cameras.main.roundPixels = true
    this.cameras.main.setBounds(0, 0, gameWidth, gameHeight)
    this.cameras.main.setBackgroundColor('rgba(232, 232, 232, 1)')
  }

  preload() {
    this.load.image('ground', '../assets/ground.png')
    this.load.image('bullet', '../assets/bullet.png')
    this.load.image('barrel', '../assets/barrel.png')
    this.load.spritesheet('tank', '../assets/blue-tank.png', { frameWidth: 32, frameHeight: 20 })
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

    this.anims.create({
      key: 'horiz',
      frames: this.anims.generateFrameNumbers('tank', { start: 1, end: 4 }),
      frameRate: 10
    })

    this.client = new PlayerClient(this)
    this.cursors = this.input.keyboard.createCursorKeys()

    this.input.keyboard.on('keydown-SPACE',  () => { this.fireShot({ x: this.barrel.x, y: this.barrel.y }) }, this)
    // this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).addListener('keydown', () => { this.fireShot({ x: this.barrel.x, y: this.barrel.y }) }, this)
    this.bullet = this.physics.add.sprite(0, 0, 'bullet')
  }

  update() {
    if (this.barrel) {
      this.barrel.setPosition(this.player.x, this.player.y - 2)
    }
    if (this.cursors.left.isDown) {
      this.client.trackMove(this.player.x, this.player.y)
      this.player.setVelocityX(-60);
      this.player.setAngle(-1)
      this.player.flipX = true
      this.player.anims.play('horiz', true);

      if (!this.barrel.flipX) {
        this.barrel.flipX = true
        this.barrel.angle = 360 - this.barrel.angle
      }
    } else if (this.cursors.right.isDown) {
      this.client.trackMove(this.player.x, this.player.y)
      this.player.setVelocityX(60);
      this.player.setAngle(1)
      this.player.flipX = false
      this.player.anims.play('horiz', true);

      if (this.barrel.flipX) {
        this.barrel.flipX = false
        this.barrel.angle = 360 - this.barrel.angle
      }
    } else {
      if (this.player) {
        this.player.setVelocityX(0);
      }
    }

    if (this.cursors.up.isDown) {
      this.barrel.angle--;
    }
    if (this.cursors.down.isDown) {
      this.barrel.angle++;
    }
  }

  addPlayer({x, y, id}, clientPlayerId) {
    const player = this.physics.add.sprite(x, y, 'tank')
    this.barrel = this.physics.add.sprite(x, y - 2, 'barrel')
    this.barrel.setOrigin(0, 1)
    this.players[id] = player
    this.physics.add.collider(player, this.groundGroup)
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

  fireShot({x, y}) {
    this.bullet.setPosition(this.barrel.x, this.barrel.y)
    this.physics.velocityFromRotation(this.barrel.rotation, 200, this.bullet.body.velocity)
  }
}

export default LiveGameScene
