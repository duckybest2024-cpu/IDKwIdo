// ============================================================
//  234 Player Games — Mega Edition  v2
//  No build step. Phaser + Socket.io from CDN.
// ============================================================

const PLAYER_COLORS = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf1c40f];

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

const SKINS_FLAT = Object.entries(SKIN_CATEGORIES).flatMap(([cat,{color,skins}]) =>
  skins.map(id => ({ id, cat, color, name: id.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase()) }))
);

const GAMES = [
  {id:'battle_royale',  name:'Battle Royale',    scene:'BattleRoyale',   tag:'action'},
  {id:'soccer',         name:'Soccer',           scene:'Soccer',         tag:'sports'},
  {id:'tank_battle',    name:'Tank Battle',      scene:'TankBattle',     tag:'action'},
  {id:'bomb_game',      name:'Bomb Game',        scene:'BombGame',       tag:'action'},
  {id:'platformer_race',name:'Platformer Race',  scene:'PlatformerRace', tag:'racing'},
  {id:'basketball',     name:'Basketball',       scene:null, tag:'sports'},
  {id:'car_racing',     name:'Car Racing',       scene:null, tag:'racing'},
  {id:'sword_fight',    name:'Sword Fight',      scene:null, tag:'action'},
  {id:'bow_arrow',      name:'Bow & Arrow',      scene:null, tag:'action'},
  {id:'sumo',           name:'Sumo',             scene:null, tag:'action'},
  {id:'volleyball',     name:'Volleyball',       scene:null, tag:'sports'},
  {id:'snowball_fight', name:'Snowball Fight',   scene:null, tag:'fun'},
  {id:'tug_of_war',     name:'Tug of War',       scene:null, tag:'fun'},
  {id:'dodgeball',      name:'Dodgeball',        scene:null, tag:'sports'},
  {id:'ice_slide',      name:'Ice Slide',        scene:null, tag:'racing'},
  {id:'lava_jump',      name:'Lava Jump',        scene:null, tag:'platform'},
  {id:'coin_collector', name:'Coin Collector',   scene:null, tag:'collect'},
  {id:'color_flood',    name:'Color Flood',      scene:null, tag:'puzzle'},
  {id:'snake',          name:'Snake',            scene:null, tag:'classic'},
  {id:'pong',           name:'Pong',             scene:null, tag:'classic'},
  {id:'air_hockey',     name:'Air Hockey',       scene:null, tag:'sports'},
  {id:'mini_golf',      name:'Mini Golf',        scene:null, tag:'sports'},
  {id:'fishing',        name:'Fishing',          scene:null, tag:'chill'},
  {id:'cooking_battle', name:'Cooking Battle',   scene:null, tag:'fun'},
  {id:'gardening_race', name:'Gardening Race',   scene:null, tag:'chill'},
  {id:'treasure_hunt',  name:'Treasure Hunt',    scene:null, tag:'explore'},
  {id:'maze_race',      name:'Maze Race',        scene:null, tag:'puzzle'},
  {id:'bubble_shooter', name:'Bubble Shooter',   scene:null, tag:'puzzle'},
  {id:'tower_defense',  name:'Tower Defense',    scene:null, tag:'strategy'},
  {id:'card_battle',    name:'Card Battle',      scene:null, tag:'strategy'},
  {id:'cannon_ball',    name:'Cannon Ball',      scene:null, tag:'action'},
  {id:'king_of_hill',   name:'King of the Hill', scene:null, tag:'action'},
  {id:'capture_flag',   name:'Capture the Flag', scene:null, tag:'team'},
  {id:'ghost_chase',    name:'Ghost Chase',      scene:null, tag:'fun'},
  {id:'zombie_survival',name:'Zombie Survival',  scene:null, tag:'survival'},
  {id:'space_race',     name:'Space Race',       scene:null, tag:'racing'},
  {id:'pinball',        name:'Pinball',          scene:null, tag:'classic'},
  {id:'breakout',       name:'Breakout',         scene:null, tag:'classic'},
  {id:'asteroid_shooter',name:'Asteroids',       scene:null, tag:'action'},
  {id:'rps_battle',     name:'Rock Paper Scissors',scene:null,tag:'classic'},
  {id:'billiards',      name:'Billiards',        scene:null, tag:'sports'},
  {id:'darts',          name:'Darts',            scene:null, tag:'sports'},
  {id:'bowling',        name:'Bowling',          scene:null, tag:'sports'},
  {id:'farm_race',      name:'Farm Race',        scene:null, tag:'fun'},
  {id:'ice_hockey',     name:'Ice Hockey',       scene:null, tag:'sports'},
  {id:'ninja_dash',     name:'Ninja Dash',       scene:null, tag:'action'},
  {id:'catapult_wars',  name:'Catapult Wars',    scene:null, tag:'strategy'},
  {id:'color_paint',    name:'Color Paint',      scene:null, tag:'creative'},
  {id:'penguin_slide',  name:'Penguin Slide',    scene:null, tag:'fun'},
  {id:'dance_off',      name:'Dance Off',        scene:null, tag:'rhythm'},
];

const TAG_COLOR = {action:0xe74c3c,sports:0x3498db,racing:0xf39c12,platform:0x2ecc71,puzzle:0x9b59b6,classic:0x7f8c8d,fun:0xe67e22,strategy:0x1abc9c,team:0x2c3e50,chill:0x27ae60,survival:0xc0392b,rhythm:0xff69b4,collect:0xd4ac0d,creative:0xff9ff3,explore:0x48dbfb};

function makeBtn(scene, x, y, label, color, cb, w=200, h=50) {
  const b = scene.add.rectangle(x, y, w, h, color).setInteractive({useHandCursor:true});
  scene.add.text(x, y, label, {font:`bold ${h>44?20:16}px Arial`, color:'#fff'}).setOrigin(0.5);
  b.on('pointerover', ()=>b.setAlpha(0.8));
  b.on('pointerout',  ()=>b.setAlpha(1));
  b.on('pointerdown', cb);
  return b;
}
function winScreen(scene, msg) {
  const {width:W,height:H} = scene.cameras.main;
  scene.add.rectangle(W/2,H/2,520,210,0x1a0533,0.95).setDepth(20);
  scene.add.text(W/2,H/2-35,msg,{font:'bold 54px Arial',color:'#f1c40f'}).setOrigin(0.5).setDepth(21);
  const b = scene.add.rectangle(W/2,H/2+60,200,46,0x8e44ad).setInteractive({useHandCursor:true}).setDepth(21);
  scene.add.text(W/2,H/2+60,'MAIN MENU',{font:'bold 18px Arial',color:'#fff'}).setOrigin(0.5).setDepth(22);
  b.on('pointerdown',()=>scene.scene.start('MainMenu'));
}

