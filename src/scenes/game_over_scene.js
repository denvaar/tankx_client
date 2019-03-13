import Phaser from 'phaser'


export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene', active: false })
  }

  init({ gameResult, player }) {
    if (gameResult === 'win') {
      this.message = `You defeated ${player}!`
    } else {
      this.message = `You were defeated by ${player}!`
    }
  }

  preload() { }

  create() {
    this.add.bitmapText(20, 100, 'font', this.message, 11)
    this.add.bitmapText(20, 200, 'font', 'press enter to restart match', 11)

    this.input.keyboard.on('keydown_ENTER', event => {
      this.scene.start('GameplayScene')
    })
  }

  update() { }
}
