import Phaser from 'phaser'

import { gameWidth, gameHeight } from './config'


export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene', active: false})

  }

  init({ didWin }) {
    this.didWin = didWin
  }

  preload() {
    this.load.bitmapFont(
      'font',
      '../assets/font.png',
      '../assets/font.fnt'
    )
  }

  create() {
    let message = 'You are victorious!'
    if (!this.didWin) {
      message = 'You\'ve been hit!'
    }
    const messageText = this.add.bitmapText(
      gameWidth / 2,
      gameHeight / 2,
      'font',
      message,
      15,
      Phaser.GameObjects.BitmapText.ALIGN_CENTER
    )

    messageText.setX(gameWidth / 2 - messageText.width / 2)

    window.setTimeout(() => {
      const continueMessage = this.add.bitmapText(
        gameWidth / 2,
        (gameHeight / 2) + 100,
        'font',
        'Press enter to battle again...',
        10
      )
      continueMessage.setX(gameWidth / 2 - continueMessage.width / 2)

      this.startKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.ENTER
      )
    }, 2000)
  }

  update() {
    if (this.startKey && this.startKey.isDown) {
      this.scene.launch('PlayerInfoScene')
      this.scene.start('TestGameScene')
    }
  }
}
