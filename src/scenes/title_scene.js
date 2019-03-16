import Phaser from 'phaser'

import PlayerClient from '@utils/player_client'
import { clientHost, gameWidth } from '@utils/config'
import generateGameName from '@utils/generate_game_name'

const IGNORE_KEYS = [
  'Enter',
  'Shift',
  'Meta'
]

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene', active: true })
  }

  init() {
    this.playerName = ""
    this.readyToPlay = false

    this.initCopyLink()
    this.initPlayerClient()
  }

  initCopyLink() {
    const urlParams = new URLSearchParams(window.location.search)
    this.gameName = urlParams.get('game_id')

    if (!this.gameName) {
      const gameNameInput = document.getElementById('game-name')
      const copyButton = document.getElementById('copy-btn')

      this.gameName = generateGameName()

      gameNameInput.value = `https://${clientHost}?game_id=${this.gameName}`
      copyButton.addEventListener('click', (event) => {
        gameNameInput.select()
        document.execCommand('copy')
        window.alert('Copied:' + gameNameInput.value)
      })
    }
  }

  initPlayerClient() {
    this.client = new PlayerClient({
      gameName: this.gameName,
      callbacks: {
        listPlayers: this.onListPlayers.bind(this),
        addPlayer: this.onAddPlayer.bind(this)
      }
    })
  }

  preload() {
    this.load.bitmapFont(
      'font',
      '../assets/font.png',
      '../assets/font.fnt'
    )
  }

  create() {
    this.add.bitmapText(200, 100, 'font', 'Tanks', 15)
    this.add.bitmapText(30, 170, 'font', 'Player One', 12)
    this.add.bitmapText(300, 170, 'font', 'Player Two', 12)

    this.playerNameDisplay = {}
    this.setPlayerNameDisplay('waiting...', 1)
    this.setPlayerNameDisplay('waiting...', 2)
    this.nameEntryDisplay = this.add.bitmapText(200, 250, 'font', 'Name: _', 12)

    this.collectPlayerName()
    this.client.listPlayers()
  }

  setPlayerNameDisplay(text, playerIndex) {
    const fontSize = 9
    const location = ({
      1: {x: 30, y: 200},
      2: {x: 300, y: 200}
    })[playerIndex]

    if (this.playerNameDisplay[playerIndex]) {
      this.playerNameDisplay[playerIndex].setText(text)
    } else {
      this.playerNameDisplay[playerIndex] = this.add.bitmapText(
        location.x,
        location.y,
        'font',
        text,
        fontSize
      )
    }
  }

  /* shared */
  onListPlayers({ players }) {
    players.forEach(player => {
      this.setPlayerNameDisplay(player.id, player.player_index)
    })
  }

  collectPlayerName() {
    this.input.keyboard.on('keydown', event => {
      if (!this.readyToPlay) {
        if (IGNORE_KEYS.includes(event.key)) {
          return
        }

        if (event.key === 'Backspace') {
          this.playerName = this.playerName.slice(
            0,
            this.playerName.length - 1
          )
        } else {
          this.playerName = this.playerName.concat(event.key)
        }

        this.nameEntryDisplay.setText(
          'Name: ' + this.playerName + '_'
        )

        this.nameEntryDisplay.setPosition(
          (gameWidth / 2) - (this.nameEntryDisplay.width / 2),
          250
        )
      }
    })

    this.input.keyboard.on('keydown_ENTER', event => {
      if (!this.readyToPlay) {
        this.client.addPlayer(this.playerName)
        this.nameEntryDisplay.setText('ready!')
        this.nameEntryDisplay.setPosition(
          (gameWidth / 2) - (this.nameEntryDisplay.width / 2),
          250
        )
        this.readyToPlay = true
      }
    })
  }

  /* shared */
  onAddPlayer({ players }) {
    players.forEach(player => {
      this.setPlayerNameDisplay(player.id, player.player_index)
    })

    if (players.length === 2) {
      const player = players.find(p => p.id === this.playerName)
      const opponent = players.find(p => p.id !== this.playerName)

      setTimeout(() => {
        this.scene.start('GameplayScene', {
          client: this.client,
          player,
          opponent
        })
      }, 3000)
    }
  }
}
