import Phaser from 'phaser';

const PLAYER_COLORS = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf1c40f];
const PLAYER_KEYS   = [
  { up:'W', down:'S', left:'A', right:'D', attack:'F' },
  { up:'UP', down:'DOWN', left:'LEFT', right:'RIGHT', attack:'ENTER' },
  { up:'I', down:'K', left:'J', right:'L', attack:'H' },
  { up:'T', down:'G', left:'F', right:'H', attack:'Y' },
];

export default class BattleRoyaleScene extends Phaser.Scene {
  constructor() { super('BattleRoyale'); }

  init(data) {
    this.playerCount = data?.players || 2;
    this.gameOver = false;
  }

  create() {
    const { width:W, height:H } = this.cameras.main;
    this.physics.world.setBounds(0,0,W,H);

    // Arena background
    this.add.rectangle(0,0,W,H,0x1a5e1a).setOrigin(0);
    // Grid
    for(let x=0;x<W;x+=80) this.add.line(0,0,x,0,x,H,0x1a7a1a,0.3).setOrigin(0);
    for(let y=0;y<H;y+=80) this.add.line(0,0,0,y,W,y,0x1a7a1a,0.3).setOrigin(0);

    // Obstacles
    this.obstacles = this.physics.add.staticGroup();
    const obPositions = [[200,200],[400,150],[700,300],[900,200],[300,450],[600,500],[1000,400],[150,550],[800,550]];
    obPositions.forEach(([x,y]) => {
      const ob = this.add.rectangle(x,y,80,80,0x5d4037);
      this.obstacles.add(ob);
      this.physics.add.existing(ob, true);
    });

    // Spawn players
    const spawns = [[120,100],[W-120,100],[120,H-100],[W-120,H-100]];
    this.players = [];
    for(let i=0; i<this.playerCount; i++) {
      const [sx,sy] = spawns[i];
      const p = this.physics.add.image(sx,sy,`player_${['red','blue','green','yellow'][i]}`);
      p.setCollideWorldBounds(true);
      p.setData({ index:i, hp:3, maxHp:3, speed:220, attackCooldown:0, alive:true, score:0 });
      this.obstacles.getChildren().forEach(ob => this.physics.add.collider(p, ob));
      this.players.push(p);
    }

    // Player collisions with each other
    for(let a=0;a<this.players.length;a++)
      for(let b=a+1;b<this.players.length;b++)
        this.physics.add.collider(this.players[a],this.players[b]);

    // Power ups
    this.powerUps = this.physics.add.group();
    this._spawnPowerUps();
    this.time.addEvent({ delay:8000, loop:true, callback:this._spawnPowerUps, callbackScope:this });

    // HUD
    this.hpTexts = this.players.map((p,i)=>{
      const x = 20 + i*220;
      this.add.circle(x+16,36,12,PLAYER_COLORS[i]).setDepth(10);
      return this.add.text(x+34,28,`P${i+1}: ❤️❤️❤️`,{font:'bold 16px Arial',color:'#fff'}).setDepth(10);
    });
    this.zoneTimer = this.add.text(W/2,24,'Zone shrinks in 30s',{font:'bold 18px Arial',color:'#e74c3c'}).setOrigin(0.5).setDepth(10);

    // Shrinking zone
    this.zoneRadius = Math.min(W,H)/2 - 40;
    this.zoneCenterX = W/2; this.zoneCenterY = H/2;
    this.zoneGraphic = this.add.graphics().setDepth(5);
    this.zoneCountdown = 30;
    this.time.addEvent({ delay:1000, loop:true, callback:()=>{
      if(this.gameOver) return;
      this.zoneCountdown--;
      this.zoneTimer.setText(`Zone shrinks in ${Math.max(0,this.zoneCountdown)}s`);
      if(this.zoneCountdown<=0){
        this.zoneRadius=Math.max(100,this.zoneRadius-30);
        this.zoneCountdown=15;
      }
    }});

    // Keys
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd    = this.input.keyboard.addKeys('W,A,S,D,F,I,J,K,L,H,Y,T,G');
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // Attack bullets
    this.bullets = this.physics.add.group({ maxSize:40 });
    this.players.forEach(p=>{
      this.physics.add.overlap(this.bullets, p, (bullet,target)=>{
        if(!bullet.active) return;
        const shooter = bullet.getData('owner');
        if(shooter===target.getData('index')) return;
        bullet.setActive(false).setVisible(false);
        this._hitPlayer(target);
      });
    });
  }

  update(time, delta) {
    if(this.gameOver) return;
    const dt = delta/1000;
    this.players.forEach((p,i)=>{
      if(!p.getData('alive')) return;
      this._movePlayer(p,i,dt);
      this._checkZone(p);
      if(p.getData('attackCooldown')>0) p.setData('attackCooldown', p.getData('attackCooldown')-delta);
    });
    this._drawZone();
    this._updateHUD();
    this._checkWin();
  }

