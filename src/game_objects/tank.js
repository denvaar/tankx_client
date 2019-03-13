import Phaser from 'phaser'

import Bullet from '@game_objects/bullet'


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
    this.maxPower = 200

    this.init()
    this.scene.add.existing(this)
    this.body.setCollideWorldBounds(true)

    this.explosion = this.initAnimation('explosion', 7)
    this.shot = this.initAnimation('shot', 4)
  }

  initAnimation(key, nFrames) {
    const animatedSprite = this.scene.add.sprite(key)
    this.scene.anims.create({
      key,
      frames: this.scene.anims.generateFrameNumbers(key, { start: 1, end: nFrames }),
      hideOnComplete: true,
      frameRate: 20
    })
    animatedSprite.setVisible(false)
    return animatedSprite
  }

  init() {
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
    }
  }

  handleInput() {
    let velocity = 0
    let dirty = false

    if (this.cursors.space.isDown) {
      if (this.power <= this.maxPower) {
        this.power++
        this.scene.scene.manager.getScene('PlayerInfoScene').updateFirePower(this.power)
      }
    }

    if (this.cursors.left.isDown) {
      dirty = true
      velocity = -60

      if (!this.flipX) {
        this.barrel.rotation = invertAngle(this.barrel.rotation)
        this.setFlipX(true)
      }
    } else if (this.cursors.right.isDown) {
      dirty = true
      velocity = 60

      if (this.flipX) {
        this.barrel.rotation = invertAngle(this.barrel.rotation)
        this.setFlipX(false)
      }
    } else {
      velocity = 0
    }

    this.body.setVelocityX(velocity)

    if (this.cursors.up.isDown) {
      dirty = true
      velocity = 0.001 * this.flipX ? -1 : 1
      this.barrel.angle += this.flipX ? 1 : -1
    }

    if (this.cursors.down.isDown) {
      dirty = true
      velocity = 0.001 * this.flipX ? -1 : 1
      this.barrel.angle += this.flipX ? -1 : 1
    }

    if (dirty) {
      this.client.trackMove(this.x, this.y, velocity, this.barrel.rotation)
    }
  }

  explode() {
    this.explosion.setPosition(this.x, this.y)
    this.explosion.play('explosion')
    this.explosion.setVisible(true)

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
