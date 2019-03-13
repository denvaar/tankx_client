import Phaser from 'phaser'

import { debug, gameWidth, gameHeight } from '@utils/config'
import GameOverScene from '@scenes/game_over_scene'
import PlayerInfoScene from '@scenes/player_info_scene'
import GameplayScene from '@scenes/gameplay_scene'
import TitleScene from '@scenes/title_scene'

const config = {
  type: Phaser.CANVAS,
  width: gameWidth,
  height: gameHeight,
  parent: 'game-container',
  resolution: window.devicePixelRatio,
  pixelArt: true,
  scene: [TitleScene, PlayerInfoScene, GameplayScene, GameOverScene],
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
