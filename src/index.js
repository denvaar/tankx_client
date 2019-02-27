import Phaser from 'phaser'

import { debug, gameWidth, gameHeight } from './config'
import LiveGameScene from './live_game_scene'

console.log(window.devicePixelRatio)

const config = {
  type: Phaser.CANVAS,
  width: gameWidth,
  height: gameHeight,
  parent: 'game-container',
  resolution: window.devicePixelRatio,
  pixelArt: true,
  scene: [LiveGameScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 200},
      debug: debug
    }
  }
}

const game = new Phaser.Game(config)
