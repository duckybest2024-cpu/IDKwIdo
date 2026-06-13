import Phaser from 'phaser';
import { authManager } from './systems/AuthManager.js';
import BootScene          from './scenes/BootScene.js';
import MainMenuScene      from './scenes/MainMenuScene.js';
import SkinSelectScene    from './scenes/SkinSelectScene.js';
import GameSelectScene    from './scenes/GameSelectScene.js';
import LobbyScene         from './scenes/LobbyScene.js';
import BattleRoyaleScene  from './scenes/games/BattleRoyaleScene.js';
import SoccerScene        from './scenes/games/SoccerScene.js';
import TankBattleScene    from './scenes/games/TankBattleScene.js';
import BombGameScene      from './scenes/games/BombGameScene.js';
import PlatformerRaceScene from './scenes/games/PlatformerRaceScene.js';

const overlay  = document.getElementById('login-overlay');
const skipBtn  = document.getElementById('skip-btn');

// Handle guest mode
skipBtn.addEventListener('click', () => overlay.classList.add('hidden'));

// Init auth — picks up ?token= from GitHub OAuth redirect or localStorage
await authManager.init();
if (authManager.isLoggedIn) overlay.classList.add('hidden');

// Boot Phaser
new Phaser.Game({
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  backgroundColor: '#1a0533',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false },
  },
  scene: [
    BootScene,
    MainMenuScene,
    SkinSelectScene,
    GameSelectScene,
    LobbyScene,
    BattleRoyaleScene,
    SoccerScene,
    TankBattleScene,
    BombGameScene,
    PlatformerRaceScene,
  ],
});
