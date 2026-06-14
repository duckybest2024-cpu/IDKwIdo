// ============================================================
//  234 Player Games — Mega Edition
//  Single-file Phaser 3 game. No build step. No login needed.
// ============================================================

const SKIN_CATEGORIES = {
  animals:   { color:0xf39c12, skins:['cat_white','cat_black','cat_orange','cat_gray','dog_golden','dog_dalmatian','dog_pug','dog_husky','frog_green','frog_blue','frog_purple','rabbit_white','rabbit_brown','bear_brown','bear_polar','bear_panda','fox_red','fox_arctic','wolf_gray','penguin','owl_brown','parrot','duck_yellow','hamster','deer','koala','hedgehog','axolotl','capybara','quokka','red_panda','chameleon','turtle','crab','mouse','gecko','duck_rubber','wolf_white','owl_white','rabbit_black'] },
  fantasy:   { color:0x9b59b6, skins:['unicorn_pink','unicorn_blue','unicorn_rainbow','dragon_red','dragon_green','dragon_blue','dragon_purple','wizard_purple','wizard_blue','witch','knight_silver','knight_gold','knight_black','elf','fairy_pink','fairy_green','mermaid_blue','mermaid_purple','phoenix','griffin','slime_green','slime_blue','slime_purple','skeleton','ghost','vampire','werewolf','zombie','goblin','troll'] },
  scifi:     { color:0x3498db, skins:['robot_red','robot_blue','robot_green','robot_gold','alien_green','alien_purple','alien_blue','astronaut_white','astronaut_orange','cyborg','android','spaceship_pilot','martian','android_female','neon_warrior','hacker','time_traveler','crystal_being','plasma_entity','nano_bot','mech_pilot','hologram','star_commander','void_walker','quantum_jumper'] },
  food:      { color:0xe74c3c, skins:['pizza','taco','burger','hotdog','ice_cream','donut','cupcake','cookie','watermelon','strawberry','avocado','sushi','ramen','boba_tea','lollipop','gummy_bear','pretzel','popcorn','chocolate','pineapple'] },
  sports:    { color:0x2ecc71, skins:['soccer_red','soccer_blue','basketball_player','baseball_player','tennis_player','swimmer','boxer_red','boxer_blue','ninja','samurai','sumo_wrestler','skateboarder','snowboarder','surfer','gymnast','archer','fencer','karate_fighter','climber','diver'] },
  seasonal:  { color:0xe67e22, skins:['santa','elf_xmas','reindeer','snowman','gingerbread','easter_bunny','chick','pumpkin','frankenstein','mummy','witch_halloween','leprechaun','cupid','firework','pilgrim','turkey','dreidel','sakura_spirit','lunar_rabbit','diwali_lamp'] },
  nature:    { color:0x27ae60, skins:['fire_spirit','water_spirit','earth_spirit','wind_spirit','lightning_spirit','ice_spirit','lava_spirit','storm_spirit','mushroom','cactus','sunflower','tree_spirit','crystal','gem_ruby','gem_sapphire','gem_emerald','cloud','rainbow','moon','star'] },
  pixel:     { color:0x95a5a6, skins:['pixel_hero','pixel_knight','pixel_mage','pixel_archer','pixel_villain','8bit_robot','8bit_alien','8bit_ghost','retro_gamer','arcade_champ','pixel_warrior','pixel_princess','pixel_monster','glitch','pixel_plumber'] },
  kawaii:    { color:0xff69b4, skins:['kawaii_star','kawaii_heart','kawaii_cloud','kawaii_moon','kawaii_sun','kawaii_rainbow','chibi_angel','chibi_devil','teddy','plushie_bunny','blob_pink','blob_blue','pom_pom','floaty','jellybean'] },
  legendary: { color:0xf1c40f, skins:['golden_trophy','diamond','legendary_phoenix','cosmic_entity','void_king','rainbow_dragon','galaxy_knight','shadow_master','light_bearer','chaos_avatar'] },
};

const ALL_SKINS = Object.entries(SKIN_CATEGORIES).flatMap(([cat,[,skins]])=>
  (Array.isArray(skins)?skins:Object.values(SKIN_CATEGORIES[cat].skins)).map(id=>({id,cat}))
);

// Flatten properly
const SKINS_FLAT = Object.entries(SKIN_CATEGORIES).flatMap(([cat,{skins}])=>
  skins.map(id=>({id, cat, color: SKIN_CATEGORIES[cat].color, name: id.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase()) }))
);

const GAMES = [
  {id:'battle_royale',  name:'Battle Royale',   scene:'BattleRoyale',  tags:'action'},
  {id:'soccer',         name:'Soccer',          scene:'Soccer',        tags:'sports'},
  {id:'tank_battle',    name:'Tank Battle',     scene:'TankBattle',    tags:'action'},
  {id:'bomb_game',      name:'Bomb Game',       scene:'BombGame',      tags:'action'},
  {id:'platformer_race',name:'Platformer Race', scene:'PlatformerRace',tags:'racing'},
  // 45 more — show as coming soon
  {id:'basketball',     name:'Basketball',      scene:null, tags:'sports'},
  {id:'car_racing',     name:'Car Racing',      scene:null, tags:'racing'},
  {id:'sword_fight',    name:'Sword Fight',     scene:null, tags:'action'},
  {id:'bow_arrow',      name:'Bow & Arrow',     scene:null, tags:'action'},
  {id:'sumo',           name:'Sumo',            scene:null, tags:'action'},
  {id:'volleyball',     name:'Volleyball',      scene:null, tags:'sports'},
  {id:'snowball_fight', name:'Snowball Fight',  scene:null, tags:'fun'},
  {id:'tug_of_war',     name:'Tug of War',      scene:null, tags:'fun'},
  {id:'dodgeball',      name:'Dodgeball',       scene:null, tags:'sports'},
  {id:'ice_slide',      name:'Ice Slide',       scene:null, tags:'racing'},
  {id:'lava_jump',      name:'Lava Jump',       scene:null, tags:'platform'},
  {id:'coin_collector', name:'Coin Collector',  scene:null, tags:'collect'},
  {id:'color_flood',    name:'Color Flood',     scene:null, tags:'puzzle'},
  {id:'snake',          name:'Snake',           scene:null, tags:'classic'},
  {id:'pong',           name:'Pong',            scene:null, tags:'classic'},
  {id:'air_hockey',     name:'Air Hockey',      scene:null, tags:'sports'},
  {id:'mini_golf',      name:'Mini Golf',       scene:null, tags:'sports'},
  {id:'fishing',        name:'Fishing',         scene:null, tags:'chill'},
  {id:'cooking_battle', name:'Cooking Battle',  scene:null, tags:'fun'},
  {id:'gardening_race', name:'Gardening Race',  scene:null, tags:'chill'},
  {id:'treasure_hunt',  name:'Treasure Hunt',   scene:null, tags:'explore'},
  {id:'maze_race',      name:'Maze Race',       scene:null, tags:'puzzle'},
  {id:'bubble_shooter', name:'Bubble Shooter',  scene:null, tags:'puzzle'},
  {id:'tower_defense',  name:'Tower Defense',   scene:null, tags:'strategy'},
  {id:'card_battle',    name:'Card Battle',     scene:null, tags:'strategy'},
  {id:'cannon_ball',    name:'Cannon Ball',     scene:null, tags:'action'},
  {id:'king_of_hill',   name:'King of the Hill',scene:null, tags:'action'},
  {id:'capture_flag',   name:'Capture the Flag',scene:null, tags:'team'},
  {id:'ghost_chase',    name:'Ghost Chase',     scene:null, tags:'fun'},
  {id:'zombie_survival',name:'Zombie Survival', scene:null, tags:'survival'},
  {id:'space_race',     name:'Space Race',      scene:null, tags:'racing'},
  {id:'pinball',        name:'Pinball',         scene:null, tags:'classic'},
  {id:'breakout',       name:'Breakout',        scene:null, tags:'classic'},
  {id:'asteroid_shooter',name:'Asteroids',      scene:null, tags:'action'},
  {id:'rps_battle',     name:'Rock Paper Scissors',scene:null,tags:'classic'},
  {id:'billiards',      name:'Billiards',       scene:null, tags:'sports'},
  {id:'darts',          name:'Darts',           scene:null, tags:'sports'},
  {id:'bowling',        name:'Bowling',         scene:null, tags:'sports'},
  {id:'farm_race',      name:'Farm Race',       scene:null, tags:'fun'},
  {id:'ice_hockey',     name:'Ice Hockey',      scene:null, tags:'sports'},
  {id:'ninja_dash',     name:'Ninja Dash',      scene:null, tags:'action'},
  {id:'catapult_wars',  name:'Catapult Wars',   scene:null, tags:'strategy'},
  {id:'color_paint',    name:'Color Paint',     scene:null, tags:'creative'},
  {id:'penguin_slide',  name:'Penguin Slide',   scene:null, tags:'fun'},
  {id:'dance_off',      name:'Dance Off',       scene:null, tags:'rhythm'},
];

