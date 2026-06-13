import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    // Progress bar
    const w = this.cameras.main.width, h = this.cameras.main.height;
    const bar = this.add.graphics();
    const box = this.add.graphics();
    box.fillStyle(0x222222).fillRect(w/2 - 160, h/2 - 15, 320, 30);
    this.add.text(w/2, h/2 - 50, 'Loading...', { font:'20px Arial', color:'#ffffff' }).setOrigin(0.5);

    this.load.on('progress', (v) => {
      bar.clear().fillStyle(0x9b59b6).fillRect(w/2 - 158, h/2 - 13, 316 * v, 26);
    });
    this.load.on('complete', () => bar.destroy());

    // Generate placeholder textures programmatically (no external asset files needed to start)
    this.generateTextures();
  }

  generateTextures() {
    // We generate coloured circle textures for all 215 skins using Canvas API.
    // Real sprite art can be swapped in later by replacing these generated textures.
    const SKIN_COLORS = {
      animals:   0xf39c12,
      fantasy:   0x9b59b6,
      scifi:     0x3498db,
      food:      0xe74c3c,
      sports:    0x2ecc71,
      seasonal:  0xe67e22,
      nature:    0x27ae60,
      pixel:     0x95a5a6,
      kawaii:    0xff69b4,
      legendary: 0xf1c40f,
    };

    // Skin placeholder sprites will be drawn on-the-fly in SkinSelectScene
    // Generate shared UI textures
    const g = this.make.graphics({ x:0, y:0, add:false });

    // btn_primary
    g.clear().fillStyle(0x8e44ad).fillRoundedRect(0,0,220,55,14)
      .lineStyle(3,0xc39bd3).strokeRoundedRect(0,0,220,55,14);
    g.generateTexture('btn_primary', 220, 55); g.clear();

    // btn_secondary
    g.fillStyle(0x2980b9).fillRoundedRect(0,0,180,48,12)
      .lineStyle(2,0x85c1e9).strokeRoundedRect(0,0,180,48,12);
    g.generateTexture('btn_secondary', 180, 48); g.clear();

    // panel
    g.fillStyle(0x2d0b5e, 0.92).fillRoundedRect(0,0,400,260,18)
      .lineStyle(2,0x9b59b6).strokeRoundedRect(0,0,400,260,18);
    g.generateTexture('panel', 400, 260); g.clear();

    // icon_coin
    g.fillStyle(0xf1c40f).fillCircle(16,16,14).lineStyle(2,0xd4ac0d).strokeCircle(16,16,14);
    g.generateTexture('icon_coin', 32, 32); g.clear();

    // icon_gem
    g.fillStyle(0x1abc9c).fillTriangle(16,2,30,28,2,28)
      .lineStyle(2,0x16a085).strokeTriangle(16,2,30,28,2,28);
    g.generateTexture('icon_gem', 32, 32); g.clear();

    // skin_card
    g.fillStyle(0x3d1266).fillRoundedRect(0,0,120,140,10)
      .lineStyle(2,0x7d3c98).strokeRoundedRect(0,0,120,140,10);
    g.generateTexture('skin_card', 120, 140); g.clear();

    // skin_card_selected
    g.fillStyle(0x6c3483).fillRoundedRect(0,0,120,140,10)
      .lineStyle(3,0xf1c40f).strokeRoundedRect(0,0,120,140,10);
    g.generateTexture('skin_card_selected', 120, 140); g.clear();

    // game_card
    g.fillStyle(0x1a0a3d).fillRoundedRect(0,0,180,140,12)
      .lineStyle(2,0x6c3483).strokeRoundedRect(0,0,180,140,12);
    g.generateTexture('game_card', 180, 140); g.clear();

    // hud_bar
    g.fillStyle(0x1a0533, 0.85).fillRect(0,0,1280,56);
    g.generateTexture('hud_bar', 1280, 56); g.clear();

    // ground tile
    g.fillStyle(0x27ae60).fillRect(0,0,64,20).lineStyle(1,0x1e8449).strokeRect(0,0,64,20);
    g.generateTexture('ground', 64, 20); g.clear();

    // player body (for all games)
    ['red','blue','green','yellow'].forEach((c, i) => {
      const colors = [0xe74c3c,0x3498db,0x2ecc71,0xf1c40f];
      g.fillStyle(colors[i]).fillCircle(20,20,18).lineStyle(3,0xffffff).strokeCircle(20,20,18);
      g.generateTexture(`player_${c}`, 40, 40); g.clear();
    });

    // bomb
    g.fillStyle(0x2c3e50).fillCircle(16,14,13).fillStyle(0xff6b35).fillRect(14,0,4,8);
    g.generateTexture('bomb', 32, 28); g.clear();

    // explosion
    g.fillStyle(0xff4500,0.9).fillCircle(24,24,22).fillStyle(0xffd700,0.8).fillCircle(24,24,14);
    g.generateTexture('explosion', 48, 48); g.clear();

    // soccer ball
    g.fillStyle(0xffffff).fillCircle(16,16,14).lineStyle(2,0x333333).strokeCircle(16,16,14)
      .fillStyle(0x333333).fillCircle(16,10,4).fillCircle(10,20,4).fillCircle(22,20,4);
    g.generateTexture('soccer_ball', 32, 32); g.clear();

    // tank body
    g.fillStyle(0x5d6d7e).fillRect(0,8,60,28).fillRect(10,0,40,16)
      .lineStyle(2,0x85929e).strokeRect(0,8,60,28);
    g.generateTexture('tank_body', 60, 36); g.clear();

    // tank turret
    g.fillStyle(0x4a5568).fillRect(0,6,36,12).fillRect(0,0,8,24);
    g.generateTexture('tank_turret', 36, 24); g.clear();

    // tank shell
    g.fillStyle(0xf1c40f).fillRect(0,2,20,8).fillTriangle(20,0,20,12,28,6);
    g.generateTexture('tank_shell', 28, 12); g.clear();

    // wall (tank game)
    g.fillStyle(0x7f8c8d).fillRect(0,0,48,48).lineStyle(2,0x95a5a6).strokeRect(0,0,48,48);
    g.generateTexture('wall', 48, 48); g.clear();

    g.destroy();
  }

  create() {
    this.scene.start('MainMenu');
  }
}
