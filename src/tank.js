import Phaser from 'phaser'

import Bullet from './bullet'


const invertAngle = (angle) => {
  if (angle >= 0) {
    return Math.PI - angle
  } else {
    return -Math.PI - angle
  }
}

export default class Tank extends Phaser.GameObjects.Sprite {
  constructor(params, client) {
    super(params.scene, params.x, params.y, params.key, params.frame)

    this.client = client
    this.power = 0
    this.initImage()
    this.scene.add.existing(this)
    this.body.setCollideWorldBounds(true)

    this.shot = this.scene.add.sprite(10, 10, 'shot')
    this.scene.anims.create({
      key: 'shot',
      frames: this.scene.anims.generateFrameNumbers('shot', { start: 1, end: 4 }),
      hideOnComplete: true,
      frameRate: 20
    })
    this.shot.setVisible(false)
  }

  initImage() {
    this.setOrigin(0.5, 0.5)

    this.direction = 1

    this.barrel = this.scene.add.image(this.x, this.y, 'barrel')
    this.barrel.setOrigin(0, 0.5)
    this.barrel.rotation = 2 * Math.PI
    this.scene.physics.world.enable(this)

    this.bulletGroup = this.scene.add.group({
      active: true,
      runChildUpdate: true
    })

    if (this.client) {
      this.cursors = this.scene.input.keyboard.createCursorKeys();
      this.rotateUpKey = this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.UP
      );
      this.rotateDownKey = this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.DOWN
      );
      this.scene.input.keyboard.on('keyup-SPACE',  () => {
        this.fireShot({ x: this.barrel.x, y: this.barrel.y })
      }, this)
    }
  }

  update() {
    if (this.active) {
      this.barrel.x = this.x + (2 * this.flipX ? -1 : 1)
      this.barrel.y = this.y - 3
      if (this.client) {
        this.handleInput()
      }
    } else {
      this.barrel.destroy()
      this.destroy()
    }
  }

  handleInput() {
    // FIXME: mostly works, but can cause tank to appear flipped incorrectly
    let velocity = 0
    if (this.cursors.space.isDown) {
      if (this.power <= 200) {
        this.power++
        this.scene.scene.manager.getScene('PlayerInfoScene').updateFirePower(this.power)
      }
    }

    if (this.cursors.left.isDown) {
      this.client.trackMove(this.x, this.y, -60, this.barrel.rotation)
      velocity = -60

      if (!this.flipX) {
        this.barrel.rotation = invertAngle(this.barrel.rotation)
      }
      this.setFlipX(true)
    } else if (this.cursors.right.isDown) {
      this.client.trackMove(this.x, this.y, 60, this.barrel.rotation)
      velocity = 60

      if (this.flipX) {
        this.barrel.rotation = invertAngle(this.barrel.rotation)
      }
      this.setFlipX(false)
    } else {
      velocity = 0
    }

    this.body.setVelocityX(velocity)

    if (this.cursors.up.isDown) {
      this.client.trackMove(this.x, this.y, velocity, this.barrel.rotation)
      this.barrel.angle += this.flipX ? 1 : -1
    }

    if (this.cursors.down.isDown) {
      this.client.trackMove(this.x, this.y, velocity, this.barrel.rotation)
      this.barrel.angle += this.flipX ? -1 : 1
    }
  }

  explode() {
    this.barrel.destroy()
    this.destroy()
  }

  fireShot() {
    let offset = new Phaser.Geom.Point(this.barrel.x + 20, this.barrel.y)
    Phaser.Math.RotateAround(offset, this.barrel.x, this.barrel.y, this.barrel.rotation)
    const bullet = new Bullet({
      scene: this.scene,
      x: offset.x,
      y: offset.y
    })
    this.shot.setPosition(offset.x, offset.y)
    this.shot.play('shot')
    this.shot.setVisible(true)
    this.bulletGroup.add(bullet)
    this.scene.cameras.main.shake(20, 0.005)
    this.scene.physics.velocityFromRotation(this.barrel.rotation, this.power * 3, bullet.body.velocity)
    this.client.fire(this.barrel.rotation, this.power * 3, bullet.body.velocity)
    this.power = 0
    this.scene.scene.manager.getScene('PlayerInfoScene').updateFirePower(this.power)
  }
}
