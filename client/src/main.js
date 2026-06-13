import Phaser from 'phaser';
import { authManager } from './systems/AuthManager.js';
import { signInWithGoogle } from './config/firebase.js';
import BootScene from './scenes/BootScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import SkinSelectScene from './scenes/SkinSelectScene.js';
import GameSelectScene from './scenes/GameSelectScene.js';
import LobbyScene from './scenes/LobbyScene.js';
import BattleRoyaleScene from './scenes/games/BattleRoyaleScene.js';
import SoccerScene from './scenes/games/SoccerScene.js';
import TankBattleScene from './scenes/games/TankBattleScene.js';
import BombGameScene from './scenes/games/BombGameScene.js';
import PlatformerRaceScene from './scenes/games/PlatformerRaceScene.js';

const config = {
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
};

// Handle auth UI
const overlay = document.getElementById('login-overlay');
const googleBtn = document.getElementById('google-btn');
const skipBtn = document.getElementById('skip-btn');

googleBtn.addEventListener('click', async () => {
  googleBtn.disabled = true;
  googleBtn.textContent = 'Signing in...';
  try {
    await authManager.signIn();
    overlay.classList.add('hidden');
  } catch (e) {
    googleBtn.disabled = false;
    googleBtn.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" style="width:24px"/> Sign in with Google';
  }
});

skipBtn.addEventListener('click', () => {
  overlay.classList.add('hidden');
});

// Init auth then boot game
await authManager.init();
if (authManager.isLoggedIn) overlay.classList.add('hidden');

new Phaser.Game(config);
