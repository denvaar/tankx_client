import Phaser from 'phaser'

import { debug, gameWidth, gameHeight } from './config'
import GameOverScene from './scenes/game_over_scene'
import LiveGameScene from './live_game_scene'
import PlayerInfoScene from './player_info_scene'
import TestGameScene from './test_game_scene'

import TitleScene from './scenes/title_scene'

const config = {
  type: Phaser.CANVAS,
  width: gameWidth,
  height: gameHeight,
  parent: 'game-container',
  resolution: window.devicePixelRatio,
  pixelArt: true,
  scene: [TitleScene, PlayerInfoScene, TestGameScene, GameOverScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 200},
      debug: debug
    }
  },
  render: { pixelArt: true, antialias: false }
}

const game = new Phaser.Game(config)
