import Phaser from 'phaser'


export default class PlayerInfoScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PlayerInfoScene'})
  }

  init(data) {
    this.playerName = data.playerName
  }

  preload() {
    this.load.bitmapFont(
      'font',
      '../assets/font.png',
      '../assets/font.fnt'
    )
  }

  create() {
    this.playerNameDisplay = this.add.bitmapText(
      15,
      15,
      'font',
      this.playerName,
      8
    )

    this.timerTurnDisplay = this.add.bitmapText(
      70,
      15,
      'font',
      '',
      8
    )

    this.firePowerBar = this.add.graphics()
    this.renderPowerBar(0)
  }

  update() {
  }

  renderPowerBar(firePower) {
    const fillWidth = Math.max(0, (firePower * 0.3) - 2)

    this.firePowerBar.clear()
    this.firePowerBar.lineStyle(2, 0xffffff)
    this.firePowerBar.strokeRect(15, 30, 60, 10)

    this.firePowerBar.fillStyle(0x2196f3, 1)
    this.firePowerBar.fillRect(16, 31, fillWidth, 8)
  }

  updateFirePower(firePower) {
    this.renderPowerBar(firePower)
  }

  toggleActiveDisplay(disabled) {
    if (this.countdownId) {
      clearInterval(this.countdownId)
      this.countdownId = null
    }

    if (!disabled) {
      this.elapsedTime = 15
      this.countdownId = setInterval(() => {
        this.elapsedTime--
        this.timerTurnDisplay.setText(`Your turn (${this.elapsedTime})`)
      }, 1000)
    } else {
      this.timerTurnDisplay.setText('--')
    }
  }
}
