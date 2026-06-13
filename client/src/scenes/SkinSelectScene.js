import Phaser from 'phaser';
import { authManager } from '../systems/AuthManager.js';

const CATEGORIES = ['animals','fantasy','scifi','food','sports','seasonal','nature','pixel','kawaii','legendary'];
const CAT_COLORS = {
  animals:0xf39c12, fantasy:0x9b59b6, scifi:0x3498db, food:0xe74c3c,
  sports:0x2ecc71, seasonal:0xe67e22, nature:0x27ae60, pixel:0x95a5a6,
  kawaii:0xff69b4, legendary:0xf1c40f,
};

export default class SkinSelectScene extends Phaser.Scene {
  constructor() { super('SkinSelect'); }

  init() {
    this.selectedSkin = localStorage.getItem('selectedSkin') || 'cat_white';
    this.currentCat  = 'animals';
    this.cardObjects = [];
  }

  async create() {
    const { width:W, height:H } = this.cameras.main;

    // Fetch all skins
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'}/api/skins`);
      this.allSkins = await res.json();
    } catch {
      // fallback minimal list
      this.allSkins = [{ id:'cat_white', name:'White Cat', category:'animals', coinCost:0 }];
    }

    this.ownedSkins = JSON.parse(localStorage.getItem('ownedSkins') || '["cat_white","frog_green","robot_red","unicorn_pink"]');

    // Background
    this.add.rectangle(0,0,W,H,0x1a0533).setOrigin(0);

    // Header
    this.add.text(W/2, 40, 'SELECT YOUR SKIN', { font:'bold 36px Arial', color:'#ffffff' }).setOrigin(0.5);
    this.add.text(W/2, 76, `${this.allSkins.length} skins — all free, earned by playing`, { font:'16px Arial', color:'#c39bd3' }).setOrigin(0.5);

    // Currency
    this.add.image(W-160,36,'icon_coin').setScale(0.8);
    this.coinText = this.add.text(W-140,34, String(authManager.coins), { font:'bold 18px Arial', color:'#f1c40f' });

    // Category tabs
    this.tabGroup = [];
    CATEGORIES.forEach((cat, i) => {
      const x = 70 + i * 114;
      const tab = this.add.rectangle(x, 118, 108, 36, CAT_COLORS[cat]).setInteractive({ useHandCursor:true });
      const lbl = this.add.text(x, 118, cat.toUpperCase(), { font:'bold 11px Arial', color:'#ffffff' }).setOrigin(0.5);
      tab.on('pointerdown', () => this._selectCategory(cat));
      this.tabGroup.push({ tab, lbl, cat });
    });

    // Cards container
    this.cardsContainer = this.add.container(0, 0);
    this._renderCards();

    // Preview panel
    this.previewPanel = this.add.rectangle(W - 200, H/2 + 40, 360, 420, 0x2d0b5e).setOrigin(0.5);
    this.previewTitle = this.add.text(W-200, H/2 - 130, '', { font:'bold 22px Arial', color:'#ffffff' }).setOrigin(0.5);
    this.previewCost  = this.add.text(W-200, H/2 - 100, '', { font:'16px Arial', color:'#f1c40f' }).setOrigin(0.5);
    this.selectBtn    = this._makeBtn(W-200, H/2 + 140, 'SELECT', 0x8e44ad, 160);
    this.selectBtn.on('pointerdown', () => this._selectCurrentSkin());
    this._updatePreview(this.selectedSkin);

    // Back button
    this._makeBtn(80, H-36, 'BACK', 0x6c3483, 120).on('pointerdown', () => this.scene.start('MainMenu'));
  }

  _renderCards() {
    this.cardsContainer.removeAll(true);
    this.cardObjects = [];
    const skins = this.allSkins.filter(s => s.category === this.currentCat);
    const cols = 5, cardW = 120, cardH = 140, padX = 16, padY = 16;
    const startX = 40;
    const startY = 156;

    skins.forEach((skin, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const x = startX + col * (cardW + padX) + cardW/2;
      const y = startY + row * (cardH + padY) + cardH/2;
      const owned = this.ownedSkins.includes(skin.id);
      const selected = skin.id === this.selectedSkin;

      const bg = this.add.image(x, y, selected ? 'skin_card_selected' : 'skin_card').setInteractive({ useHandCursor:true });

      // Draw skin avatar circle (placeholder)
      const circle = this.add.circle(x, y - 20, 36, CAT_COLORS[skin.category] || 0xffffff);
      const initial = this.add.text(x, y - 20, skin.name[0].toUpperCase(), { font:'bold 24px Arial', color:'#ffffff' }).setOrigin(0.5);

      const nameText = this.add.text(x, y + 30, skin.name, { font:'10px Arial', color:'#ffffff', wordWrap:{width:110} }).setOrigin(0.5);

      let statusText;
      if (!owned && skin.coinCost > 0) {
        statusText = this.add.text(x, y + 52, `🪙 ${skin.coinCost}`, { font:'12px Arial', color:'#f1c40f' }).setOrigin(0.5);
      } else if (owned || skin.coinCost === 0) {
        statusText = this.add.text(x, y + 52, '✓ FREE', { font:'11px Arial', color:'#2ecc71' }).setOrigin(0.5);
      }

      bg.on('pointerdown', () => { this.focusedSkin = skin.id; this._updatePreview(skin.id); });
      bg.on('pointerover', () => bg.setScale(1.04));
      bg.on('pointerout',  () => bg.setScale(1));

      this.cardsContainer.add([bg, circle, initial, nameText, statusText].filter(Boolean));
      this.cardObjects.push({ skin, bg });
    });
  }

  _updatePreview(skinId) {
    this.focusedSkin = skinId;
    const skin = this.allSkins.find(s => s.id === skinId);
    if (!skin) return;
    const owned = this.ownedSkins.includes(skin.id) || skin.coinCost === 0;
    this.previewTitle.setText(skin.name);
    this.previewCost.setText(owned ? '✓ Unlocked — Free!' : `Cost: ${skin.coinCost} coins`);
    this.selectBtn.fillColor = owned ? 0x27ae60 : 0xe67e22;
  }

  _selectCurrentSkin() {
    const skin = this.allSkins.find(s => s.id === this.focusedSkin);
    if (!skin) return;
    const owned = this.ownedSkins.includes(skin.id) || skin.coinCost === 0;
    if (!owned) { this._tryUnlock(skin); return; }
    this.selectedSkin = skin.id;
    localStorage.setItem('selectedSkin', skin.id);
    this._renderCards();
  }

  async _tryUnlock(skin) {
    if (authManager.coins < skin.coinCost) { return; }
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'}/api/skins/unlock/${skin.id}`, {
        method:'POST', headers:{ 'Authorization': `Bearer ${authManager.token}` },
      });
      if (res.ok) {
        this.ownedSkins.push(skin.id);
        localStorage.setItem('ownedSkins', JSON.stringify(this.ownedSkins));
        this._renderCards();
      }
    } catch(e) { console.error(e); }
  }

  _selectCategory(cat) {
    this.currentCat = cat;
    this.tabGroup.forEach(t => t.tab.setAlpha(t.cat === cat ? 1 : 0.5));
    this._renderCards();
  }

  _makeBtn(x, y, label, color, w=180) {
    const btn = this.add.rectangle(x, y, w, 44, color).setInteractive({ useHandCursor:true });
    this.add.text(x, y, label, { font:'bold 18px Arial', color:'#fff' }).setOrigin(0.5);
    btn.on('pointerover', () => btn.setAlpha(0.8));
    btn.on('pointerout',  () => btn.setAlpha(1));
    return btn;
  }
}
