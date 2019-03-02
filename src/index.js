import Phaser from 'phaser'

import { debug, gameWidth, gameHeight } from './config'
import LiveGameScene from './live_game_scene'
import TestGameScene from './test_game_scene'

const config = {
  type: Phaser.CANVAS,
  width: gameWidth,
  height: gameHeight,
  parent: 'game-container',
  resolution: window.devicePixelRatio,
  pixelArt: true,
  scene: [TestGameScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 200},
      debug: debug
    }
  }
}

const game = new Phaser.Game(config)
