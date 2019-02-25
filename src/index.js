import Phaser from 'phaser'

import LiveGameScene from './live_game_scene'
import PlainBullet from './plain_bullet'


const config = {
  type: Phaser.AUTO,
  width: 500,
  height: 300,
  parent: 'game-container',
  scene: [LiveGameScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 200},
      debug: true
    }
  }
}

const game = new Phaser.Game(config)