  _movePlayer(p,i,dt) {
    const speed = p.getData('speed');
    let vx=0,vy=0;
    const k = PLAYER_KEYS[i];
    if(i===0){
      if(this.wasd.A?.isDown) vx=-speed;
      else if(this.wasd.D?.isDown) vx=speed;
      if(this.wasd.W?.isDown) vy=-speed;
      else if(this.wasd.S?.isDown) vy=speed;
      if(Phaser.Input.Keyboard.JustDown(this.wasd.F)) this._shoot(p,i,vx,vy);
    } else if(i===1){
      if(this.cursors.left?.isDown) vx=-speed;
      else if(this.cursors.right?.isDown) vx=speed;
      if(this.cursors.up?.isDown) vy=-speed;
      else if(this.cursors.down?.isDown) vy=speed;
      if(Phaser.Input.Keyboard.JustDown(this.enterKey)) this._shoot(p,i,vx,vy);
    } else if(i===2){
      if(this.wasd.J?.isDown) vx=-speed;
      else if(this.wasd.L?.isDown) vx=speed;
      if(this.wasd.I?.isDown) vy=-speed;
      else if(this.wasd.K?.isDown) vy=speed;
      if(Phaser.Input.Keyboard.JustDown(this.wasd.H)) this._shoot(p,i,vx,vy);
    } else if(i===3){
      if(this.wasd.T?.isDown) vx=-speed;
      else if(this.wasd.G?.isDown) vx=speed;
    }
    p.setVelocity(vx,vy);
    if(vx!==0||vy!==0) p.setRotation(Math.atan2(vy,vx));
  }

  _shoot(p,ownerIdx,vx,vy) {
    if(p.getData('attackCooldown')>0) return;
    p.setData('attackCooldown',500);
    const dir = { x: vx||1, y:vy||0 };
    const len = Math.sqrt(dir.x**2+dir.y**2)||1;
    dir.x/=len; dir.y/=len;
    const b = this.bullets.get(p.x+dir.x*30, p.y+dir.y*30);
    if(!b) return;
    b.setActive(true).setVisible(true)
      .setSize(12,12)
      .setData('owner', ownerIdx);
    if(!b.body) this.physics.add.existing(b);
    b.body.setVelocity(dir.x*500, dir.y*500);
    this.time.delayedCall(1200,()=>{ if(b.active){b.setActive(false).setVisible(false);} });
  }

  _hitPlayer(p) {
    const hp = p.getData('hp')-1;
    p.setData('hp', hp);
    this.cameras.main.shake(80,0.006);
    this.tweens.add({targets:p, alpha:0.2, duration:80, yoyo:true, repeat:2});
    if(hp<=0) {
      p.setData('alive',false);
      p.setActive(false).setVisible(false);
    }
  }

  _checkZone(p) {
    const dx=p.x-this.zoneCenterX, dy=p.y-this.zoneCenterY;
    if(Math.sqrt(dx*dx+dy*dy)>this.zoneRadius) {
      if(this.time.now % 1000 < 20) this._hitPlayer(p);
    }
  }

  _drawZone() {
    this.zoneGraphic.clear()
      .lineStyle(3,0xe74c3c,0.8).strokeCircle(this.zoneCenterX,this.zoneCenterY,this.zoneRadius)
      .fillStyle(0xe74c3c,0.06).fillCircle(this.zoneCenterX,this.zoneCenterY,this.zoneRadius+300);
  }

  _spawnPowerUps() {
    const types=[{color:0x27ae60,type:'heal'},{color:0xf39c12,type:'speed'},{color:0xe74c3c,type:'attack'}];
    const t=types[Phaser.Math.Between(0,2)];
    const pu=this.add.circle(Phaser.Math.Between(100,1180),Phaser.Math.Between(80,640),16,t.color);
    this.physics.add.existing(pu);
    this.powerUps.add(pu);
    pu.setData('type',t.type);
    this.players.forEach(p=>{
      this.physics.add.overlap(p,pu,()=>{
        if(!pu.active) return;
        this._applyPowerUp(p,t.type);
        pu.destroy();
      });
    });
    this.time.delayedCall(10000,()=>{ if(pu.active) pu.destroy(); });
  }

  _applyPowerUp(p,type) {
    if(type==='heal') p.setData('hp',Math.min(p.getData('maxHp'),p.getData('hp')+1));
    else if(type==='speed') { p.setData('speed',320); this.time.delayedCall(5000,()=>p.setData('speed',220)); }
  }

  _updateHUD() {
    this.players.forEach((p,i)=>{
      const hp=p.getData('hp'), maxHp=p.getData('maxHp');
      const hearts='❤️'.repeat(Math.max(0,hp))+'🖤'.repeat(Math.max(0,maxHp-hp));
      this.hpTexts[i].setText(`P${i+1}: ${hearts}`);
    });
  }

  _checkWin() {
    const alive=this.players.filter(p=>p.getData('alive'));
    if(alive.length<=1&&this.players.length>1) {
      this.gameOver=true;
      const winner=alive[0];
      const { width:W,height:H }=this.cameras.main;
      this.add.rectangle(W/2,H/2,500,200,0x1a0533,0.95).setDepth(20);
      const msg=winner?`P${winner.getData('index')+1} WINS!`:'DRAW!';
      this.add.text(W/2,H/2-30,msg,{font:'bold 48px Arial',color:'#f1c40f'}).setOrigin(0.5).setDepth(21);
      const btn=this.add.rectangle(W/2,H/2+50,200,44,0x8e44ad).setInteractive({useHandCursor:true}).setDepth(21);
      this.add.text(W/2,H/2+50,'BACK TO MENU',{font:'bold 18px Arial',color:'#fff'}).setOrigin(0.5).setDepth(22);
      btn.on('pointerdown',()=>this.scene.start('MainMenu'));
    }
  }
}
