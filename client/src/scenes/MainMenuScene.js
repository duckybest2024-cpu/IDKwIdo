import Phaser from 'phaser';
import { authManager } from '../systems/AuthManager.js';

export default class MainMenuScene extends Phaser.Scene {
  constructor() { super('MainMenu'); }

  create() {
    const { width: W, height: H } = this.cameras.main;

    // Animated background
    this.add.rectangle(0, 0, W, H, 0x1a0533).setOrigin(0);
    this._addStars(W, H);

    // Title
    this.add.text(W/2, 120, '2 3 4', {
      font: 'bold 96px Arial', color: '#ffffff',
      stroke: '#9b59b6', strokeThickness: 6,
    }).setOrigin(0.5);
    this.add.text(W/2, 210, 'PLAYER GAMES', {
      font: 'bold 52px Arial', color: '#f39c12',
      stroke: '#d35400', strokeThickness: 4,
    }).setOrigin(0.5);
    this.add.text(W/2, 268, 'MEGA EDITION', {
      font: 'bold 26px Arial', color: '#9b59b6',
    }).setOrigin(0.5);

    // Stats bar
    this.add.text(W/2, 310, '50 GAMES  ·  215 FREE SKINS  ·  UP TO 6 PLAYERS', {
      font: '18px Arial', color: '#c39bd3',
    }).setOrigin(0.5);

    // Player count buttons
    const modes = [
      { label:'1\nPLAYER',  x: W/2 - 280, color:0xe74c3c, scene:'GameSelect', players:1 },
      { label:'2\nPLAYERS', x: W/2 - 80,  color:0x3498db, scene:'GameSelect', players:2 },
      { label:'3\nPLAYERS', x: W/2 + 80,  color:0x2ecc71, scene:'GameSelect', players:3 },
      { label:'4\nPLAYERS', x: W/2 + 280, color:0xf1c40f, scene:'GameSelect', players:4 },
    ];

    modes.forEach(m => {
      const btn = this.add.rectangle(m.x, 420, 160, 90, m.color, 1).setInteractive({ useHandCursor:true });
      this.add.text(m.x, 420, m.label, { font:'bold 22px Arial', color:'#ffffff', align:'center' }).setOrigin(0.5);
      btn.on('pointerover',  () => btn.setScale(1.06));
      btn.on('pointerout',   () => btn.setScale(1));
      btn.on('pointerdown',  () => this.scene.start('GameSelect', { players: m.players }));
    });

    // Online button
    const onlineBtn = this._makeBtn(W/2, 540, 'PLAY ONLINE', 0x8e44ad);
    onlineBtn.on('pointerdown', () => this.scene.start('GameSelect', { players:4, online:true }));

    // Bottom buttons
    const skinsBtn = this._makeBtn(W/2 - 160, 630, 'SKINS', 0x1abc9c, 140);
    skinsBtn.on('pointerdown', () => this.scene.start('SkinSelect'));

    // Currency display
    this.add.image(W - 160, 30, 'icon_gem').setScale(0.8);
    this.gemText = this.add.text(W - 140, 28, String(authManager.gems), { font:'bold 20px Arial', color:'#1abc9c' });
    this.add.image(W - 80, 30, 'icon_coin').setScale(0.8);
    this.coinText = this.add.text(W - 60, 28, String(authManager.coins), { font:'bold 20px Arial', color:'#f1c40f' });

    // User name
    this.add.text(20, 20, authManager.isLoggedIn ? `Hi, ${authManager.displayName}!` : 'Playing as Guest', {
      font:'18px Arial', color:'#c39bd3',
    });

    // Tween title
    this.tweens.add({ targets: this.children.list[2], y: 115, duration:1800, yoyo:true, repeat:-1, ease:'Sine.easeInOut' });
  }

  _makeBtn(x, y, label, color, w=200) {
    const btn = this.add.rectangle(x, y, w, 52, color).setInteractive({ useHandCursor:true });
    this.add.text(x, y, label, { font:'bold 20px Arial', color:'#ffffff' }).setOrigin(0.5);
    btn.on('pointerover', () => btn.setAlpha(0.8));
    btn.on('pointerout',  () => btn.setAlpha(1));
    return btn;
  }

  _addStars(W, H) {
    for (let i = 0; i < 80; i++) {
      const x = Phaser.Math.Between(0, W);
      const y = Phaser.Math.Between(0, H);
      const r = Phaser.Math.FloatBetween(1, 3);
      const star = this.add.circle(x, y, r, 0xffffff, Phaser.Math.FloatBetween(0.3, 1));
      this.tweens.add({ targets: star, alpha: 0.1, duration: Phaser.Math.Between(800, 2500), yoyo:true, repeat:-1, delay: Phaser.Math.Between(0,2000) });
    }
  }
}
