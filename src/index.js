import Phaser from 'phaser'

import Client from './client'
import PlainBullet from './plain_bullet'


const gameWidth = 500
const gameHeight = 300

class LiveGameScene extends Phaser.Scene {
  constructor() {
    super({key: 'LiveGameScene', active: true})
  }

  init() {
    this.client = new Client()
    this.cameras.main.roundPixels = true
    this.cameras.main.setBounds(0, 0, gameWidth, gameHeight)
  }

  preload() {
    this.load.image('tank', '../assets/tank.png')
    this.load.image('ground', '../assets/ground.png')
    this.load.image('bullet', '../assets/bullet.png')
  }

  create() {
    const groundGroup = this.physics.add.staticGroup()
    groundGroup.create(20, 100, 'ground').refreshBody()
    groundGroup.create(50, 100, 'ground').refreshBody()
    groundGroup.create(80, 100, 'ground').refreshBody()
    groundGroup.create(110, 100, 'ground').refreshBody()
    groundGroup.create(140, 130, 'ground').refreshBody()
    groundGroup.create(170, 130, 'ground').refreshBody()
    groundGroup.create(210, 140, 'ground').refreshBody()

    this.tank = this.physics.add.sprite(10, 10, 'tank')
    this.tank.setCollideWorldBounds(true)
    this.tank.setBounce(0.2)
    this.physics.add.collider(this.tank, groundGroup)

    this.bullets = this.add.group({classType: PlainBullet, maxSize: 1, runChildUpdate: true})

    this.cursors = this.input.keyboard.createCursorKeys()
    this.fireButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.fireButton.addListener('down', this.fire, this)

  }

  update() {
    if (this.cursors.left.isDown) {
      this.tank.setVelocityX(-60);
      this.tank.setAngle(-1)
    } else if (this.cursors.right.isDown) {
      this.tank.setVelocityX(60);
      this.tank.setAngle(1)
    } else {
      this.tank.setVelocityX(0);
    }
  }

  fire() {
    this.client.fire(
      this.tank.x,
      this.tank.y,
      this.tank.body.rotation,
      result => {
        let bullet = this.bullets.get()
        if (bullet) {
          bullet.fire(this.tank.x, this.tank.y, this.tank.body.rotation)
        }
        if (result.permitted === true) {
          console.log('Bang!')
        } else {
          console.log('It\'s not your turn...')
        }
    })
  }
}

const config = {
  type: Phaser.AUTO,
  width: gameWidth,
  height: gameHeight,
  parent: 'game-container',
  scene: [LiveGameScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 200},
      debug: true
    }
  }
}

const game = new Phaser.Game(config)
