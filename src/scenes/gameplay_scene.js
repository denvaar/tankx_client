import Phaser from 'phaser'

import PlayerInfoScene from '@scenes/player_info_scene'
import Bullet from '@game_objects/bullet'
import PlayerClient from '@utils/player_client'
import Tank from '@game_objects/tank'
import { gameWidth, gameHeight } from '@utils/config'


export default class GameplayScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameplayScene', active: false })
  }

  init(data) {
    this.client = data.client
    this.player = data.player
    this.opponent = data.opponent

    // hacky...
    this.client.callbacks = {
      ...this.client.callbacks,
      switchTurn: this.onSwitchTurn.bind(this),
      movePlayer: this.movePlayer.bind(this),
      fireShot: this.fireShot.bind(this),
      killPlayer: this.killPlayer.bind(this)
    }

    this.scene.launch('PlayerInfoScene', {playerName: this.player.id})
    this.cameras.main.roundPixels = true
    this.cameras.main.setBounds(0, 0, gameWidth, gameHeight)
    this.cameras.main.setBackgroundColor('rgba(105, 105, 105, 1)')
  }

  preload() {
    this.load.image('barrel', '../assets/barrel.png')
    this.load.spritesheet('tank', '../assets/blue-tank.png', { frameWidth: 32, frameHeight: 20 })
    this.load.spritesheet('shot', '../assets/shot.png', { frameWidth: 30, frameHeight: 30 })
    this.load.spritesheet('explosion', '../assets/explosion.png', { frameWidth: 32, frameHeight: 30 })
  }

  create() {
    this.scene.bringToTop('PlayerInfoScene')

    this.anims.create({
      key: 'horiz',
      frames: this.anims.generateFrameNumbers('tank', { start: 1, end: 4 }),
      frameRate: 10
    })

    const { x, y } = this.player
    this.player = new Tank({ scene: this, x, y, key: 'tank' }, this.client)

    this.otherPlayers = {}
    const otherPlayer = new Tank({ scene: this, x: this.opponent.x, y: this.opponent.y, key: 'tank' }, null)

    this.physics.add.overlap(
      this.player.bulletGroup,
      otherPlayer,
      (bullet, tank) => this.bulletHitTank(bullet, tank, this.opponent.id),
      null,
      this
    )
    this.otherPlayers[this.opponent.id] = otherPlayer

    this.client.switchTurn()
  }

  update() {
    if (this.player) {
      this.player.update()
    }
    Object.values(this.otherPlayers).forEach(otherPlayer => {
      otherPlayer.update()
    })
  }

  bulletHitTank(bullet, tank, id) {
    bullet.destroy()
    this.player.client.explode(id)
  }

  movePlayer({id, x, y, velocity, barrel_rotation}) {
    const player = this.otherPlayers[id]
    if (player) {
      player.barrel.rotation = barrel_rotation
      player.flipX = velocity >= 0 ? false : true
      player.setPosition(x, y)
    } else {
      console.error('Unable to find player!')
    }
  }

  killPlayer({id}) {
    const explodingPlayer = this.otherPlayers[id]

    if (explodingPlayer) {
      this.otherPlayers[id].explode()
      delete this.otherPlayers[id]
      setTimeout(() => {
        this.scene.stop('PlayerInfoScene')
        this.scene.start('GameOverScene', {gameResult: 'win', player: id, client: this.client})
      }, 1000)
    } else {
      this.player.explode()
      setTimeout(() => {
        this.scene.stop('PlayerInfoScene')
        this.scene.start('GameOverScene', {
          gameResult: 'loose',
          player: Object.keys(this.otherPlayers)[0],
          client: this.client
        })
      }, 1000)
    }
  }

  // TODO: I think I need to use this
  removePlayer(id) {
    this.otherPlayers[id].barrel.destroy()
    this.otherPlayers[id].destroy()
    delete this.otherPlayers[id]
  }

  /* shared */
  fireShot({id, rotation, power}) {
    const player = this.otherPlayers[id] || this.player
    player.fireShot({rotation, power})
  }

  /* shared */
  onSwitchTurn(playerName) {
    const player = this.otherPlayers[playerName] || this.player
    this.player.toggleInput(this.player !== player)

    // This is a bug, so using pan as a workaround
    // this.cameras.main.startFollow(player, true, 0.1, 0.1)
    this.cameras.main.stopFollow()
    const durration = 1000
    this.cameras.main.pan(player.x, null, durration)
    setTimeout(() => {
      this.cameras.main.startFollow(player)
    }, durration)
  }
}
