import Phaser from 'phaser'

export default class Bullet extends Phaser.GameObjects.Graphics {
  constructor(params) {
    super(params.scene, params)

    this.fillStyle(0x000000, 1.0)
    this.fillCircle(0, 0, 2)

    this.scene.physics.world.enable(this)
    this.body.setCircle(2)
    this.body.setOffset(-2, -2)

    this.scene.add.existing(this)
  }
}
