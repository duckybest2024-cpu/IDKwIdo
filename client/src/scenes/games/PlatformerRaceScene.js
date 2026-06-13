import Phaser from 'phaser';

const COLORS=[0xe74c3c,0x3498db,0x2ecc71,0xf1c40f];

export default class PlatformerRaceScene extends Phaser.Scene {
  constructor(){ super('PlatformerRace'); }
  init(data){ this.playerCount=data?.players||2; this.gameOver=false; this.finished=[]; }

  create(){
    this.physics.world.gravity.y=600;
    const W=3200, H=720;
    this.physics.world.setBounds(0,0,W,H);

    this.add.rectangle(0,0,W,H,0x1565c0).setOrigin(0).setScrollFactor(1);
    // Parallax clouds
    for(let i=0;i<20;i++){
      const cx=Phaser.Math.Between(0,W), cy=Phaser.Math.Between(60,200);
      this.add.ellipse(cx,cy,Phaser.Math.Between(80,160),40,0xffffff,0.25).setScrollFactor(0.3);
    }

    // Platforms
    const platformData=[
      [0,660,800,24], [0,400,200,24], [300,340,200,24], [550,300,180,24],
      [760,340,200,24],[1000,280,160,24],[1200,320,180,24],[1400,260,160,24],
      [1600,300,200,24],[1800,240,180,24],[2000,280,200,24],[2200,220,180,24],
      [2400,260,160,24],[2600,200,180,24],[2800,240,200,24],[3000,180,200,24],
      [3100,660,120,24],
    ];
    this.platforms=this.physics.add.staticGroup();
    platformData.forEach(([x,y,w,h])=>{
      const p=this.add.rectangle(x+w/2,y,w,h,0x4caf50).setStrokeStyle(2,0x388e3c);
      this.platforms.add(p); this.physics.add.existing(p,true);
    });

    // Coins
    this.coins=this.physics.add.staticGroup();
    for(let i=0;i<60;i++){
      const cx=Phaser.Math.Between(100,3100), cy=Phaser.Math.Between(100,600);
      const coin=this.add.circle(cx,cy,10,0xf1c40f);
      this.coins.add(coin); this.physics.add.existing(coin,true);
    }

    // Finish line
    this.finishLine=this.add.rectangle(3150,H/2,10,H,0xffffff,0.8);
    this.physics.add.existing(this.finishLine,true);
    this.add.text(3155,80,'FINISH',{font:'bold 24px Arial',color:'#fff'}).setScrollFactor(1);

    // Players
    this.players=[];
    this.coinCounts=[];
    this.nameTexts=[];
    this.progressBars=[];
    for(let i=0;i<this.playerCount;i++){
      const p=this.physics.add.rectangle(80,580,30,36,COLORS[i]);
      p.setCollideWorldBounds(true);
      p.setData({index:i,coinCount:0,jumps:0,maxJumps:2});
      this.physics.add.collider(p,this.platforms,()=>p.setData('jumps',0));
      this.physics.add.overlap(p,this.coins,(player,coin)=>{
        coin.destroy(); p.setData('coinCount',p.getData('coinCount')+1);
      });
      this.physics.add.overlap(p,this.finishLine,()=>this._playerFinished(i));
      this.players.push(p);
      this.coinCounts.push(0);

      // Progress bar
      const pbBg=this.add.rectangle(160+i*240,24,200,20,0x444444).setScrollFactor(0).setDepth(10);
      const pb=this.add.rectangle(60+i*240,24,0,18,COLORS[i]).setOrigin(0,0.5).setScrollFactor(0).setDepth(11);
      this.add.text(60+i*240,24,`P${i+1}`,{font:'bold 14px Arial',color:'#fff'}).setOrigin(0,0.5).setScrollFactor(0).setDepth(12);
      this.progressBars.push(pb);
    }

    // Camera follows P1
    this.cameras.main.setBounds(0,0,W,H);
    this.cameras.main.startFollow(this.players[0],true,0.1,0.1);

    // Input
    this.keys=this.input.keyboard.addKeys('W,A,D,SPACE,UP,LEFT,RIGHT,I,J,L,H,T,G,F');
    this.enterKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  update(){
    if(this.gameOver) return;
    const speed=220, jumpV=-520;
    this.players.forEach((p,i)=>{
      if(this.finished.includes(i)) return;
      let vx=0;
      if(i===0){
        if(this.keys.A?.isDown) vx=-speed;
        else if(this.keys.D?.isDown) vx=speed;
        if(Phaser.Input.Keyboard.JustDown(this.keys.W)||Phaser.Input.Keyboard.JustDown(this.keys.SPACE))
          if(p.getData('jumps')<p.getData('maxJumps')){ p.setVelocityY(jumpV); p.setData('jumps',p.getData('jumps')+1); }
      } else if(i===1){
        if(this.keys.LEFT?.isDown) vx=-speed;
        else if(this.keys.RIGHT?.isDown) vx=speed;
        if(Phaser.Input.Keyboard.JustDown(this.keys.UP))
          if(p.getData('jumps')<p.getData('maxJumps')){ p.setVelocityY(jumpV); p.setData('jumps',p.getData('jumps')+1); }
      } else if(i===2){
        if(this.keys.J?.isDown) vx=-speed;
        else if(this.keys.L?.isDown) vx=speed;
        if(Phaser.Input.Keyboard.JustDown(this.keys.I))
          if(p.getData('jumps')<p.getData('maxJumps')){ p.setVelocityY(jumpV); p.setData('jumps',p.getData('jumps')+1); }
      }
      p.setVelocityX(vx);

      // Respawn if fallen
      if(p.y>H) p.setPosition(80,580).setVelocity(0,0);

      // Progress bar (x position / total width)
      const pct=Math.min(p.x/3150,1);
      this.progressBars[i].setSize(pct*180,18);
    });
  }

  _playerFinished(i){
    if(this.finished.includes(i)) return;
    this.finished.push(i);
    const place=['1ST','2ND','3RD','4TH'][this.finished.length-1];
    const {width:W,height:H}=this.cameras.main;
    this.add.text(W/2,H/2-60+this.finished.length*50,`P${i+1} — ${place}!`,
      {font:'bold 36px Arial',color:'#f1c40f'}).setOrigin(0.5).setScrollFactor(0).setDepth(20);
    if(this.finished.length>=this.playerCount||this.finished.length===1&&this.playerCount===1){
      this.gameOver=true;
      const btn=this.add.rectangle(W/2,H/2+80,200,44,0x8e44ad).setInteractive({useHandCursor:true}).setScrollFactor(0).setDepth(21);
      this.add.text(W/2,H/2+80,'BACK TO MENU',{font:'bold 18px Arial',color:'#fff'}).setOrigin(0.5).setScrollFactor(0).setDepth(22);
      btn.on('pointerdown',()=>{ this.physics.world.gravity.y=0; this.scene.start('MainMenu'); });
    }
  }
}
