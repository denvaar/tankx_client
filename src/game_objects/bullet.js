import Phaser from 'phaser'

import { gameHeight } from '@utils/config'

export default class Bullet extends Phaser.GameObjects.Graphics {
  constructor(params) {
    super(params.scene, params)

    this.fillStyle(0x000000, 1.0)
    this.fillCircle(0, 0, 2)

    this.scene.physics.world.enable(this)
    this.body.setCircle(2)
    this.body.setOffset(-2, -2)

    this.scene.add.existing(this)

    this.onDestroy = params.onDestroy
  }

  update() {
    if (this.y > gameHeight) {
      this.onDestroy(this)
    }
  }
}
