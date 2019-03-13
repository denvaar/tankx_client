import Phaser from 'phaser'

import PlayerClient from '@utils/player_client'
import { clientHost } from '@utils/config'
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
    const urlParams = new URLSearchParams(window.location.search)
    this.gameName = urlParams.get('game_id')
    this.playerName = ""

    if (!this.gameName) {
      this.gameName = generateGameName()
      document.getElementById('game-name').value = `https://${clientHost}?game_id=${this.gameName}`
      document.getElementById('copy-btn').addEventListener('click', (event) => {
        const copyText = document.getElementById('game-name')
        copyText.select()
        document.execCommand('copy')
        window.alert('Copied:' + copyText.value)
      })
    }

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
    this.client.listPlayers()
  }

  update() {
  }

  onListPlayers({ players }) {
    this.add.bitmapText(200, 100, 'font', 'Tanks', 15)
    this.add.bitmapText(30, 170, 'font', 'Player One', 12)
    this.add.bitmapText(300, 170, 'font', 'Player Two', 12)

    this.playerCount = players.length
    this.players = players

    if (this.playerCount >= 1) {
      // this client is the second player
      const playerOne = players[0]
      this.playerNameDisplay = this.add.bitmapText(30, 200, 'font', playerOne.id, 9)
      this.playerStatusDisplay = this.add.bitmapText(30, 250, 'font', 'ready', 9)
      this.playerTwoStatusDisplay = this.add.bitmapText(300, 200, 'font', 'Press Enter when ready ...', 9)
      this.collectPlayerName(this.playerTwoStatusDisplay)
    } else {
      // this client is the first player
      this.playerNameDisplay = this.add.bitmapText(30, 200, 'font', 'Name: _', 9)
      this.playerStatusDisplay = this.add.bitmapText(30, 250, 'font', 'Press Enter when ready ...', 9)
      this.playerTwoStatusDisplay = this.add.bitmapText(300, 200, 'font', 'Waiting ...', 9)
      this.collectPlayerName(this.playerNameDisplay)
    }
  }

  collectPlayerName(displayTarget) {
    this.input.keyboard.on('keydown', event => {
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

      displayTarget.setText(
        'Name: ' + this.playerName + '_'
      )
    })

    this.input.keyboard.on('keydown_ENTER', event => {
      this.client.addPlayer(this.playerName)
    })
  }

  onAddPlayer({ player_info }) {
    // I hate this logic
    this.players.push(player_info)

    if (this.playerCount === 0) {
      // player one
      this.playerStatusDisplay.setText('ready')
      this.playerNameDisplay.setText(player_info.id)
    } else if (this.playerCount === 1) {
      // player two
      this.playerTwoStatusDisplay.setText(player_info.id)
    }

    this.playerCount++
    if (this.playerCount === 2) {
      this.scene.start('GameplayScene', {
        client: this.client,
        player: this.players.find(p => p.id === this.playerName),
        opponent: this.players.find(p => p.id !== this.playerName) // hacky
      })
    }
  }
}