// =====================  BOOT  =====================
class BootScene extends Phaser.Scene {
  constructor(){ super('Boot'); }
  create(){
    const g = this.make.graphics({x:0,y:0,add:false});
    const gen = (key,fn,w,h)=>{ g.clear(); fn(g); g.generateTexture(key,w,h); };
    gen('panel',   g=>g.fillStyle(0x2d0b5e,0.95).fillRoundedRect(0,0,420,280,16).lineStyle(2,0x9b59b6).strokeRoundedRect(0,0,420,280,16), 420,280);
    gen('card',    g=>g.fillStyle(0x3d1266).fillRoundedRect(0,0,150,110,10).lineStyle(2,0x6c3483).strokeRoundedRect(0,0,150,110,10), 150,110);
    gen('card_sel',g=>g.fillStyle(0x6c3483).fillRoundedRect(0,0,150,110,10).lineStyle(3,0xf1c40f).strokeRoundedRect(0,0,150,110,10), 150,110);
    gen('coin',    g=>g.fillStyle(0xf1c40f).fillCircle(14,14,13), 28,28);
    gen('ball',    g=>g.fillStyle(0xffffff).fillCircle(14,14,13).lineStyle(2,0x333333).strokeCircle(14,14,13), 28,28);
    gen('wall',    g=>g.fillStyle(0x5d4037).fillRect(0,0,46,46).lineStyle(1,0x4e342e).strokeRect(0,0,46,46), 46,46);
    gen('bomb',    g=>g.fillStyle(0x212121).fillCircle(14,12,12).fillStyle(0xff6b35).fillRect(11,0,4,8), 28,24);
    gen('shell',   g=>g.fillStyle(0xf1c40f).fillRect(0,3,18,7).fillStyle(0xe67e22).fillTriangle(18,0,18,13,26,6), 26,13);
    gen('coin_sm', g=>g.fillStyle(0xf1c40f).fillCircle(10,10,9), 20,20);
    ['red','blue','green','yellow'].forEach((c,i)=>{
      gen(`p_${c}`, g=>g.fillStyle(PLAYER_COLORS[i]).fillCircle(18,18,17).lineStyle(3,0xffffff).strokeCircle(18,18,17), 36,36);
    });
    gen('tank', g=>g.fillStyle(0x5d6d7e).fillRect(0,6,56,26).fillRect(8,0,40,14).lineStyle(1,0x85929e).strokeRect(0,6,56,26), 56,32);
    g.destroy();
    this.scene.start('MainMenu');
  }
}