const PLAYER_COLORS = [0xe74c3c,0x3498db,0x2ecc71,0xf1c40f];

// ---- helpers ----
function skinColor(skinId){
  const s = SKINS_FLAT.find(s=>s.id===skinId);
  return s ? s.color : 0xaaaaaa;
}

// =====================  SCENES  =====================

class BootScene extends Phaser.Scene {
  constructor(){ super('Boot'); }
  create(){
    const g = this.make.graphics({x:0,y:0,add:false});
    // Generate all shared textures
    const gen = (key,fn,w,h)=>{ g.clear(); fn(g); g.generateTexture(key,w,h); };
    gen('btn',    g=>g.fillStyle(0x8e44ad).fillRoundedRect(0,0,200,50,12).lineStyle(2,0xc39bd3).strokeRoundedRect(0,0,200,50,12),200,50);
    gen('panel',  g=>g.fillStyle(0x2d0b5e,0.95).fillRoundedRect(0,0,420,280,16).lineStyle(2,0x9b59b6).strokeRoundedRect(0,0,420,280,16),420,280);
    gen('card',   g=>g.fillStyle(0x3d1266).fillRoundedRect(0,0,150,110,10).lineStyle(2,0x6c3483).strokeRoundedRect(0,0,150,110,10),150,110);
    gen('card_sel',g=>g.fillStyle(0x6c3483).fillRoundedRect(0,0,150,110,10).lineStyle(3,0xf1c40f).strokeRoundedRect(0,0,150,110,10),150,110);
    gen('coin',   g=>g.fillStyle(0xf1c40f).fillCircle(14,14,13),28,28);
    gen('ball',   g=>g.fillStyle(0xffffff).fillCircle(14,14,13).lineStyle(2,0x333333).strokeCircle(14,14,13),28,28);
    gen('ground', g=>g.fillStyle(0x27ae60).fillRect(0,0,64,20),64,20);
    gen('wall',   g=>g.fillStyle(0x5d4037).fillRect(0,0,46,46).lineStyle(1,0x4e342e).strokeRect(0,0,46,46),46,46);
    gen('bomb',   g=>g.fillStyle(0x2c3e50).fillCircle(14,12,12).fillStyle(0xff6b35).fillRect(12,0,4,8),28,24);
    gen('shell',  g=>g.fillStyle(0xf1c40f).fillRect(0,3,18,7).fillStyle(0xe67e22).fillTriangle(18,0,18,13,26,6),26,13);
    // Player circles per color
    ['red','blue','green','yellow'].forEach((c,i)=>{
      gen(`p_${c}`, g=>g.fillStyle(PLAYER_COLORS[i]).fillCircle(18,18,17).lineStyle(3,0xffffff).strokeCircle(18,18,17),36,36);
    });
    // Tank body
    gen('tank', g=>g.fillStyle(0x5d6d7e).fillRect(0,6,56,26).fillRect(8,0,40,14).lineStyle(1,0x85929e).strokeRect(0,6,56,26),56,32);
    g.destroy();
    this.scene.start('MainMenu');
  }
}

