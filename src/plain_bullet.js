import Phaser from 'phaser'

class PlainBullet extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene)
    Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'bullet')
    this.speed = Phaser.Math.GetSpeed(400, 1)
  }

  update(time, delta) {
    if (this.direction > 0) {
      this.x += this.speed * delta
    } else {
      this.x -= this.speed * delta
    }
    if (this.x > 500 || this.x < 0) {
      this.setActive(false)
      this.setVisible(false)
    }
  }

  fire(x, y, rotation) {
    this.direction = rotation
    this.setPosition(x, y)
    this.setActive(true)
    this.setVisible(true)
  }
}

export default PlainBullet
