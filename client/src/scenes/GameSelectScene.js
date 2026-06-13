import Phaser from 'phaser';
import { GAMES } from '../config/gamesList.js';

const TAG_COLORS = { action:0xe74c3c, sports:0x3498db, racing:0xf39c12, platform:0x2ecc71, puzzle:0x9b59b6, classic:0x7f8c8d, fun:0xe67e22, strategy:0x1abc9c, team:0x2c3e50, chill:0x27ae60, survival:0xc0392b, rhythm:0xff69b4 };

export default class GameSelectScene extends Phaser.Scene {
  constructor() { super('GameSelect'); }

  init(data) {
    this.players = data?.players || 2;
    this.online  = data?.online  || false;
    this.filter  = null;
    this.search  = '';
    this.page    = 0;
    this.perPage = 15;
  }

  create() {
    const { width:W, height:H } = this.cameras.main;
    this.add.rectangle(0,0,W,H,0x1a0533).setOrigin(0);

    // Header
    this.add.text(W/2, 36, 'CHOOSE A GAME', { font:'bold 34px Arial', color:'#ffffff' }).setOrigin(0.5);
    this.add.text(W/2, 70, `${this.players} player${this.players>1?'s':''} • ${GAMES.length} games`, { font:'16px Arial', color:'#c39bd3' }).setOrigin(0.5);

    // Game cards grid
    this.cardsContainer = this.add.container(0,0);
    this._renderGames();

    // Pagination
    this.prevBtn = this._makeBtn(W/2-100, H-36, '< PREV', 0x6c3483, 130);
    this.nextBtn = this._makeBtn(W/2+100, H-36, 'NEXT >', 0x6c3483, 130);
    this.pageText = this.add.text(W/2, H-36, '', { font:'16px Arial', color:'#c39bd3' }).setOrigin(0.5);
    this.prevBtn.on('pointerdown', () => { if(this.page>0){this.page--;this._renderGames();} });
    this.nextBtn.on('pointerdown', () => { if((this.page+1)*this.perPage<GAMES.length){this.page++;this._renderGames();} });

    this._makeBtn(80, H-36, 'BACK', 0x6c3483, 120).on('pointerdown', () => this.scene.start('MainMenu'));
  }

  _renderGames() {
    this.cardsContainer.removeAll(true);
    const games = GAMES.filter(g => g.maxPlayers >= this.players);
    const page  = games.slice(this.page * this.perPage, (this.page+1) * this.perPage);
    const { width:W } = this.cameras.main;
    const cols=5, cW=200, cH=150, padX=18, padY=14;
    const startX = (W - (cols*(cW+padX)-padX)) / 2;
    const startY = 104;

    page.forEach((game, i) => {
      const col=i%cols, row=Math.floor(i/cols);
      const x = startX + col*(cW+padX) + cW/2;
      const y = startY + row*(cH+padY) + cH/2;

      const bg = this.add.rectangle(x,y,cW,cH,0x2d0b5e).setInteractive({useHandCursor:true})
        .setStrokeStyle(2,0x6c3483);
      this.add.text(x, y-30, game.name, { font:'bold 14px Arial', color:'#ffffff', wordWrap:{width:180} }).setOrigin(0.5);
      this.add.text(x, y,    game.description, { font:'11px Arial', color:'#c39bd3', wordWrap:{width:180} }).setOrigin(0.5);

      const tagColor = TAG_COLORS[game.tags[0]] || 0x555555;
      const tagBg = this.add.rectangle(x, y+38, game.tags[0].length*10+14, 22, tagColor);
      this.add.text(x, y+38, game.tags[0].toUpperCase(), { font:'10px Arial', color:'#fff' }).setOrigin(0.5);

      this.add.text(x+68, y-52, `${game.minPlayers}-${game.maxPlayers}P`, { font:'11px Arial', color:'#f39c12' }).setOrigin(1,0);

      bg.on('pointerover', () => { bg.setFillColor(0x4a1a8a); bg.setScale(1.03); });
      bg.on('pointerout',  () => { bg.setFillColor(0x2d0b5e); bg.setScale(1); });
      bg.on('pointerdown', () => this._launchGame(game));

      this.cardsContainer.add([bg, tagBg]);
    });

    const total = Math.ceil(games.length/this.perPage);
    this.pageText.setText(`${this.page+1} / ${total}`);
  }

  _launchGame(game) {
    const sceneKey = this._sceneKey(game.id);
    const data = { players: this.players, online: this.online, gameType: game.id };
    if (this.online) {
      this.scene.start('Lobby', data);
    } else if (this.scene.get(sceneKey)) {
      this.scene.start(sceneKey, data);
    } else {
      // Fallback for games not yet implemented — show coming soon
      this._showComingSoon(game);
    }
  }

  _showComingSoon(game) {
    const { width:W, height:H } = this.cameras.main;
    const overlay = this.add.rectangle(W/2,H/2,500,200,0x2d0b5e).setStrokeStyle(2,0x9b59b6);
    const title = this.add.text(W/2,H/2-40,game.name+' — Coming Soon!',{font:'bold 22px Arial',color:'#fff'}).setOrigin(0.5);
    const sub = this.add.text(W/2,H/2,`${game.description}`,{font:'16px Arial',color:'#c39bd3'}).setOrigin(0.5);
    const closeBtn = this.add.rectangle(W/2,H/2+60,120,40,0x8e44ad).setInteractive({useHandCursor:true});
    this.add.text(W/2,H/2+60,'OK',{font:'bold 18px Arial',color:'#fff'}).setOrigin(0.5);
    closeBtn.on('pointerdown',()=>{[overlay,title,sub,closeBtn].forEach(o=>o.destroy());});
  }

  _sceneKey(gameId) {
    const map = { battle_royale:'BattleRoyale', soccer:'Soccer', tank_battle:'TankBattle', bomb_game:'BombGame', platformer_race:'PlatformerRace' };
    return map[gameId] || '';
  }

  _makeBtn(x,y,label,color,w=180){
    const btn=this.add.rectangle(x,y,w,44,color).setInteractive({useHandCursor:true});
    this.add.text(x,y,label,{font:'bold 16px Arial',color:'#fff'}).setOrigin(0.5);
    btn.on('pointerover',()=>btn.setAlpha(0.8)); btn.on('pointerout',()=>btn.setAlpha(1));
    return btn;
  }
}