// ==================  MAIN MENU  ==================
class MainMenuScene extends Phaser.Scene {
  constructor(){ super('MainMenu'); }
  create(){
    window.hideLoading?.();
    const W=1280,H=720;
    this.add.rectangle(0,0,W,H,0x1a0533).setOrigin(0);
    for(let i=0;i<80;i++){
      const s=this.add.circle(Phaser.Math.Between(0,W),Phaser.Math.Between(0,H),Phaser.Math.FloatBetween(1,2.5),0xffffff,Phaser.Math.FloatBetween(0.3,1));
      this.tweens.add({targets:s,alpha:0.05,duration:Phaser.Math.Between(800,2500),yoyo:true,repeat:-1,delay:Phaser.Math.Between(0,2000)});
    }
    const t=this.add.text(W/2,110,'2  3  4',{font:'bold 100px Arial',color:'#fff',stroke:'#9b59b6',strokeThickness:6}).setOrigin(0.5);
    this.add.text(W/2,210,'PLAYER GAMES',{font:'bold 54px Arial',color:'#f39c12',stroke:'#d35400',strokeThickness:4}).setOrigin(0.5);
    this.add.text(W/2,268,'MEGA EDITION',{font:'bold 26px Arial',color:'#9b59b6'}).setOrigin(0.5);
    this.add.text(W/2,308,'50 GAMES  ·  215 FREE SKINS  ·  UP TO 4 PLAYERS',{font:'17px Arial',color:'#c39bd3'}).setOrigin(0.5);
    this.tweens.add({targets:t,y:105,duration:1800,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    [[1,W/2-280,0xe74c3c],[2,W/2-80,0x3498db],[3,W/2+80,0x2ecc71],[4,W/2+280,0xf1c40f]].forEach(([n,x,c])=>{
      const b=this.add.rectangle(x,420,160,88,c).setInteractive({useHandCursor:true});
      this.add.text(x,420,`${n}\nPLAYER${n>1?'S':''}`,{font:'bold 22px Arial',color:'#fff',align:'center'}).setOrigin(0.5);
      b.on('pointerover',()=>b.setScale(1.07)); b.on('pointerout',()=>b.setScale(1));
      b.on('pointerdown',()=>this.scene.start('GameSelect',{players:n}));
    });
    makeBtn(this,W/2,540,'PLAY ONLINE',0x8e44ad,()=>this.scene.start('GameSelect',{players:4,online:true}),220);
    makeBtn(this,W/2-160,630,'SKINS',0x1abc9c,()=>this.scene.start('SkinSelect'),140);
    this.add.image(W-130,28,'coin');
    this.add.text(W-110,24,localStorage.getItem('coins')||'500',{font:'bold 20px Arial',color:'#f1c40f'});
    this.add.text(20,20,`Hi, ${localStorage.getItem('playerName')||'Player'}!`,{font:'18px Arial',color:'#c39bd3'});
  }
}

// ==================  SKIN SELECT  ==================
class SkinSelectScene extends Phaser.Scene {
  constructor(){ super('SkinSelect'); }
  init(){ this.sel=localStorage.getItem('selectedSkin')||'cat_white'; this.cat='animals'; this.focused=null; }
  create(){
    const W=1280,H=720;
    this.add.rectangle(0,0,W,H,0x1a0533).setOrigin(0);
    this.add.text(W/2,36,'SELECT YOUR SKIN',{font:'bold 36px Arial',color:'#fff'}).setOrigin(0.5);
    this.add.text(W/2,70,`${SKINS_FLAT.length} skins — all free`,{font:'15px Arial',color:'#c39bd3'}).setOrigin(0.5);
    const cats=Object.keys(SKIN_CATEGORIES);
    this.tabs=cats.map((cat,i)=>{
      const x=80+i*120,col=SKIN_CATEGORIES[cat].color;
      const tab=this.add.rectangle(x,112,112,32,col,i===0?1:0.5).setInteractive({useHandCursor:true});
      this.add.text(x,112,cat.toUpperCase(),{font:'bold 10px Arial',color:'#fff'}).setOrigin(0.5);
      tab.on('pointerdown',()=>{ this.cat=cat; this.tabs.forEach((t,j)=>t.setAlpha(j===i?1:0.5)); this._render(); });
      return tab;
    });
    this.cont=this.add.container(0,0);
    const px=W-200,py=H/2;
    this.add.rectangle(px,py,360,380,0x2d0b5e).setStrokeStyle(2,0x9b59b6);
    this.pvCirc=this.add.circle(px,py-70,52,0xaaaaaa);
    this.pvLtr =this.add.text(px,py-70,'?',{font:'bold 42px Arial',color:'#fff'}).setOrigin(0.5);
    this.pvName=this.add.text(px,py,  '',{font:'bold 20px Arial',color:'#fff'}).setOrigin(0.5);
    this.pvCat =this.add.text(px,py+34,'',{font:'14px Arial',color:'#c39bd3'}).setOrigin(0.5);
    makeBtn(this,px,py+110,'USE THIS SKIN',0x27ae60,()=>{
      if(this.focused){ localStorage.setItem('selectedSkin',this.focused); this.sel=this.focused; this._render(); }
    },180,44);
    makeBtn(this,80,H-36,'BACK',0x6c3483,()=>this.scene.start('MainMenu'),130,44);
    this._render(); this._focus(this.sel);
  }
  _render(){
    this.cont.removeAll(true);
    SKIN_CATEGORIES[this.cat].skins.forEach((id,i)=>{
      const col=i%6,row=Math.floor(i/6);
      const x=32+col*166+75,y=148+row*124+55;
      const bg=this.add.image(x,y,id===this.sel?'card_sel':'card').setInteractive({useHandCursor:true});
      const circ=this.add.circle(x,y-20,26,SKIN_CATEGORIES[this.cat].color);
      const ltr =this.add.text(x,y-20,id[0].toUpperCase(),{font:'bold 20px Arial',color:'#fff'}).setOrigin(0.5);
      const nm  =this.add.text(x,y+24,id.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),{font:'9px Arial',color:'#fff',wordWrap:{width:140}}).setOrigin(0.5);
      bg.on('pointerdown',()=>this._focus(id));
      bg.on('pointerover',()=>bg.setScale(1.05)); bg.on('pointerout',()=>bg.setScale(1));
      this.cont.add([bg,circ,ltr,nm]);
    });
  }
  _focus(id){
    this.focused=id;
    const s=SKINS_FLAT.find(s=>s.id===id); if(!s) return;
    this.pvCirc.setFillStyle(s.color); this.pvLtr.setText(id[0].toUpperCase());
    this.pvName.setText(s.name); this.pvCat.setText(s.cat.toUpperCase());
  }
}

// ==================  GAME SELECT  ==================
class GameSelectScene extends Phaser.Scene {
  constructor(){ super('GameSelect'); }
  init(d){ this.players=d?.players||2; this.online=d?.online||false; this.page=0; }
  create(){
    const W=1280,H=720;
    this.add.rectangle(0,0,W,H,0x1a0533).setOrigin(0);
    this.add.text(W/2,36,'CHOOSE A GAME',{font:'bold 34px Arial',color:'#fff'}).setOrigin(0.5);
    this.add.text(W/2,70,`${this.players} player${this.players>1?'s':''} • ${GAMES.length} games`,{font:'16px Arial',color:'#c39bd3'}).setOrigin(0.5);
    this.cont=this.add.container(0,0);
    this.pageText=this.add.text(W/2,H-34,'',{font:'15px Arial',color:'#c39bd3'}).setOrigin(0.5);
    makeBtn(this,W/2-120,H-34,'< PREV',0x6c3483,()=>{ if(this.page>0){this.page--;this._render();} },120,40);
    makeBtn(this,W/2+120,H-34,'NEXT >',0x6c3483,()=>{ if((this.page+1)*15<GAMES.length){this.page++;this._render();} },120,40);
    makeBtn(this,80,H-34,'BACK',0x6c3483,()=>this.scene.start('MainMenu'),120,40);
    this._render();
  }
  _render(){
    this.cont.removeAll(true);
    const page=GAMES.slice(this.page*15,(this.page+1)*15);
    const W=1280,cols=5,cW=212,cH=136,pX=18,pY=14;
    const startX=(W-(cols*(cW+pX)-pX))/2;
    page.forEach((g,i)=>{
      const col=i%cols,row=Math.floor(i/cols);
      const x=startX+col*(cW+pX)+cW/2,y=100+row*(cH+pY)+cH/2;
      const avail=!!g.scene;
      const bg=this.add.rectangle(x,y,cW,cH,avail?0x2d0b5e:0x180924).setStrokeStyle(2,avail?0x8e44ad:0x333333);
      if(avail) bg.setInteractive({useHandCursor:true});
      this.add.text(x,y-20,g.name,{font:`bold ${g.name.length>13?13:15}px Arial`,color:avail?'#fff':'#555',wordWrap:{width:200}}).setOrigin(0.5);
      const tc=TAG_COLOR[g.tag]||0x555555;
      this.add.rectangle(x,y+26,g.tag.length*10+14,20,tc,avail?1:0.25);
      this.add.text(x,y+26,g.tag.toUpperCase(),{font:'9px Arial',color:'#fff'}).setOrigin(0.5);
      if(!avail) this.add.text(x,y+46,'COMING SOON',{font:'10px Arial',color:'#444'}).setOrigin(0.5);
      if(avail){
        bg.on('pointerover',()=>{bg.setFillColor(0x4a1a8a);bg.setScale(1.03);});
        bg.on('pointerout', ()=>{bg.setFillColor(0x2d0b5e);bg.setScale(1);});
        bg.on('pointerdown',()=>{ if(this.online)this.scene.start('Lobby',{gameType:g.id,players:this.players}); else this.scene.start(g.scene,{players:this.players}); });
      }
      this.cont.add([bg]);
    });
    this.pageText.setText(`${this.page+1} / ${Math.ceil(GAMES.length/15)}`);
  }
}

// ==================  LOBBY  ==================
class LobbyScene extends Phaser.Scene {
  constructor(){ super('Lobby'); }
  init(d){ this.gameType=d.gameType; this.players=d.players; }
  create(){
    const W=1280,H=720;
    this.add.rectangle(0,0,W,H,0x1a0533).setOrigin(0);
    this.add.text(W/2,60,'ONLINE LOBBY',{font:'bold 40px Arial',color:'#fff'}).setOrigin(0.5);
    this.socket=io();
    this.codeText=this.add.text(W/2,220,'',{font:'bold 52px Arial',color:'#f1c40f'}).setOrigin(0.5);
    this.statusText=this.add.text(W/2,278,'',{font:'16px Arial',color:'#2ecc71'}).setOrigin(0.5);
    this.slots=Array.from({length:4},(_,i)=>{
      const x=W/2-285+i*190,y=400;
      const sl=this.add.rectangle(x,y,170,90,0x2d0b5e).setStrokeStyle(2,0x444444);
      const lb=this.add.text(x,y,`P${i+1}\nwaiting...`,{font:'15px Arial',color:'#555',align:'center'}).setOrigin(0.5);
      return{sl,lb};
    });
    const name=localStorage.getItem('playerName')||'Player';
    const skin=localStorage.getItem('selectedSkin')||'cat_white';
    makeBtn(this,W/2-150,330,'CREATE ROOM',0x8e44ad,()=>this.socket.emit('create_room',{gameType:this.gameType,maxPlayers:this.players,playerName:name,skinId:skin}),200);
    makeBtn(this,W/2+150,330,'JOIN ROOM',0x2980b9,()=>this._joinPrompt(name,skin),180);
    makeBtn(this,W/2,500,'READY ✓',0x27ae60,()=>this.socket.emit('player_ready'),160);
    makeBtn(this,80,H-36,'BACK',0x6c3483,()=>{ this.socket.disconnect(); this.scene.start('GameSelect',{players:this.players}); },120,40);
    this.socket.on('room_created',({roomId,room})=>{ this.codeText.setText(`CODE: ${roomId}`); this.statusText.setText('Share this code!'); this._slots(room.players); });
    this.socket.on('room_joined', ({room})=>this._slots(room.players));
    this.socket.on('room_updated',(room)=>this._slots(room.players));
    this.socket.on('game_start',  (data)=>{ const g=GAMES.find(g=>g.id===this.gameType); if(g?.scene)this.scene.start(g.scene,{...data,online:true,socket:this.socket}); });
    this.socket.on('error',({message})=>this.statusText.setStyle({color:'#e74c3c'}).setText(message));
  }
  _slots(players){
    this.slots.forEach((s,i)=>{
      const p=players[i];
      s.lb.setStyle({color:p?'#fff':'#555'}).setText(p?`${p.name}\n${p.ready?'READY ✓':'waiting...'}`:`P${i+1}\nwaiting...`);
      s.sl.setStrokeStyle(2,p?0x8e44ad:0x444444);
    });
  }
  _joinPrompt(name,skin){
    const W=1280,H=720; let code='';
    const ov=this.add.rectangle(W/2,H/2,420,210,0x1a0533,0.97).setStrokeStyle(2,0x9b59b6).setDepth(10);
    this.add.text(W/2,H/2-65,'Enter room code:',{font:'20px Arial',color:'#fff'}).setOrigin(0.5).setDepth(11);
    const cd=this.add.text(W/2,H/2-10,'______',{font:'bold 42px Arial',color:'#f1c40f'}).setOrigin(0.5).setDepth(11);
    this.add.text(W/2,H/2+46,'Press ENTER to join',{font:'14px Arial',color:'#c39bd3'}).setOrigin(0.5).setDepth(11);
    const kl=this.input.keyboard.on('keydown',e=>{
      if(e.key.length===1&&/[A-Z0-9]/i.test(e.key)&&code.length<6)code+=e.key.toUpperCase();
      if(e.key==='Backspace')code=code.slice(0,-1);
      cd.setText(code.padEnd(6,'_'));
      if(e.key==='Enter'&&code.length>=4){ this.socket.emit('join_room',{roomId:code,playerName:name,skinId:skin}); ov.destroy(); this.input.keyboard.off('keydown',kl); }
    });
  }
}

// ==================  BATTLE ROYALE  ==================
class BattleRoyaleScene extends Phaser.Scene {
  constructor(){ super('BattleRoyale'); }
  init(d){ this.pc=d?.players||2; this.over=false; }
  create(){
    const W=1280,H=720;
    this.physics.world.setBounds(0,0,W,H);
    this.add.rectangle(0,0,W,H,0x1a5e1a).setOrigin(0);
    this.obs=this.physics.add.staticGroup();
    [[200,200],[450,160],[720,300],[950,200],[300,460],[620,510],[1020,400],[160,560],[820,560],[500,360],[1100,260]].forEach(([x,y])=>{
      const o=this.add.rectangle(x,y,80,80,0x5d4037); this.obs.add(o); this.physics.add.existing(o,true);
    });
    const sp=[[100,80],[W-100,80],[100,H-80],[W-100,H-80]];
    this.ps=[]; this.hp=[3,3,3,3]; this.hpT=[];
    for(let i=0;i<this.pc;i++){
      const p=this.physics.add.image(sp[i][0],sp[i][1],`p_${['red','blue','green','yellow'][i]}`).setCollideWorldBounds(true);
      p.setData({i,sp:220,cd:0,alive:true}); this.physics.add.collider(p,this.obs); this.ps.push(p);
      this.hpT.push(this.add.text(20+i*220,24,`P${i+1} ❤❤❤`,{font:'bold 16px Arial',color:'#fff'}).setDepth(10));
    }
    for(let a=0;a<this.ps.length;a++) for(let b=a+1;b<this.ps.length;b++) this.physics.add.collider(this.ps[a],this.ps[b]);
    this.buls=this.physics.add.group({maxSize:40});
    this.ps.forEach((p,pi)=>this.physics.add.overlap(this.buls,p,(bl)=>{
      if(!bl.active||bl.getData('o')===pi)return;
      bl.setActive(false).setVisible(false); this._hit(pi);
    }));
    this.zR=Math.min(W,H)/2-30; this.zX=W/2; this.zY=H/2;
    this.zG=this.add.graphics().setDepth(5);
    this.zC=30;
    this.zT=this.add.text(W/2,22,'Zone shrinks in 30s',{font:'bold 17px Arial',color:'#e74c3c'}).setOrigin(0.5).setDepth(10);
    this.time.addEvent({delay:1000,loop:true,callback:()=>{
      if(this.over)return; this.zC--; this.zT.setText(`Zone shrinks in ${Math.max(0,this.zC)}s`);
      if(this.zC<=0){this.zR=Math.max(120,this.zR-30);this.zC=15;}
    }});
    this._spawnPU(); this.time.addEvent({delay:9000,loop:true,callback:this._spawnPU,callbackScope:this});
    this.K=this.input.keyboard.addKeys('W,A,S,D,F,UP,DOWN,LEFT,RIGHT,I,J,K,L,H');
    this.ENT=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }
  update(_,dt){
    if(this.over)return;
    this.ps.forEach((p,i)=>{
      if(!p.getData('alive'))return;
      const sp=p.getData('sp'); let vx=0,vy=0;
      if(i===0){if(this.K.A?.isDown)vx=-sp;else if(this.K.D?.isDown)vx=sp;if(this.K.W?.isDown)vy=-sp;else if(this.K.S?.isDown)vy=sp;if(Phaser.Input.Keyboard.JustDown(this.K.F))this._shoot(p,i,vx,vy);}
      else if(i===1){if(this.K.LEFT?.isDown)vx=-sp;else if(this.K.RIGHT?.isDown)vx=sp;if(this.K.UP?.isDown)vy=-sp;else if(this.K.DOWN?.isDown)vy=sp;if(Phaser.Input.Keyboard.JustDown(this.ENT))this._shoot(p,i,vx,vy);}
      else if(i===2){if(this.K.J?.isDown)vx=-sp;else if(this.K.L?.isDown)vx=sp;if(this.K.I?.isDown)vy=-sp;else if(this.K.K?.isDown)vy=sp;if(Phaser.Input.Keyboard.JustDown(this.K.H))this._shoot(p,i,vx,vy);}
      p.setVelocity(vx,vy);
      if(p.getData('cd')>0)p.setData('cd',p.getData('cd')-dt);
      const dx=p.x-this.zX,dy=p.y-this.zY;
      if(Math.sqrt(dx*dx+dy*dy)>this.zR&&this.time.now%1000<20)this._hit(i);
    });
    this.zG.clear().lineStyle(3,0xe74c3c,0.8).strokeCircle(this.zX,this.zY,this.zR).fillStyle(0xe74c3c,0.05).fillCircle(this.zX,this.zY,this.zR+500);
    this.hpT.forEach((t,i)=>t.setText(`P${i+1} ${'❤'.repeat(Math.max(0,this.hp[i]))}${'⬤'.repeat(Math.max(0,3-this.hp[i]))}`) );
    const alive=this.ps.filter(p=>p.getData('alive'));
    if(alive.length<=1&&!this.over){this.over=true;winScreen(this,alive[0]?`P${alive[0].getData('i')+1} WINS!`:'DRAW!');}
  }
  _shoot(p,o,vx,vy){if(p.getData('cd')>0)return;p.setData('cd',500);const dx=vx||1,dy=vy||0,l=Math.sqrt(dx*dx+dy*dy)||1;const b=this.buls.get(p.x+dx/l*30,p.y+dy/l*30);if(!b)return;if(!b.body)this.physics.add.existing(b);b.setActive(true).setVisible(true).setData('o',o).setDisplaySize(12,12);b.body.setVelocity(dx/l*520,dy/l*520);this.time.delayedCall(1300,()=>{if(b.active)b.setActive(false).setVisible(false);});}
  _hit(i){this.hp[i]--;this.cameras.main.shake(70,0.005);this.tweens.add({targets:this.ps[i],alpha:0.2,duration:80,yoyo:true,repeat:2});if(this.hp[i]<=0)this.ps[i].setData('alive',false).setActive(false).setVisible(false);}
  _spawnPU(){const types=[{c:0x27ae60,t:'heal'},{c:0xf39c12,t:'speed'}];const{c,t}=types[Phaser.Math.Between(0,1)];const pu=this.add.circle(Phaser.Math.Between(100,1180),Phaser.Math.Between(80,640),13,c);this.physics.add.existing(pu);this.ps.forEach((p,i)=>this.physics.add.overlap(p,pu,()=>{if(!pu.active)return;pu.destroy();if(t==='heal')this.hp[i]=Math.min(3,this.hp[i]+1);else{p.setData('sp',320);this.time.delayedCall(5000,()=>p.setData('sp',220));}}));this.time.delayedCall(10000,()=>{if(pu.active)pu.destroy();});}
}

// ==================  SOCCER  ==================
class SoccerScene extends Phaser.Scene {
  constructor(){ super('Soccer'); }
  init(d){ this.pc=d?.players||2; this.sc=[0,0]; this.t=120; this.over=false; this._cd=false; }
  create(){
    const W=1280,H=720;
    this.add.rectangle(0,0,W,H,0x2e7d32).setOrigin(0);
    this.add.rectangle(W/2,H/2,4,H-60,0xffffff,0.5);
    this.add.circle(W/2,H/2,80,0x2e7d32).setStrokeStyle(3,0xffffff,0.5);
    const g0=this.add.rectangle(16,H/2,32,200,0xffffff,0.2).setStrokeStyle(3,0xffffff);
    const g1=this.add.rectangle(W-16,H/2,32,200,0xffffff,0.2).setStrokeStyle(3,0xffffff);
    this.physics.add.existing(g0,true); this.physics.add.existing(g1,true);
    this.ball=this.physics.add.image(W/2,H/2,'ball').setBounce(0.85).setDamping(true).setDrag(0.97).setCollideWorldBounds(true).setCircle(13,1,1);
    this.ps=[];
    [[W/4,H/2],[3*W/4,H/2],[W/4-80,H/2+80],[3*W/4+80,H/2-80]].slice(0,this.pc).forEach((pos,i)=>{
      const p=this.physics.add.image(pos[0],pos[1],`p_${['red','blue','green','yellow'][i]}`).setCollideWorldBounds(true).setBounce(0.3);
      this.physics.add.collider(p,this.ball,()=>{const dx=this.ball.x-p.x,dy=this.ball.y-p.y,d=Math.sqrt(dx*dx+dy*dy)||1;this.ball.setVelocity(dx/d*600+p.body.velocity.x*0.4,dy/d*600+p.body.velocity.y*0.4);this.cameras.main.shake(35,0.002);});
      this.ps.push(p);
    });
    for(let a=0;a<this.ps.length;a++) for(let b=a+1;b<this.ps.length;b++) this.physics.add.collider(this.ps[a],this.ps[b]);
    this.physics.add.overlap(this.ball,g0,()=>this._goal(1));
    this.physics.add.overlap(this.ball,g1,()=>this._goal(0));
    this.scT=this.add.text(W/2,28,'0 : 0',{font:'bold 32px Arial',color:'#fff'}).setOrigin(0.5).setDepth(10);
    this.tmT=this.add.text(W/2,62,'2:00',{font:'18px Arial',color:'#a5d6a7'}).setOrigin(0.5).setDepth(10);
    this.time.addEvent({delay:1000,loop:true,callback:()=>{if(this.over)return;this.t--;this.tmT.setText(`${Math.floor(this.t/60)}:${String(this.t%60).padStart(2,'0')}`);if(this.t<=0)this._end();}});
    this.K=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,I,J,K,L');
  }
  update(){if(this.over)return;const sp=250;[[this.K.A,this.K.D,this.K.W,this.K.S],[this.K.LEFT,this.K.RIGHT,this.K.UP,this.K.DOWN],[this.K.J,this.K.L,this.K.I,this.K.K]].forEach((ks,i)=>{if(i>=this.ps.length)return;this.ps[i].setVelocity(ks[0]?.isDown?-sp:ks[1]?.isDown?sp:0,ks[2]?.isDown?-sp:ks[3]?.isDown?sp:0);});}
  _goal(team){if(this.over||this._cd)return;this._cd=true;this.sc[team]++;this.scT.setText(`${this.sc[0]} : ${this.sc[1]}`);this.cameras.main.flash(300,255,255,255);const{width:W,height:H}=this.cameras.main;const gt=this.add.text(W/2,H/2,'GOAL!',{font:'bold 90px Arial',color:'#f1c40f',stroke:'#d35400',strokeThickness:6}).setOrigin(0.5).setDepth(20);this.tweens.add({targets:gt,scaleX:1.5,scaleY:1.5,alpha:0,duration:1200,onComplete:()=>gt.destroy()});this.ball.setPosition(W/2,H/2).setVelocity(0,0);this.time.delayedCall(1500,()=>this._cd=false);}
  _end(){this.over=true;const msg=this.sc[0]>this.sc[1]?'RED WINS!':this.sc[1]>this.sc[0]?'BLUE WINS!':'DRAW!';const{width:W,height:H}=this.cameras.main;this.add.rectangle(W/2,H/2,520,220,0x1a0533,0.95).setDepth(20);this.add.text(W/2,H/2-40,msg,{font:'bold 50px Arial',color:'#f1c40f'}).setOrigin(0.5).setDepth(21);this.add.text(W/2,H/2+8,`${this.sc[0]}  -  ${this.sc[1]}`,{font:'34px Arial',color:'#fff'}).setOrigin(0.5).setDepth(21);makeBtn(this,W/2,H/2+70,'MAIN MENU',0x8e44ad,()=>this.scene.start('MainMenu'),200,44).setDepth(21);}
}

// ==================  TANK BATTLE  ==================
class TankBattleScene extends Phaser.Scene {
  constructor(){ super('TankBattle'); }
  init(d){ this.pc=d?.players||2; this.over=false; }
  create(){
    const W=1280,H=720;this.physics.world.setBounds(0,0,W,H);
    this.add.rectangle(0,0,W,H,0x3e2723).setOrigin(0);
    this.walls=this.physics.add.staticGroup();
    [[3,3],[4,3],[5,3],[20,3],[21,3],[22,3],[3,10],[3,11],[22,10],[22,11],[10,5],[11,5],[12,5],[14,5],[15,5],[16,5],[10,9],[11,9],[12,9],[14,9],[15,9],[16,9],[7,7],[8,7],[18,7],[19,7]].forEach(([gx,gy])=>{const w=this.add.rectangle(gx*48+24,gy*48+24,46,46,0x5d4037);this.walls.add(w);this.physics.add.existing(w,true);});
    this.tanks=[];this.hp=[3,3,3,3];this.hpT=[];
    [[96,96],[W-96,H-96],[W-96,96],[96,H-96]].slice(0,this.pc).forEach(([sx,sy],i)=>{const t=this.physics.add.image(sx,sy,'tank').setRotation(i*Math.PI/2).setCollideWorldBounds(true);t.setData({i,alive:true,cd:0});this.physics.add.collider(t,this.walls);this.tanks.push(t);this.hpT.push(this.add.text(20+i*200,24,`P${i+1} ❤❤❤`,{font:'bold 14px Arial',color:'#fff'}).setDepth(10));});
    for(let a=0;a<this.tanks.length;a++) for(let b=a+1;b<this.tanks.length;b++) this.physics.add.collider(this.tanks[a],this.tanks[b]);
    this.shells=this.physics.add.group({maxSize:20});
    this.physics.add.collider(this.shells,this.walls,(sh)=>{if(sh.active)sh.setActive(false).setVisible(false);});
    this.tanks.forEach((_,ti)=>this.physics.add.overlap(this.shells,this.tanks[ti],(sh)=>{if(!sh.active||sh.getData('o')===ti)return;sh.setActive(false).setVisible(false);this._hitT(ti);}));
    this.K=this.input.keyboard.addKeys('W,A,S,D,F,UP,DOWN,LEFT,RIGHT');
    this.ENT=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }
  update(_,dt){if(this.over)return;const sp=180,ts=100;this.tanks.forEach((t,i)=>{if(!t.getData('alive'))return;if(i===0){if(this.K.W?.isDown)t.setVelocity(Math.cos(t.rotation)*sp,Math.sin(t.rotation)*sp);else if(this.K.S?.isDown)t.setVelocity(-Math.cos(t.rotation)*sp,-Math.sin(t.rotation)*sp);else t.setVelocity(0,0);if(this.K.A?.isDown)t.setAngularVelocity(-ts);else if(this.K.D?.isDown)t.setAngularVelocity(ts);else t.setAngularVelocity(0);if(Phaser.Input.Keyboard.JustDown(this.K.F))this._fire(t,i);}else if(i===1){if(this.K.UP?.isDown)t.setVelocity(Math.cos(t.rotation)*sp,Math.sin(t.rotation)*sp);else if(this.K.DOWN?.isDown)t.setVelocity(-Math.cos(t.rotation)*sp,-Math.sin(t.rotation)*sp);else t.setVelocity(0,0);if(this.K.LEFT?.isDown)t.setAngularVelocity(-ts);else if(this.K.RIGHT?.isDown)t.setAngularVelocity(ts);else t.setAngularVelocity(0);if(Phaser.Input.Keyboard.JustDown(this.ENT))this._fire(t,i);}if(t.getData('cd')>0)t.setData('cd',t.getData('cd')-dt);});const alive=this.tanks.filter(t=>t.getData('alive'));if(alive.length<=1&&!this.over){this.over=true;winScreen(this,alive[0]?`P${alive[0].getData('i')+1} WINS!`:'DRAW!');}}
  _fire(t,o){if(t.getData('cd')>0)return;t.setData('cd',600);const a=t.rotation;const sh=this.shells.get(t.x+Math.cos(a)*38,t.y+Math.sin(a)*38,'shell');if(!sh)return;if(!sh.body)this.physics.add.existing(sh);sh.setActive(true).setVisible(true).setRotation(a).setData('o',o);sh.body.setVelocity(Math.cos(a)*560,Math.sin(a)*560);this.cameras.main.shake(55,0.004);this.time.delayedCall(2000,()=>{if(sh.active)sh.setActive(false).setVisible(false);});}
  _hitT(i){this.hp[i]--;this.tweens.add({targets:this.tanks[i],alpha:0.2,duration:80,yoyo:true,repeat:3});this.hpT[i].setText(`P${i+1} ${'❤'.repeat(Math.max(0,this.hp[i]))}${'⬤'.repeat(3-Math.max(0,this.hp[i]))}`);if(this.hp[i]<=0)this.tanks[i].setData('alive',false).setActive(false).setVisible(false);}
}

// ==================  BOMB GAME  ==================
class BombGameScene extends Phaser.Scene {
  constructor(){ super('BombGame'); }
  init(d){ this.pc=d?.players||2; this.over=false; }
  create(){
    const G=48,C=26,R=14,W=1280,H=720;
    this.G=G;this.C=C;this.R=R;
    this.add.rectangle(0,0,W,H,0x1b5e20).setOrigin(0);
    this.map=[];this.brk={};this.wls=[];
    const corners=[[1,1],[C-2,1],[1,R-2],[C-2,R-2]];
    for(let r=0;r<R;r++){this.map[r]=[];for(let c=0;c<C;c++){const e=r===0||r===R-1||c===0||c===C-1,p=r%2===0&&c%2===0;this.map[r][c]=e||p?1:0;}}
    for(let r=1;r<R-1;r++)for(let c=1;c<C-1;c++){if(this.map[r][c])continue;if(corners.some(([pc,pr])=>Math.abs(c-pc)<=1&&Math.abs(r-pr)<=1))continue;if(Math.random()<0.55)this.map[r][c]=2;}
    for(let r=0;r<R;r++)for(let c=0;c<C;c++){const x=c*G+G/2,y=r*G+G/2;if(this.map[r][c]===1){const w=this.add.rectangle(x,y,G-2,G-2,0x4e342e);this.wls.push(w);this.physics.add.existing(w,true);}else if(this.map[r][c]===2){const b=this.add.rectangle(x,y,G-4,G-4,0x8d6e63);this.brk[`${r},${c}`]=b;this.wls.push(b);this.physics.add.existing(b,true);}}
    this.ps=[];this.alive=[];this.bombs=[];
    corners.slice(0,this.pc).forEach(([gc,gr],i)=>{const p=this.physics.add.rectangle(gc*G+G/2,gr*G+G/2,G-10,G-10,PLAYER_COLORS[i]).setDepth(2);p.body.setCollideWorldBounds(true);this.wls.forEach(w=>this.physics.add.collider(p,w));this.ps.push(p);this.alive.push(true);});
    for(let a=0;a<this.ps.length;a++) for(let b=a+1;b<this.ps.length;b++) this.physics.add.collider(this.ps[a],this.ps[b]);
    this.stT=this.add.text(W/2,14,`${this.pc} players`,{font:'bold 18px Arial',color:'#fff'}).setOrigin(0.5).setDepth(10);
    this.K=this.input.keyboard.addKeys('W,A,S,D,SPACE,UP,DOWN,LEFT,RIGHT,I,J,K,L,H');
    this.ENT=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }
  update(){if(this.over)return;const sp=180;[[this.K.A,this.K.D,this.K.W,this.K.S,this.K.SPACE],[this.K.LEFT,this.K.RIGHT,this.K.UP,this.K.DOWN,this.ENT],[this.K.J,this.K.L,this.K.I,this.K.K,this.K.H]].forEach((ks,i)=>{if(i>=this.ps.length||!this.alive[i])return;this.ps[i].body.setVelocity(ks[0]?.isDown?-sp:ks[1]?.isDown?sp:0,ks[2]?.isDown?-sp:ks[3]?.isDown?sp:0);if(Phaser.Input.Keyboard.JustDown(ks[4]))this._place(i);});}
  _place(own){const p=this.ps[own],gc=Math.round((p.x-this.G/2)/this.G),gr=Math.round((p.y-this.G/2)/this.G);if(this.bombs.find(b=>b.gc===gc&&b.gr===gr))return;const bx=gc*this.G+this.G/2,by=gr*this.G+this.G/2;const bo=this.add.circle(bx,by,this.G/2-6,0x212121).setDepth(3);const fu=this.add.circle(bx+8,by-8,5,0xff6b35).setDepth(4);const obj={gc,gr,bo,fu};this.bombs.push(obj);this.tweens.add({targets:fu,scale:0,duration:2500,onComplete:()=>this._explode(obj)});this.tweens.add({targets:bo,scale:1.12,duration:300,yoyo:true,repeat:3});}
  _explode(obj){if(!obj.bo.active)return;this.bombs=this.bombs.filter(b=>b!==obj);obj.bo.destroy();obj.fu.destroy();const{gc,gr}=obj,tiles=[[gc,gr]];[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{for(let i=1;i<=3;i++){const nc=gc+dx*i,nr=gr+dy*i;if(nr<0||nr>=this.R||nc<0||nc>=this.C)break;if(this.map[nr][nc]===1)break;tiles.push([nc,nr]);if(this.map[nr][nc]===2){const k=`${nr},${nc}`,b=this.brk[k];if(b){b.destroy();delete this.brk[k];this.map[nr][nc]=0;}break;}}});tiles.forEach(([c,r])=>{const x=c*this.G+this.G/2,y=r*this.G+this.G/2;const ex=this.add.circle(x,y,this.G/2-2,0xff4500,0.9).setDepth(5);this.time.delayedCall(480,()=>ex.destroy());this.ps.forEach((p,i)=>{if(this.alive[i]&&Math.abs(p.x-x)<this.G-5&&Math.abs(p.y-y)<this.G-5)this._kill(i);});});this.cameras.main.shake(90,0.007);}
  _kill(i){if(!this.alive[i])return;this.alive[i]=false;this.tweens.add({targets:this.ps[i],alpha:0,scale:2,duration:400,onComplete:()=>this.ps[i].setVisible(false)});const cnt=this.alive.filter(Boolean).length;this.stT.setText(`${cnt} player${cnt!==1?'s':''} remaining`);if(cnt<=1){this.over=true;const wi=this.alive.findIndex(Boolean);winScreen(this,wi>=0?`P${wi+1} WINS!`:'DRAW!');}}
}

// ==================  PLATFORMER RACE  ==================
class PlatformerRaceScene extends Phaser.Scene {
  constructor(){ super('PlatformerRace'); }
  init(d){ this.pc=d?.players||2; this.over=false; this.fin=[]; }
  create(){
    this.physics.world.gravity.y=600;
    const W=3200,H=720;this.physics.world.setBounds(0,0,W,H);
    this.add.rectangle(0,0,W,H,0x1565c0).setOrigin(0);
    for(let i=0;i<20;i++)this.add.ellipse(Phaser.Math.Between(0,W),Phaser.Math.Between(60,200),Phaser.Math.Between(80,160),40,0xffffff,0.2).setScrollFactor(0.3);
    this.plats=this.physics.add.staticGroup();
    [[0,660,800,24],[0,400,200,24],[300,340,200,24],[550,300,180,24],[760,340,200,24],[1000,280,160,24],[1200,320,180,24],[1400,260,160,24],[1600,300,200,24],[1800,240,180,24],[2000,280,200,24],[2200,220,180,24],[2400,260,160,24],[2600,200,180,24],[2800,240,200,24],[3000,180,200,24],[3100,660,120,24]].forEach(([x,y,w,h])=>{const p=this.add.rectangle(x+w/2,y,w,h,0x4caf50).setStrokeStyle(2,0x388e3c);this.plats.add(p);this.physics.add.existing(p,true);});
    this.coins2=this.physics.add.staticGroup();
    for(let i=0;i<50;i++){const c=this.add.image(Phaser.Math.Between(100,3100),Phaser.Math.Between(100,580),'coin_sm');this.coins2.add(c);this.physics.add.existing(c,true);}
    this.finish=this.add.rectangle(3155,H/2,12,H,0xffffff,0.85);this.physics.add.existing(this.finish,true);
    this.add.text(3158,60,'FINISH',{font:'bold 28px Arial',color:'#fff'});
    this.ps=[];this.bars=[];
    ['red','blue','green','yellow'].slice(0,this.pc).forEach((c,i)=>{const p=this.physics.add.image(80+i*20,570,`p_${c}`).setCollideWorldBounds(true);p.setData({i,j:0});this.physics.add.collider(p,this.plats,()=>p.setData('j',0));this.physics.add.overlap(p,this.coins2,(pl,co)=>{co.destroy();localStorage.setItem('coins',parseInt(localStorage.getItem('coins')||500)+5);});this.physics.add.overlap(p,this.finish,()=>this._fin(i));this.ps.push(p);const bar=this.add.rectangle(70+i*240,22,0,16,PLAYER_COLORS[i]).setOrigin(0,0.5).setScrollFactor(0).setDepth(10);this.add.rectangle(160+i*240,22,180,18,0x333333).setScrollFactor(0).setDepth(9);this.add.text(70+i*240,22,`P${i+1}`,{font:'bold 13px Arial',color:'#fff'}).setOrigin(0,0.5).setScrollFactor(0).setDepth(11);this.bars.push(bar);});
    this.cameras.main.setBounds(0,0,W,H).startFollow(this.ps[0],true,0.1,0.1);
    this.K=this.input.keyboard.addKeys('W,A,D,SPACE,UP,LEFT,RIGHT,I,J,L');
    this.ENT=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }
  update(){if(this.over)return;const sp=220,jv=-520;[[this.K.A,this.K.D,[this.K.W,this.K.SPACE]],[this.K.LEFT,this.K.RIGHT,[this.K.UP,this.ENT]],[this.K.J,this.K.L,[this.K.I]]].forEach((ks,i)=>{if(i>=this.ps.length||this.fin.includes(i))return;const p=this.ps[i];p.setVelocityX(ks[0]?.isDown?-sp:ks[1]?.isDown?sp:0);if(ks[2].some(k=>Phaser.Input.Keyboard.JustDown(k))&&p.getData('j')<2){p.setVelocityY(jv);p.setData('j',p.getData('j')+1);}if(p.y>720)p.setPosition(80,570).setVelocity(0,0).setData('j',0);this.bars[i].setSize(Math.min(p.x/3155,1)*180,16);});}
  _fin(i){if(this.fin.includes(i))return;this.fin.push(i);const place=['1ST','2ND','3RD','4TH'][this.fin.length-1];const{width:W}=this.cameras.main;this.add.text(W/2,120+this.fin.length*52,`P${i+1} — ${place}!`,{font:'bold 38px Arial',color:'#f1c40f'}).setOrigin(0.5).setScrollFactor(0).setDepth(20);if(this.fin.length>=this.pc){this.over=true;const b=this.add.rectangle(W/2,560,200,44,0x8e44ad).setInteractive({useHandCursor:true}).setScrollFactor(0).setDepth(21);this.add.text(W/2,560,'MAIN MENU',{font:'bold 18px Arial',color:'#fff'}).setOrigin(0.5).setScrollFactor(0).setDepth(22);b.on('pointerdown',()=>{this.physics.world.gravity.y=0;this.scene.start('MainMenu');});}}
}

// ==================  START  ==================
try {
  new Phaser.Game({
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    backgroundColor: '#1a0533',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: { default:'arcade', arcade:{ gravity:{y:0}, debug:false } },
    scene: [BootScene, MainMenuScene, SkinSelectScene, GameSelectScene, LobbyScene,
            BattleRoyaleScene, SoccerScene, TankBattleScene, BombGameScene, PlatformerRaceScene],
  });
} catch(e) {
  window.showErr?.('Game init failed: ' + (e?.message || String(e)));
}