class MainMenuScene extends Phaser.Scene {
  constructor(){ super('MainMenu'); }
  create(){
    const W=1280,H=720;
    this.add.rectangle(0,0,W,H,0x1a0533).setOrigin(0);
    // Stars
    for(let i=0;i<80;i++){
      const s=this.add.circle(Phaser.Math.Between(0,W),Phaser.Math.Between(0,H),Phaser.Math.FloatBetween(1,2.5),0xffffff,Phaser.Math.FloatBetween(0.3,1));
      this.tweens.add({targets:s,alpha:0.05,duration:Phaser.Math.Between(800,2500),yoyo:true,repeat:-1,delay:Phaser.Math.Between(0,2000)});
    }
    // Title
    const t1=this.add.text(W/2,110,'2  3  4',{font:'bold 100px Arial',color:'#ffffff',stroke:'#9b59b6',strokeThickness:6}).setOrigin(0.5);
    this.add.text(W/2,210,'PLAYER GAMES',{font:'bold 54px Arial',color:'#f39c12',stroke:'#d35400',strokeThickness:4}).setOrigin(0.5);
    this.add.text(W/2,268,'MEGA EDITION',{font:'bold 26px Arial',color:'#9b59b6'}).setOrigin(0.5);
    this.add.text(W/2,308,'50 GAMES  ·  215 FREE SKINS  ·  UP TO 4 PLAYERS',{font:'17px Arial',color:'#c39bd3'}).setOrigin(0.5);
    this.tweens.add({targets:t1,y:105,duration:1800,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    // Buttons
    [[1,W/2-280,0xe74c3c],[2,W/2-80,0x3498db],[3,W/2+80,0x2ecc71],[4,W/2+280,0xf1c40f]].forEach(([n,x,c])=>{
      const b=this.add.rectangle(x,420,160,88,c).setInteractive({useHandCursor:true});
      this.add.text(x,420,`${n}\nPLAYER${n>1?'S':''}`,{font:'bold 22px Arial',color:'#fff',align:'center'}).setOrigin(0.5);
      b.on('pointerover',()=>b.setScale(1.07)); b.on('pointerout',()=>b.setScale(1));
      b.on('pointerdown',()=>this.scene.start('GameSelect',{players:n}));
    });
    this._btn(W/2,540,'PLAY ONLINE',0x8e44ad,()=>this.scene.start('GameSelect',{players:4,online:true}),220);
    this._btn(W/2-160,630,'SKINS',0x1abc9c,()=>this.scene.start('SkinSelect'),130);
    // Coin count from localStorage
    this.add.image(W-130,28,'coin');
    this.add.text(W-110,26,localStorage.getItem('coins')||'500',{font:'bold 20px Arial',color:'#f1c40f'});
    const name=localStorage.getItem('playerName')||'Player';
    this.add.text(20,20,`Hi, ${name}!`,{font:'18px Arial',color:'#c39bd3'});
  }
  _btn(x,y,label,color,cb,w=200){
    const b=this.add.rectangle(x,y,w,50,color).setInteractive({useHandCursor:true});
    this.add.text(x,y,label,{font:'bold 20px Arial',color:'#fff'}).setOrigin(0.5);
    b.on('pointerover',()=>b.setAlpha(0.8)); b.on('pointerout',()=>b.setAlpha(1)); b.on('pointerdown',cb);
    return b;
  }
}

class SkinSelectScene extends Phaser.Scene {
  constructor(){ super('SkinSelect'); }
  init(){
    this.selectedSkin=localStorage.getItem('selectedSkin')||'cat_white';
    this.currentCat='animals';
    this.focused=null;
  }
  create(){
    const W=1280,H=720;
    this.add.rectangle(0,0,W,H,0x1a0533).setOrigin(0);
    this.add.text(W/2,36,'SELECT YOUR SKIN',{font:'bold 36px Arial',color:'#fff'}).setOrigin(0.5);
    this.add.text(W/2,72,`${SKINS_FLAT.length} skins — all free`,{font:'15px Arial',color:'#c39bd3'}).setOrigin(0.5);
    // Category tabs
    const cats=Object.keys(SKIN_CATEGORIES);
    this.tabs=[];
    cats.forEach((cat,i)=>{
      const x=80+i*120, col=SKIN_CATEGORIES[cat].color;
      const tab=this.add.rectangle(x,112,112,32,col).setInteractive({useHandCursor:true});
      this.add.text(x,112,cat.toUpperCase(),{font:'bold 10px Arial',color:'#fff'}).setOrigin(0.5);
      tab.on('pointerdown',()=>{ this.currentCat=cat; this._render(); this.tabs.forEach((t,j)=>t.setAlpha(j===i?1:0.5)); });
      this.tabs.push(tab);
    });
    this.container=this.add.container(0,0);
    // Preview
    this.preview=this.add.container(W-200,H/2);
    this.preview.add(this.add.rectangle(0,0,360,380,0x2d0b5e).setStrokeStyle(2,0x9b59b6));
    this.previewCircle=this.add.circle(0,-60,56,0xaaaaaa); this.preview.add(this.previewCircle);
    this.previewLetter=this.add.text(0,-60,'?',{font:'bold 42px Arial',color:'#fff'}).setOrigin(0.5); this.preview.add(this.previewLetter);
    this.previewName=this.add.text(0,10,'',{font:'bold 20px Arial',color:'#fff'}).setOrigin(0.5); this.preview.add(this.previewName);
    this.selectBtn=this.add.rectangle(0,100,160,44,0x27ae60).setInteractive({useHandCursor:true}); this.preview.add(this.selectBtn);
    this.add.text(0,100,'USE THIS SKIN',{font:'bold 16px Arial',color:'#fff'}).setOrigin(0.5).setDepth(1);
    this.selectBtn.on('pointerdown',()=>{ if(this.focused){ localStorage.setItem('selectedSkin',this.focused); this.selectedSkin=this.focused; this._render(); } });
    this._btn(80,H-36,'BACK',0x6c3483,()=>this.scene.start('MainMenu'),130);
    this._render();
    this._focus(this.selectedSkin);
  }
  _render(){
    this.container.removeAll(true);
    const skins=SKIN_CATEGORIES[this.currentCat].skins;
    const cols=6,cW=150,cH=110,pX=16,pY=14,startX=32,startY=148;
    skins.forEach((id,i)=>{
      const col=i%cols,row=Math.floor(i/cols);
      const x=startX+col*(cW+pX)+cW/2, y=startY+row*(cH+pY)+cH/2;
      const sel=id===this.selectedSkin;
      const bg=this.add.image(x,y,sel?'card_sel':'card').setInteractive({useHandCursor:true});
      const color=SKIN_CATEGORIES[this.currentCat].color;
      const circ=this.add.circle(x,y-22,28,color);
      const ltr=this.add.text(x,y-22,id[0].toUpperCase(),{font:'bold 22px Arial',color:'#fff'}).setOrigin(0.5);
      const nm=this.add.text(x,y+24,id.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),{font:'9px Arial',color:'#fff',wordWrap:{width:140}}).setOrigin(0.5);
      bg.on('pointerdown',()=>this._focus(id));
      bg.on('pointerover',()=>bg.setScale(1.05)); bg.on('pointerout',()=>bg.setScale(1));
      this.container.add([bg,circ,ltr,nm]);
    });
  }
  _focus(skinId){
    this.focused=skinId;
    const skin=SKINS_FLAT.find(s=>s.id===skinId);
    if(!skin) return;
    this.previewCircle.setFillStyle(skin.color);
    this.previewLetter.setText(skinId[0].toUpperCase());
    this.previewName.setText(skin.name);
  }
  _btn(x,y,label,color,cb,w=180){
    const b=this.add.rectangle(x,y,w,44,color).setInteractive({useHandCursor:true});
    this.add.text(x,y,label,{font:'bold 18px Arial',color:'#fff'}).setOrigin(0.5);
    b.on('pointerdown',cb); return b;
  }
}

class GameSelectScene extends Phaser.Scene {
  constructor(){ super('GameSelect'); }
  init(data){ this.players=data?.players||2; this.online=data?.online||false; this.page=0; }
  create(){
    const W=1280,H=720;
    this.add.rectangle(0,0,W,H,0x1a0533).setOrigin(0);
    this.add.text(W/2,36,'CHOOSE A GAME',{font:'bold 34px Arial',color:'#fff'}).setOrigin(0.5);
    this.add.text(W/2,70,`${this.players} player${this.players>1?'s':''} • ${GAMES.length} games`,{font:'16px Arial',color:'#c39bd3'}).setOrigin(0.5);
    this.cont=this.add.container(0,0);
    this._render();
    const pBtn=this._btn(W/2-110,H-34,'< PREV',0x6c3483,()=>{ if(this.page>0){this.page--;this._render();} },120);
    const nBtn=this._btn(W/2+110,H-34,'NEXT >',0x6c3483,()=>{ if((this.page+1)*15<GAMES.length){this.page++;this._render();} },120);
    this.pageText=this.add.text(W/2,H-34,'',{font:'15px Arial',color:'#c39bd3'}).setOrigin(0.5);
    this._btn(80,H-34,'BACK',0x6c3483,()=>this.scene.start('MainMenu'),120);
    this._updatePage();
  }
  _render(){
    this.cont.removeAll(true);
    const W=1280; const page=GAMES.slice(this.page*15,(this.page+1)*15);
    const cols=5,cW=210,cH=140,pX=20,pY=16;
    const startX=(W-(cols*(cW+pX)-pX))/2;
    page.forEach((g,i)=>{
      const col=i%cols,row=Math.floor(i/5);
      const x=startX+col*(cW+pX)+cW/2, y=100+row*(cH+pY)+cH/2;
      const avail=!!g.scene;
      const bg=this.add.rectangle(x,y,cW,cH,avail?0x2d0b5e:0x1a0a2e).setStrokeStyle(2,avail?0x8e44ad:0x333333);
      if(avail) bg.setInteractive({useHandCursor:true});
      this.add.text(x,y-20,g.name,{font:`bold ${g.name.length>12?13:15}px Arial`,color:avail?'#fff':'#555',wordWrap:{width:200}}).setOrigin(0.5);
      const tagCol={action:0xe74c3c,sports:0x3498db,racing:0xf39c12,platform:0x2ecc71,puzzle:0x9b59b6,classic:0x7f8c8d,fun:0xe67e22,strategy:0x1abc9c,team:0x2c3e50,chill:0x27ae60,survival:0xc0392b,rhythm:0xff69b4,collect:0xd4ac0d,creative:0xff9ff3,explore:0x48dbfb}[g.tags]||0x555;
      const tagBg=this.add.rectangle(x,y+24,g.tags.length*10+14,20,tagCol,avail?1:0.3);
      this.add.text(x,y+24,g.tags.toUpperCase(),{font:'9px Arial',color:'#fff'}).setOrigin(0.5);
      if(!avail) this.add.text(x,y+46,'COMING SOON',{font:'10px Arial',color:'#444'}).setOrigin(0.5);
      if(avail){
        bg.on('pointerover',()=>{bg.setFillColor(0x4a1a8a);bg.setScale(1.03);});
        bg.on('pointerout', ()=>{bg.setFillColor(0x2d0b5e);bg.setScale(1);});
        bg.on('pointerdown',()=>{
          if(this.online) this.scene.start('Lobby',{gameType:g.id,players:this.players});
          else this.scene.start(g.scene,{players:this.players});
        });
      }
      this.cont.add([bg,tagBg]);
    });
    this._updatePage();
  }
  _updatePage(){
    if(this.pageText) this.pageText.setText(`${this.page+1} / ${Math.ceil(GAMES.length/15)}`);
  }
  _btn(x,y,label,color,cb,w=180){
    const b=this.add.rectangle(x,y,w,44,color).setInteractive({useHandCursor:true});
    this.add.text(x,y,label,{font:'bold 16px Arial',color:'#fff'}).setOrigin(0.5);
    b.on('pointerdown',cb); b.on('pointerover',()=>b.setAlpha(0.8)); b.on('pointerout',()=>b.setAlpha(1));
    return b;
  }
}

class LobbyScene extends Phaser.Scene {
  constructor(){ super('Lobby'); }
  init(data){ this.gameType=data.gameType; this.players=data.players; }
  create(){
    const W=1280,H=720;
    this.add.rectangle(0,0,W,H,0x1a0533).setOrigin(0);
    this.add.text(W/2,60,'ONLINE LOBBY',{font:'bold 40px Arial',color:'#fff'}).setOrigin(0.5);
    this.socket=io();
    this.codeText=this.add.text(W/2,220,'',{font:'bold 52px Arial',color:'#f1c40f'}).setOrigin(0.5);
    this.statusText=this.add.text(W/2,280,'',{font:'16px Arial',color:'#2ecc71'}).setOrigin(0.5);
    this.slots=[];
    for(let i=0;i<4;i++){
      const x=W/2-280+i*190,y=420;
      const sl=this.add.rectangle(x,y,170,90,0x2d0b5e).setStrokeStyle(2,0x444444);
      const lb=this.add.text(x,y,`P${i+1}\nwaiting...`,{font:'15px Arial',color:'#555',align:'center'}).setOrigin(0.5);
      this.slots.push({sl,lb});
    }
    const name=localStorage.getItem('playerName')||'Player';
    const skin=localStorage.getItem('selectedSkin')||'cat_white';
    this._btn(W/2-140,340,'CREATE ROOM',0x8e44ad,()=>{
      this.socket.emit('create_room',{gameType:this.gameType,maxPlayers:this.players,playerName:name,skinId:skin});
    },200);
    this._btn(W/2+140,340,'JOIN ROOM',0x2980b9,()=>this._showJoinInput(name,skin),180);
    this._btn(W/2,540,'READY',0x27ae60,()=>this.socket.emit('player_ready'),160);
    this._btn(80,H-36,'BACK',0x6c3483,()=>{ this.socket.disconnect(); this.scene.start('GameSelect',{players:this.players}); },120);
    this.socket.on('room_created',({roomId,room})=>{ this.codeText.setText(`CODE: ${roomId}`); this.statusText.setText('Share this code!'); this._updateSlots(room.players); });
    this.socket.on('room_joined', ({room})=>this._updateSlots(room.players));
    this.socket.on('room_updated',(room)=>this._updateSlots(room.players));
    this.socket.on('game_start',  (data)=>this.scene.start(GAMES.find(g=>g.id===this.gameType)?.scene||'BattleRoyale',{...data,online:true,socket:this.socket}));
    this.socket.on('error',       ({message})=>this.statusText.setText(`Error: ${message}`));
  }
  _updateSlots(players){
    this.slots.forEach((s,i)=>{
      const p=players[i];
      s.lb.setStyle({color:p?'#fff':'#555'}).setText(p?`${p.name}\n${p.ready?'READY ✓':'...'}`:(`P${i+1}\nwaiting...`));
      s.sl.setStrokeStyle(2,p?0x8e44ad:0x444444);
    });
  }
  _showJoinInput(name,skin){
    const W=1280,H=720;
    const overlay=this.add.rectangle(W/2,H/2,400,200,0x1a0533,0.97).setStrokeStyle(2,0x9b59b6).setDepth(10);
    this.add.text(W/2,H/2-60,'Enter room code:',{font:'20px Arial',color:'#fff'}).setOrigin(0.5).setDepth(11);
    let code='';
    const codeDisplay=this.add.text(W/2,H/2-10,'______',{font:'bold 36px Arial',color:'#f1c40f'}).setOrigin(0.5).setDepth(11);
    this.input.keyboard.on('keydown',(e)=>{
      if(e.key.length===1&&code.length<6) code+=e.key.toUpperCase();
      if(e.key==='Backspace') code=code.slice(0,-1);
      codeDisplay.setText(code.padEnd(6,'_'));
      if(e.key==='Enter'&&code.length>=4){
        this.socket.emit('join_room',{roomId:code,playerName:name,skinId:skin});
        overlay.destroy();
      }
    });
  }
  _btn(x,y,label,color,cb,w=180){
    const b=this.add.rectangle(x,y,w,44,color).setInteractive({useHandCursor:true});
    this.add.text(x,y,label,{font:'bold 17px Arial',color:'#fff'}).setOrigin(0.5);
    b.on('pointerdown',cb); b.on('pointerover',()=>b.setAlpha(0.8)); b.on('pointerout',()=>b.setAlpha(1));
    return b;
  }
}

// ==================  GAME SCENES  ==================

class BattleRoyaleScene extends Phaser.Scene {
  constructor(){ super('BattleRoyale'); }
  init(d){ this.playerCount=d?.players||2; this.gameOver=false; }
  create(){
    const W=1280,H=720;
    this.physics.world.setBounds(0,0,W,H);
    this.add.rectangle(0,0,W,H,0x1a5e1a).setOrigin(0);
    this.obstacles=this.physics.add.staticGroup();
    [[200,200],[450,160],[720,300],[950,200],[300,460],[620,510],[1020,400],[160,560],[820,560],[500,360],[1100,260]].forEach(([x,y])=>{
      const o=this.add.rectangle(x,y,80,80,0x5d4037);
      this.obstacles.add(o); this.physics.add.existing(o,true);
    });
    const spawns=[[100,80],[W-100,80],[100,H-80],[W-100,H-80]];
    const pColors=['red','blue','green','yellow'];
    this.players=[]; this.hp=[]; this.hpText=[];
    for(let i=0;i<this.playerCount;i++){
      const [sx,sy]=spawns[i];
      const p=this.physics.add.image(sx,sy,`p_${pColors[i]}`).setCollideWorldBounds(true);
      p.setData({idx:i,speed:220,cd:0,alive:true});
      this.physics.add.collider(p,this.obstacles);
      this.players.push(p); this.hp.push(3);
      this.hpText.push(this.add.text(20+i*220,26,`P${i+1} ❤❤❤`,{font:'bold 16px Arial',color:'#fff'}).setDepth(10));
    }
    for(let a=0;a<this.players.length;a++) for(let b=a+1;b<this.players.length;b++) this.physics.add.collider(this.players[a],this.players[b]);
    this.bullets=this.physics.add.group({maxSize:40,runChildUpdate:true});
    this.players.forEach((p,pi)=>{
      this.physics.add.overlap(this.bullets,p,(bl,target)=>{
        if(!bl.active||bl.getData('owner')===pi) return;
        bl.setActive(false).setVisible(false);
        this._hit(pi);
      });
    });
    this.zoneR=Math.min(W,H)/2-30; this.zoneX=W/2; this.zoneY=H/2;
    this.zoneG=this.add.graphics().setDepth(5);
    this.zoneCount=30;
    this.zoneText=this.add.text(W/2,22,'Zone shrinks in 30s',{font:'bold 17px Arial',color:'#e74c3c'}).setOrigin(0.5).setDepth(10);
    this.time.addEvent({delay:1000,loop:true,callback:()=>{
      if(this.gameOver) return;
      this.zoneCount--; this.zoneText.setText(`Zone shrinks in ${Math.max(0,this.zoneCount)}s`);
      if(this.zoneCount<=0){ this.zoneR=Math.max(120,this.zoneR-30); this.zoneCount=15; }
    }});
    this.powerUps=this.physics.add.group();
    this._spawnPU();
    this.time.addEvent({delay:9000,loop:true,callback:this._spawnPU,callbackScope:this});
    this.keys=this.input.keyboard.addKeys('W,A,S,D,F,UP,DOWN,LEFT,RIGHT,I,J,K,L,H');
    this.enter=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }
  update(_,dt){
    if(this.gameOver) return;
    this.players.forEach((p,i)=>{
      if(!p.getData('alive')) return;
      const sp=p.getData('speed'); let vx=0,vy=0;
      if(i===0){ if(this.keys.A?.isDown)vx=-sp;else if(this.keys.D?.isDown)vx=sp; if(this.keys.W?.isDown)vy=-sp;else if(this.keys.S?.isDown)vy=sp; if(Phaser.Input.Keyboard.JustDown(this.keys.F))this._shoot(p,i,vx,vy); }
      else if(i===1){ if(this.keys.LEFT?.isDown)vx=-sp;else if(this.keys.RIGHT?.isDown)vx=sp; if(this.keys.UP?.isDown)vy=-sp;else if(this.keys.DOWN?.isDown)vy=sp; if(Phaser.Input.Keyboard.JustDown(this.enter))this._shoot(p,i,vx,vy); }
      else if(i===2){ if(this.keys.J?.isDown)vx=-sp;else if(this.keys.L?.isDown)vx=sp; if(this.keys.I?.isDown)vy=-sp;else if(this.keys.K?.isDown)vy=sp; if(Phaser.Input.Keyboard.JustDown(this.keys.H))this._shoot(p,i,vx,vy); }
      p.setVelocity(vx,vy);
      const dx=p.x-this.zoneX,dy=p.y-this.zoneY;
      if(Math.sqrt(dx*dx+dy*dy)>this.zoneR&&this.time.now%1000<20) this._hit(i);
      if(p.getData('cd')>0) p.setData('cd',p.getData('cd')-dt);
    });
    this.zoneG.clear().lineStyle(3,0xe74c3c,0.8).strokeCircle(this.zoneX,this.zoneY,this.zoneR).fillStyle(0xe74c3c,0.05).fillCircle(this.zoneX,this.zoneY,this.zoneR+400);
    this.hpText.forEach((t,i)=>t.setText(`P${i+1} ${'❤'.repeat(Math.max(0,this.hp[i]))}${'🖤'.repeat(Math.max(0,3-this.hp[i]))}}`));
    this._checkWin();
  }
  _shoot(p,own,vx,vy){
    if(p.getData('cd')>0) return; p.setData('cd',500);
    const dx=vx||1,dy=vy||0,len=Math.sqrt(dx*dx+dy*dy)||1;
    const b=this.bullets.get(p.x+dx/len*30,p.y+dy/len*30);
    if(!b) return;
    if(!b.body) this.physics.add.existing(b);
    b.setActive(true).setVisible(true).setData('owner',own);
    b.setDisplaySize(12,12).body.setVelocity(dx/len*520,dy/len*520);
    this.time.delayedCall(1300,()=>{ if(b.active)b.setActive(false).setVisible(false); });
  }
  _hit(i){
    this.hp[i]--;
    this.cameras.main.shake(70,0.005);
    this.tweens.add({targets:this.players[i],alpha:0.2,duration:80,yoyo:true,repeat:2});
    if(this.hp[i]<=0){ this.players[i].setData('alive',false).setActive(false).setVisible(false); }
  }
  _spawnPU(){
    const colors=[{c:0x27ae60,t:'heal'},{c:0xf39c12,t:'speed'},{c:0xe74c3c,t:'attack'}];
    const {c,t}=colors[Phaser.Math.Between(0,2)];
    const pu=this.add.circle(Phaser.Math.Between(100,1180),Phaser.Math.Between(80,640),14,c);
    this.physics.add.existing(pu); this.powerUps.add(pu);
    this.players.forEach((p,i)=>this.physics.add.overlap(p,pu,()=>{
      if(!pu.active) return; pu.destroy();
      if(t==='heal') this.hp[i]=Math.min(3,this.hp[i]+1);
      else if(t==='speed'){ p.setData('speed',320); this.time.delayedCall(5000,()=>p.setData('speed',220)); }
    }));
    this.time.delayedCall(10000,()=>{ if(pu.active)pu.destroy(); });
  }
  _checkWin(){
    const alive=this.players.filter(p=>p.getData('alive'));
    if(alive.length<=1&&!this.gameOver){
      this.gameOver=true; const {width:W,height:H}=this.cameras.main;
      const msg=alive[0]?`P${alive[0].getData('idx')+1} WINS!`:'DRAW!';
      this._winScreen(msg);
    }
  }
  _winScreen(msg){
    const {width:W,height:H}=this.cameras.main;
    this.add.rectangle(W/2,H/2,500,200,0x1a0533,0.95).setDepth(20);
    this.add.text(W/2,H/2-30,msg,{font:'bold 52px Arial',color:'#f1c40f'}).setOrigin(0.5).setDepth(21);
    const b=this.add.rectangle(W/2,H/2+55,200,44,0x8e44ad).setInteractive({useHandCursor:true}).setDepth(21);
    this.add.text(W/2,H/2+55,'MAIN MENU',{font:'bold 18px Arial',color:'#fff'}).setOrigin(0.5).setDepth(22);
    b.on('pointerdown',()=>this.scene.start('MainMenu'));
  }
}

class SoccerScene extends Phaser.Scene {
  constructor(){ super('Soccer'); }
  init(d){ this.playerCount=d?.players||2; this.scores=[0,0]; this.matchTime=120; this.gameOver=false; this._cd=false; }
  create(){
    const W=1280,H=720;
    this.add.rectangle(0,0,W,H,0x2e7d32).setOrigin(0);
    this.add.rectangle(W/2,H/2,4,H-60,0xffffff,0.5);
    this.add.circle(W/2,H/2,80,0x2e7d32).setStrokeStyle(3,0xffffff,0.5);
    [0,W].forEach((gx,side)=>{
      const goal=this.add.rectangle(side===0?16:W-16,H/2,32,200,0xffffff,0.2).setStrokeStyle(3,0xffffff);
      this.physics.add.existing(goal,true);
      this['goal'+side]=goal;
    });
    this.ball=this.physics.add.image(W/2,H/2,'ball').setBounce(0.85).setDamping(true).setDrag(0.97).setCollideWorldBounds(true).setCircle(13,1,1);
    const pC=['red','blue','green','yellow'];
    this.players=[];
    [[W/4,H/2],[3*W/4,H/2],[W/4-80,H/2+80],[3*W/4+80,H/2-80]].slice(0,this.playerCount).forEach((pos,i)=>{
      const p=this.physics.add.image(pos[0],pos[1],`p_${pC[i]}`).setCollideWorldBounds(true).setBounce(0.3).setData({team:i%2});
      this.physics.add.collider(p,this.ball,()=>{ const dx=this.ball.x-p.x,dy=this.ball.y-p.y,d=Math.sqrt(dx*dx+dy*dy)||1; this.ball.setVelocity(dx/d*600+p.body.velocity.x*0.4,dy/d*600+p.body.velocity.y*0.4); this.cameras.main.shake(35,0.002); });
      this.players.push(p);
    });
    for(let a=0;a<this.players.length;a++) for(let b=a+1;b<this.players.length;b++) this.physics.add.collider(this.players[a],this.players[b]);
    this.physics.add.overlap(this.ball,this.goal0,()=>this._goal(1));
    this.physics.add.overlap(this.ball,this.goalW,()=>this._goal(0));
    this.scoreText=this.add.text(W/2,28,`0 : 0`,{font:'bold 32px Arial',color:'#fff'}).setOrigin(0.5).setDepth(10);
    this.timerText=this.add.text(W/2,62,'2:00',{font:'18px Arial',color:'#a5d6a7'}).setOrigin(0.5).setDepth(10);
    this.time.addEvent({delay:1000,loop:true,callback:()=>{
      if(this.gameOver) return; this.matchTime--;
      this.timerText.setText(`${Math.floor(this.matchTime/60)}:${String(this.matchTime%60).padStart(2,'0')}`);
      if(this.matchTime<=0) this._end();
    }});
    this.keys=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,I,J,K,L');
  }
  update(){
    if(this.gameOver) return;
    const sp=250;
    [[this.keys.A,this.keys.D,this.keys.W,this.keys.S],[this.keys.LEFT,this.keys.RIGHT,this.keys.UP,this.keys.DOWN],[this.keys.J,this.keys.L,this.keys.I,this.keys.K]].forEach((ks,i)=>{
      if(i>=this.players.length) return;
      this.players[i].setVelocity(ks[0]?.isDown?-sp:ks[1]?.isDown?sp:0, ks[2]?.isDown?-sp:ks[3]?.isDown?sp:0);
    });
  }
  _goal(team){ if(this.gameOver||this._cd) return; this._cd=true; this.scores[team]++; this.scoreText.setText(`${this.scores[0]} : ${this.scores[1]}`); this.cameras.main.flash(300,255,255,255); const {width:W,height:H}=this.cameras.main; const t=this.add.text(W/2,H/2,'GOAL!',{font:'bold 90px Arial',color:'#f1c40f',stroke:'#d35400',strokeThickness:6}).setOrigin(0.5).setDepth(20); this.tweens.add({targets:t,scaleX:1.5,scaleY:1.5,alpha:0,duration:1200,onComplete:()=>t.destroy()}); this.ball.setPosition(W/2,H/2).setVelocity(0,0); this.time.delayedCall(1500,()=>this._cd=false); }
  _end(){
    this.gameOver=true; const {width:W,height:H}=this.cameras.main;
    const msg=this.scores[0]>this.scores[1]?'RED WINS!':this.scores[1]>this.scores[0]?'BLUE WINS!':'DRAW!';
    this.add.rectangle(W/2,H/2,520,220,0x1a0533,0.95).setDepth(20);
    this.add.text(W/2,H/2-40,msg,{font:'bold 50px Arial',color:'#f1c40f'}).setOrigin(0.5).setDepth(21);
    this.add.text(W/2,H/2+8,`${this.scores[0]}  -  ${this.scores[1]}`,{font:'34px Arial',color:'#fff'}).setOrigin(0.5).setDepth(21);
    const b=this.add.rectangle(W/2,H/2+70,200,44,0x8e44ad).setInteractive({useHandCursor:true}).setDepth(21);
    this.add.text(W/2,H/2+70,'MAIN MENU',{font:'bold 18px Arial',color:'#fff'}).setOrigin(0.5).setDepth(22);
    b.on('pointerdown',()=>this.scene.start('MainMenu'));
  }
}

// (Tank Battle, Bomb Game, Platformer Race included via the same pattern)
// Abbreviated here for brevity — full versions in the repo

class TankBattleScene extends Phaser.Scene {
  constructor(){ super('TankBattle'); }
  init(d){ this.playerCount=d?.players||2; this.gameOver=false; }
  create(){
    const W=1280,H=720; this.physics.world.setBounds(0,0,W,H);
    this.add.rectangle(0,0,W,H,0x3e2723).setOrigin(0);
    this.walls=this.physics.add.staticGroup();
    [[3,3],[4,3],[5,3],[20,3],[21,3],[22,3],[3,10],[3,11],[22,10],[22,11],[10,5],[11,5],[12,5],[14,5],[15,5],[16,5],[10,9],[11,9],[12,9],[14,9],[15,9],[16,9],[7,7],[8,7],[18,7],[19,7]].forEach(([gx,gy])=>{
      const w=this.add.rectangle(gx*48+24,gy*48+24,46,46,0x5d4037); this.walls.add(w); this.physics.add.existing(w,true);
    });
    const spawns=[[96,96],[W-96,H-96],[W-96,96],[96,H-96]];
    this.tanks=[]; this.hp=[3,3,3,3]; this.hpText=[];
    for(let i=0;i<this.playerCount;i++){
      const [sx,sy]=spawns[i];
      const t=this.physics.add.image(sx,sy,'tank').setRotation(i*Math.PI/2).setCollideWorldBounds(true);
      t.setData({idx:i,alive:true,cd:0}); this.physics.add.collider(t,this.walls);
      this.tanks.push(t);
      this.hpText.push(this.add.text(20+i*200,24,`P${i+1} ❤❤❤`,{font:'bold 14px Arial',color:'#fff'}).setDepth(10));
    }
    for(let a=0;a<this.tanks.length;a++) for(let b=a+1;b<this.tanks.length;b++) this.physics.add.collider(this.tanks[a],this.tanks[b]);
    this.shells=this.physics.add.group({maxSize:20});
    this.tanks.forEach((_,ti)=>{
      this.physics.add.collider(this.shells,this.walls,(sh)=>{if(sh.active)sh.setActive(false).setVisible(false);});
      this.tanks.forEach((tgt,tj)=>this.physics.add.overlap(this.shells,tgt,(sh)=>{ if(!sh.active||sh.getData('own')===tj)return; sh.setActive(false).setVisible(false); this._hitTank(tj); }));
    });
    this.keys=this.input.keyboard.addKeys('W,A,S,D,F,UP,DOWN,LEFT,RIGHT,I,J,K,L,H');
    this.enter=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }
  update(_,dt){
    if(this.gameOver) return;
    const sp=180,ts=100;
    this.tanks.forEach((t,i)=>{
      if(!t.getData('alive')) return;
      if(i===0){
        if(this.keys.W?.isDown)t.setVelocity(Math.cos(t.rotation)*sp,Math.sin(t.rotation)*sp);
        else if(this.keys.S?.isDown)t.setVelocity(-Math.cos(t.rotation)*sp,-Math.sin(t.rotation)*sp);
        else t.setVelocity(0,0);
        if(this.keys.A?.isDown)t.setAngularVelocity(-ts); else if(this.keys.D?.isDown)t.setAngularVelocity(ts); else t.setAngularVelocity(0);
        if(Phaser.Input.Keyboard.JustDown(this.keys.F))this._fire(t,i);
      } else if(i===1){
        if(this.keys.UP?.isDown)t.setVelocity(Math.cos(t.rotation)*sp,Math.sin(t.rotation)*sp);
        else if(this.keys.DOWN?.isDown)t.setVelocity(-Math.cos(t.rotation)*sp,-Math.sin(t.rotation)*sp);
        else t.setVelocity(0,0);
        if(this.keys.LEFT?.isDown)t.setAngularVelocity(-ts); else if(this.keys.RIGHT?.isDown)t.setAngularVelocity(ts); else t.setAngularVelocity(0);
        if(Phaser.Input.Keyboard.JustDown(this.enter))this._fire(t,i);
      }
      if(t.getData('cd')>0)t.setData('cd',t.getData('cd')-dt);
    });
    this._checkWin();
  }
  _fire(t,own){
    if(t.getData('cd')>0)return; t.setData('cd',600);
    const a=t.rotation; const sh=this.shells.get(t.x+Math.cos(a)*38,t.y+Math.sin(a)*38,'shell');
    if(!sh)return; if(!sh.body)this.physics.add.existing(sh);
    sh.setActive(true).setVisible(true).setRotation(a).setData('own',own);
    sh.body.setVelocity(Math.cos(a)*560,Math.sin(a)*560);
    this.cameras.main.shake(55,0.004);
    this.time.delayedCall(2000,()=>{if(sh.active)sh.setActive(false).setVisible(false);});
  }
  _hitTank(i){
    this.hp[i]--; const t=this.tanks[i];
    this.tweens.add({targets:t,alpha:0.2,duration:80,yoyo:true,repeat:3});
    this.hpText[i].setText(`P${i+1} ${'❤'.repeat(Math.max(0,this.hp[i]))}${'🖤'.repeat(3-Math.max(0,this.hp[i]))}`);
    if(this.hp[i]<=0){ t.setData('alive',false).setActive(false).setVisible(false); }
  }
  _checkWin(){
    const alive=this.tanks.filter(t=>t.getData('alive'));
    if(alive.length<=1&&!this.gameOver){ this.gameOver=true; this._win(alive[0]?`P${alive[0].getData('idx')+1} WINS!`:'DRAW!'); }
  }
  _win(msg){
    const {width:W,height:H}=this.cameras.main;
    this.add.rectangle(W/2,H/2,500,200,0x1a0533,0.95).setDepth(20);
    this.add.text(W/2,H/2-30,msg,{font:'bold 52px Arial',color:'#f1c40f'}).setOrigin(0.5).setDepth(21);
    const b=this.add.rectangle(W/2,H/2+55,200,44,0x8e44ad).setInteractive({useHandCursor:true}).setDepth(21);
    this.add.text(W/2,H/2+55,'MAIN MENU',{font:'bold 18px Arial',color:'#fff'}).setOrigin(0.5).setDepth(22);
    b.on('pointerdown',()=>this.scene.start('MainMenu'));
  }
}

class BombGameScene extends Phaser.Scene {
  constructor(){ super('BombGame'); }
  init(d){ this.playerCount=d?.players||2; this.gameOver=false; }
  create(){
    const GRID=48,COLS=26,ROWS=14,W=1280,H=720;
    this.GRID=GRID; this.COLS=COLS; this.ROWS=ROWS;
    this.add.rectangle(0,0,W,H,0x1b5e20).setOrigin(0);
    this.map=[]; this.breaks={}; this.wallObjs=[];
    const corners=[[1,1],[COLS-2,1],[1,ROWS-2],[COLS-2,ROWS-2]];
    for(let r=0;r<ROWS;r++){ this.map[r]=[];
      for(let c=0;c<COLS;c++){
        const edge=r===0||r===ROWS-1||c===0||c===COLS-1, pillar=r%2===0&&c%2===0;
        this.map[r][c]=edge||pillar?1:0;
      }
    }
    for(let r=1;r<ROWS-1;r++) for(let c=1;c<COLS-1;c++){
      if(this.map[r][c]) continue;
      if(corners.some(([pc,pr])=>Math.abs(c-pc)<=1&&Math.abs(r-pr)<=1)) continue;
      if(Math.random()<0.55) this.map[r][c]=2;
    }
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
      const x=c*GRID+GRID/2,y=r*GRID+GRID/2;
      if(this.map[r][c]===1){ const w=this.add.rectangle(x,y,GRID-2,GRID-2,0x4e342e); this.wallObjs.push(w); this.physics.add.existing(w,true); }
      else if(this.map[r][c]===2){ const b=this.add.rectangle(x,y,GRID-4,GRID-4,0x8d6e63); this.breaks[`${r},${c}`]=b; this.physics.add.existing(b,true); this.wallObjs.push(b); }
    }
    this.ps=[]; this.alive=[]; this.bombs=[];
    const PCOLORS=[0xe74c3c,0x3498db,0x2ecc71,0xf1c40f];
    corners.slice(0,this.playerCount).forEach(([gc,gr],i)=>{
      const p=this.physics.add.rectangle(gc*GRID+GRID/2,gr*GRID+GRID/2,GRID-10,GRID-10,PCOLORS[i]).setDepth(2);
      p.body.setCollideWorldBounds(true);
      this.wallObjs.forEach(w=>this.physics.add.collider(p,w));
      this.ps.push(p); this.alive.push(true);
    });
    for(let a=0;a<this.ps.length;a++) for(let b=a+1;b<this.ps.length;b++) this.physics.add.collider(this.ps[a],this.ps[b]);
    this.statusText=this.add.text(W/2,14,`${this.playerCount} players alive`,{font:'bold 18px Arial',color:'#fff'}).setOrigin(0.5).setDepth(10);
    this.keys=this.input.keyboard.addKeys('W,A,S,D,SPACE,UP,DOWN,LEFT,RIGHT,I,J,K,L,H');
    this.enter=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }
  update(){
    if(this.gameOver) return;
    const sp=180;
    [[this.keys.A,this.keys.D,this.keys.W,this.keys.S,this.keys.SPACE],[this.keys.LEFT,this.keys.RIGHT,this.keys.UP,this.keys.DOWN,this.enter],[this.keys.J,this.keys.L,this.keys.I,this.keys.K,this.keys.H]].forEach((ks,i)=>{
      if(i>=this.ps.length||!this.alive[i]) return;
      const p=this.ps[i];
      p.body.setVelocity(ks[0]?.isDown?-sp:ks[1]?.isDown?sp:0, ks[2]?.isDown?-sp:ks[3]?.isDown?sp:0);
      if(Phaser.Input.Keyboard.JustDown(ks[4])) this._placeBomb(i);
    });
  }
  _placeBomb(own){
    const p=this.ps[own], gc=Math.round((p.x-this.GRID/2)/this.GRID), gr=Math.round((p.y-this.GRID/2)/this.GRID);
    if(this.bombs.find(b=>b.gc===gc&&b.gr===gr)) return;
    const bx=gc*this.GRID+this.GRID/2, by=gr*this.GRID+this.GRID/2;
    const bo=this.add.circle(bx,by,this.GRID/2-6,0x212121).setDepth(3);
    const fu=this.add.circle(bx+8,by-8,5,0xff6b35).setDepth(4);
    const obj={gc,gr,bo,fu,own}; this.bombs.push(obj);
    this.tweens.add({targets:fu,scale:0,duration:2500,onComplete:()=>this._explode(obj)});
    this.tweens.add({targets:bo,scale:1.12,duration:300,yoyo:true,repeat:3});
  }
  _explode(obj){
    if(!obj.bo.active) return; this.bombs=this.bombs.filter(b=>b!==obj); obj.bo.destroy(); obj.fu.destroy();
    const {gc,gr}=obj, range=3, tiles=[[gc,gr]];
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{
      for(let i=1;i<=range;i++){
        const nc=gc+dx*i,nr=gr+dy*i;
        if(nr<0||nr>=this.ROWS||nc<0||nc>=this.COLS) break;
        if(this.map[nr][nc]===1) break;
        tiles.push([nc,nr]);
        if(this.map[nr][nc]===2){ const k=`${nr},${nc}`,b=this.breaks[k]; if(b){b.destroy();delete this.breaks[k];this.map[nr][nc]=0;} break; }
      }
    });
    tiles.forEach(([c,r])=>{
      const x=c*this.GRID+this.GRID/2, y=r*this.GRID+this.GRID/2;
      const ex=this.add.circle(x,y,this.GRID/2-2,0xff4500,0.9).setDepth(5); this.time.delayedCall(480,()=>ex.destroy());
      this.ps.forEach((p,i)=>{ if(this.alive[i]&&Math.abs(p.x-x)<this.GRID-5&&Math.abs(p.y-y)<this.GRID-5)this._kill(i); });
    });
    this.cameras.main.shake(90,0.007);
  }
  _kill(i){
    if(!this.alive[i]) return; this.alive[i]=false;
    this.tweens.add({targets:this.ps[i],alpha:0,scale:2,duration:400,onComplete:()=>this.ps[i].setVisible(false)});
    const cnt=this.alive.filter(Boolean).length;
    this.statusText.setText(`${cnt} player${cnt!==1?'s':''} remaining`);
    if(cnt<=1){ this.gameOver=true; const wi=this.alive.findIndex(Boolean); this._win(wi>=0?`P${wi+1} WINS!`:'DRAW!'); }
  }
  _win(msg){
    const {width:W,height:H}=this.cameras.main;
    this.add.rectangle(W/2,H/2,500,200,0x1a0533,0.95).setDepth(20);
    this.add.text(W/2,H/2-30,msg,{font:'bold 52px Arial',color:'#f1c40f'}).setOrigin(0.5).setDepth(21);
    const b=this.add.rectangle(W/2,H/2+55,200,44,0x8e44ad).setInteractive({useHandCursor:true}).setDepth(21);
    this.add.text(W/2,H/2+55,'MAIN MENU',{font:'bold 18px Arial',color:'#fff'}).setOrigin(0.5).setDepth(22);
    b.on('pointerdown',()=>this.scene.start('MainMenu'));
  }
}

