import Phaser from 'phaser';

const TANK_COLORS=['red','blue','green','yellow'];
const TANK_KEYS=[
  {up:'W',down:'S',left:'A',right:'D',fire:'F'},
  {up:'UP',down:'DOWN',left:'LEFT',right:'RIGHT',fire:'ENTER'},
  {up:'I',down:'K',left:'J',right:'L',fire:'H'},
  {up:'T',down:'G',left:'F2',right:'H2',fire:'Y'},
];

export default class TankBattleScene extends Phaser.Scene {
  constructor(){ super('TankBattle'); }

  init(data){ this.playerCount=data?.players||2; this.gameOver=false; }

  create(){
    const {width:W,height:H}=this.cameras.main;
    this.add.rectangle(0,0,W,H,0x3e2723).setOrigin(0);
    // Map grid
    for(let x=0;x<W;x+=48) this.add.line(0,0,x,0,x,H,0x4e342e,0.2).setOrigin(0);
    for(let y=0;y<H;y+=48) this.add.line(0,0,0,y,W,y,0x4e342e,0.2).setOrigin(0);

    // Walls
    this.walls=this.physics.add.staticGroup();
    const wallMap=[
      [3,3],[4,3],[5,3],[20,3],[21,3],[22,3],
      [3,10],[3,11],[22,10],[22,11],
      [10,5],[11,5],[12,5],[14,5],[15,5],[16,5],
      [10,9],[11,9],[12,9],[14,9],[15,9],[16,9],
      [7,7],[8,7],[18,7],[19,7],
    ];
    wallMap.forEach(([gx,gy])=>{
      const wall=this.add.rectangle(gx*48+24,gy*48+24,46,46,0x5d4037);
      this.walls.add(wall);
      this.physics.add.existing(wall,true);
    });

    // Tanks
    const spawns=[[96,96],[W-96,H-96],[W-96,96],[96,H-96]];
    this.tanks=[];
    this.turrets=[];
    this.bodies=[];
    for(let i=0;i<this.playerCount;i++){
      const [sx,sy]=spawns[i];
      const body=this.physics.add.image(sx,sy,'tank_body').setRotation(i*Math.PI/2);
      body.setCollideWorldBounds(true);
      const turret=this.add.image(sx,sy,'tank_turret').setDepth(2);
      body.setData({index:i,hp:3,alive:true,fireCooldown:0});
      this.physics.add.collider(body,this.walls);
      this.tanks.push(body);
      this.turrets.push(turret);
    }
    for(let a=0;a<this.tanks.length;a++)
      for(let b=a+1;b<this.tanks.length;b++)
        this.physics.add.collider(this.tanks[a],this.tanks[b]);

    // Shells
    this.shells=this.physics.add.group({maxSize:20});
    this.tanks.forEach((t,i)=>{
      this.physics.add.collider(this.shells,this.walls,(shell)=>{
        shell.setActive(false).setVisible(false);
      });
      this.tanks.forEach((target,ti)=>{
        this.physics.add.overlap(this.shells,target,(shell,hit)=>{
          if(!shell.active) return;
          if(shell.getData('owner')===ti) return;
          shell.setActive(false).setVisible(false);
          this._hitTank(hit);
        });
      });
    });

    // HUD
    this.hpTexts=this.tanks.map((_,i)=>{
      return this.add.text(20+i*200,24,`P${i+1} ❤️❤️❤️`,{font:'bold 16px Arial',color:'#fff'}).setDepth(10);
    });

    // Input
    this.keys=this.input.keyboard.addKeys(
      'W,A,S,D,F,UP,DOWN,LEFT,RIGHT,I,J,K,L,H,T,G,Y'
    );
    this.enterKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  update(_,delta){
    if(this.gameOver) return;
    this.tanks.forEach((tank,i)=>{
      if(!tank.getData('alive')) return;
      const k=TANK_KEYS[i];
      const speed=180, turnSpeed=2.5;
      let moved=false;
      if(i===0){
        if(this.keys.W?.isDown){ tank.setVelocity(Math.cos(tank.rotation)*speed,Math.sin(tank.rotation)*speed); moved=true; }
        else if(this.keys.S?.isDown){ tank.setVelocity(-Math.cos(tank.rotation)*speed,-Math.sin(tank.rotation)*speed); moved=true; }
        else tank.setVelocity(0,0);
        if(this.keys.A?.isDown) tank.setAngularVelocity(-turnSpeed*100);
        else if(this.keys.D?.isDown) tank.setAngularVelocity(turnSpeed*100);
        else tank.setAngularVelocity(0);
        if(Phaser.Input.Keyboard.JustDown(this.keys.F)) this._fire(tank,i);
      } else if(i===1){
        if(this.keys.UP?.isDown){ tank.setVelocity(Math.cos(tank.rotation)*speed,Math.sin(tank.rotation)*speed); moved=true; }
        else if(this.keys.DOWN?.isDown){ tank.setVelocity(-Math.cos(tank.rotation)*speed,-Math.sin(tank.rotation)*speed); moved=true; }
        else tank.setVelocity(0,0);
        if(this.keys.LEFT?.isDown) tank.setAngularVelocity(-turnSpeed*100);
        else if(this.keys.RIGHT?.isDown) tank.setAngularVelocity(turnSpeed*100);
        else tank.setAngularVelocity(0);
        if(Phaser.Input.Keyboard.JustDown(this.enterKey)) this._fire(tank,i);
      }
      // Sync turret to tank position
      this.turrets[i].setPosition(tank.x,tank.y).setRotation(tank.rotation);
      if(tank.getData('fireCooldown')>0) tank.setData('fireCooldown',tank.getData('fireCooldown')-delta);
    });
    this._checkWin();
  }

  _fire(tank,ownerIdx){
    if(tank.getData('fireCooldown')>0) return;
    tank.setData('fireCooldown',600);
    const angle=tank.rotation;
    const shell=this.shells.get(tank.x+Math.cos(angle)*38,tank.y+Math.sin(angle)*38,'tank_shell');
    if(!shell) return;
    shell.setActive(true).setVisible(true).setRotation(angle).setData('owner',ownerIdx);
    if(!shell.body) this.physics.add.existing(shell);
    shell.body.setVelocity(Math.cos(angle)*550,Math.sin(angle)*550);
    this.time.delayedCall(2000,()=>{ if(shell.active) shell.setActive(false).setVisible(false); });
    this.cameras.main.shake(60,0.004);
  }

  _hitTank(tank){
    const hp=tank.getData('hp')-1;
    tank.setData('hp',hp);
    this.tweens.add({targets:tank,alpha:0.2,duration:80,yoyo:true,repeat:3});
    const i=tank.getData('index');
    const hearts='❤️'.repeat(Math.max(0,hp))+'🖤'.repeat(3-Math.max(0,hp));
    this.hpTexts[i].setText(`P${i+1} ${hearts}`);
    if(hp<=0){ tank.setData('alive',false); tank.setActive(false).setVisible(false); this.turrets[i].setVisible(false); }
  }

  _checkWin(){
    const alive=this.tanks.filter(t=>t.getData('alive'));
    if(alive.length<=1){
      this.gameOver=true;
      const {width:W,height:H}=this.cameras.main;
      const msg=alive[0]?`P${alive[0].getData('index')+1} WINS!`:'DRAW!';
      this.add.rectangle(W/2,H/2,500,200,0x1a0533,0.95).setDepth(20);
      this.add.text(W/2,H/2-30,msg,{font:'bold 48px Arial',color:'#f1c40f'}).setOrigin(0.5).setDepth(21);
      const btn=this.add.rectangle(W/2,H/2+50,200,44,0x8e44ad).setInteractive({useHandCursor:true}).setDepth(21);
      this.add.text(W/2,H/2+50,'BACK TO MENU',{font:'bold 18px Arial',color:'#fff'}).setOrigin(0.5).setDepth(22);
      btn.on('pointerdown',()=>this.scene.start('MainMenu'));
    }
  }
}