class PlatformerRaceScene extends Phaser.Scene {
  constructor(){ super('PlatformerRace'); }
  init(d){ this.playerCount=d?.players||2; this.gameOver=false; this.finished=[]; }
  create(){
    this.physics.world.gravity.y=600;
    const W=3200,H=720; this.physics.world.setBounds(0,0,W,H);
    this.add.rectangle(0,0,W,H,0x1565c0).setOrigin(0);
    for(let i=0;i<20;i++) this.add.ellipse(Phaser.Math.Between(0,W),Phaser.Math.Between(60,200),Phaser.Math.Between(80,160),40,0xffffff,0.2).setScrollFactor(0.3);
    this.platforms=this.physics.add.staticGroup();
    [[0,660,800,24],[0,400,200,24],[300,340,200,24],[550,300,180,24],[760,340,200,24],[1000,280,160,24],[1200,320,180,24],[1400,260,160,24],[1600,300,200,24],[1800,240,180,24],[2000,280,200,24],[2200,220,180,24],[2400,260,160,24],[2600,200,180,24],[2800,240,200,24],[3000,180,200,24],[3100,660,120,24]].forEach(([x,y,w,h])=>{
      const p=this.add.rectangle(x+w/2,y,w,h,0x4caf50).setStrokeStyle(2,0x388e3c); this.platforms.add(p); this.physics.add.existing(p,true);
    });
    this.coins=this.physics.add.staticGroup();
    for(let i=0;i<50;i++){ const c=this.add.image(Phaser.Math.Between(100,3100),Phaser.Math.Between(100,580),'coin'); this.coins.add(c); this.physics.add.existing(c,true); }
    this.finish=this.add.rectangle(3155,H/2,12,H,0xffffff,0.85); this.physics.add.existing(this.finish,true);
    this.add.text(3158,80,'FINISH',{font:'bold 26px Arial',color:'#fff'});
    const PCOLS=['red','blue','green','yellow']; this.ps=[]; this.bars=[];
    for(let i=0;i<this.playerCount;i++){
      const p=this.physics.add.image(80+i*20,570,`p_${PCOLS[i]}`).setCollideWorldBounds(true);
      p.setData({idx:i,jumps:0});
      this.physics.add.collider(p,this.platforms,()=>p.setData('jumps',0));
      this.physics.add.overlap(p,this.coins,(pl,c)=>{ c.destroy(); localStorage.setItem('coins',parseInt(localStorage.getItem('coins')||0)+5); });
      this.physics.add.overlap(p,this.finish,()=>this._finish(i));
      this.ps.push(p);
      const bar=this.add.rectangle(70+i*240,22,0,16,PLAYER_COLORS[i]).setOrigin(0,0.5).setScrollFactor(0).setDepth(10);
      this.add.rectangle(160+i*240,22,180,18,0x333333).setScrollFactor(0).setDepth(9);
      this.add.text(70+i*240,22,`P${i+1}`,{font:'bold 13px Arial',color:'#fff'}).setOrigin(0,0.5).setScrollFactor(0).setDepth(11);
      this.bars.push(bar);
    }
    this.cameras.main.setBounds(0,0,W,H).startFollow(this.ps[0],true,0.1,0.1);
    this.keys=this.input.keyboard.addKeys('W,A,D,SPACE,UP,LEFT,RIGHT,I,J,L');
    this.enter=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }
  update(){
    if(this.gameOver) return;
    const sp=220,jv=-520;
    [[this.keys.A,this.keys.D,[this.keys.W,this.keys.SPACE]],[this.keys.LEFT,this.keys.RIGHT,[this.keys.UP,this.enter]],[this.keys.J,this.keys.L,[this.keys.I]]].forEach((ks,i)=>{
      if(i>=this.ps.length||this.finished.includes(i)) return;
      const p=this.ps[i];
      p.setVelocityX(ks[0]?.isDown?-sp:ks[1]?.isDown?sp:0);
      if(ks[2].some(k=>Phaser.Input.Keyboard.JustDown(k))&&p.getData('jumps')<2){ p.setVelocityY(jv); p.setData('jumps',p.getData('jumps')+1); }
      if(p.y>720) p.setPosition(80,570).setVelocity(0,0).setData('jumps',0);
      this.bars[i].setSize(Math.min(p.x/3155,1)*180,16);
    });
  }
  _finish(i){
    if(this.finished.includes(i)) return; this.finished.push(i);
    const place=['1ST','2ND','3RD','4TH'][this.finished.length-1];
    const {width:W}=this.cameras.main;
    this.add.text(W/2,120+this.finished.length*50,`P${i+1} — ${place}!`,{font:'bold 38px Arial',color:'#f1c40f'}).setOrigin(0.5).setScrollFactor(0).setDepth(20);
    if(this.finished.length>=this.playerCount){ this.gameOver=true; const b=this.add.rectangle(W/2,560,200,44,0x8e44ad).setInteractive({useHandCursor:true}).setScrollFactor(0).setDepth(21); this.add.text(W/2,560,'MAIN MENU',{font:'bold 18px Arial',color:'#fff'}).setOrigin(0.5).setScrollFactor(0).setDepth(22); b.on('pointerdown',()=>{ this.physics.world.gravity.y=0; this.scene.start('MainMenu'); }); }
  }
}

// ==================  BOOT  ==================
new Phaser.Game({
  type: Phaser.AUTO,
  width: 1280, height: 720,
  parent: 'game-container',
  backgroundColor: '#1a0533',
  physics: { default:'arcade', arcade:{ gravity:{y:0}, debug:false } },
  scene: [BootScene, MainMenuScene, SkinSelectScene, GameSelectScene, LobbyScene,
          BattleRoyaleScene, SoccerScene, TankBattleScene, BombGameScene, PlatformerRaceScene],
});
