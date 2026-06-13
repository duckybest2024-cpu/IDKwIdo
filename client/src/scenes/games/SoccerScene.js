import Phaser from 'phaser';

export default class SoccerScene extends Phaser.Scene {
  constructor() { super('Soccer'); }

  init(data) {
    this.playerCount = data?.players||2;
    this.scores=[0,0];
    this.matchTime=120;
    this.gameOver=false;
  }

  create() {
    const { width:W, height:H }=this.cameras.main;
    // Field
    this.add.rectangle(0,0,W,H,0x2e7d32).setOrigin(0);
    // Lines
    this.add.rectangle(W/2,H/2,4,H-60,0xffffff,0.5);
    this.add.circle(W/2,H/2,80,0xffffff,0).setStrokeStyle(3,0xffffff,0.5);
    this.add.rectangle(0,H/2,200,260,0xffffff,0).setStrokeStyle(3,0xffffff,0.6).setOrigin(0,0.5);
    this.add.rectangle(W,H/2,200,260,0xffffff,0).setStrokeStyle(3,0xffffff,0.6).setOrigin(1,0.5);

    // Goals
    this.leftGoal  = this.add.rectangle(16,H/2,32,200,0xffffff,0.15).setStrokeStyle(3,0xffffff);
    this.rightGoal = this.add.rectangle(W-16,H/2,32,200,0xffffff,0.15).setStrokeStyle(3,0xffffff);
    this.physics.add.existing(this.leftGoal,  true);
    this.physics.add.existing(this.rightGoal, true);

    // Ball
    this.ball = this.physics.add.image(W/2,H/2,'soccer_ball').setCircle(14,2,2);
    this.ball.setBounce(0.85).setMaxVelocity(700,700).setDamping(true).setDrag(0.97);
    this.physics.world.setBoundsCollision(true,true,true,true);
    this.ball.setCollideWorldBounds(true);

    // Players
    const spawns=[[W/4,H/2],[3*W/4,H/2],[W/4-80,H/2+80],[3*W/4+80,H/2-80]];
    const colors=['red','blue','green','yellow'];
    this.players=[];
    for(let i=0;i<this.playerCount;i++){
      const [sx,sy]=spawns[i];
      const p=this.physics.add.image(sx,sy,`player_${colors[i]}`);
      p.setCollideWorldBounds(true).setBounce(0.3);
      p.setData({index:i,team:i%2});
      this.physics.add.collider(p,this.ball,()=>this._kickBall(p));
      this.players.push(p);
    }
    for(let a=0;a<this.players.length;a++)
      for(let b=a+1;b<this.players.length;b++)
        this.physics.add.collider(this.players[a],this.players[b]);

    // Goal detection
    this.physics.add.overlap(this.ball,this.leftGoal,()=>this._goal(1));
    this.physics.add.overlap(this.ball,this.rightGoal,()=>this._goal(0));

    // HUD
    this.scoreText=this.add.text(W/2,28,`${this.scores[0]}  :  ${this.scores[1]}`,{font:'bold 32px Arial',color:'#fff'}).setOrigin(0.5).setDepth(10);
    this.timerText=this.add.text(W/2,62,`2:00`,{font:'18px Arial',color:'#a5d6a7'}).setOrigin(0.5).setDepth(10);
    this.add.text(W/4,20,'RED',{font:'bold 18px Arial',color:'#e74c3c'}).setOrigin(0.5).setDepth(10);
    this.add.text(3*W/4,20,'BLUE',{font:'bold 18px Arial',color:'#3498db'}).setOrigin(0.5).setDepth(10);

    // Timer
    this.time.addEvent({delay:1000,loop:true,callback:()=>{
      if(this.gameOver) return;
      this.matchTime--;
      const m=Math.floor(this.matchTime/60), s=this.matchTime%60;
      this.timerText.setText(`${m}:${s.toString().padStart(2,'0')}`);
      if(this.matchTime<=0) this._endGame();
    }});

    // Input
    this.cursors=this.input.keyboard.createCursorKeys();
    this.wasd=this.input.keyboard.addKeys('W,A,S,D,I,J,K,L');
  }

  update() {
    if(this.gameOver) return;
    const speed=250;
    [[this.wasd.A,this.wasd.D,this.wasd.W,this.wasd.S],
     [this.cursors.left,this.cursors.right,this.cursors.up,this.cursors.down],
     [this.wasd.J,this.wasd.L,this.wasd.I,this.wasd.K],
    ].forEach((keys,i)=>{
      if(i>=this.players.length) return;
      const p=this.players[i]; let vx=0,vy=0;
      if(keys[0]?.isDown) vx=-speed;
      else if(keys[1]?.isDown) vx=speed;
      if(keys[2]?.isDown) vy=-speed;
      else if(keys[3]?.isDown) vy=speed;
      p.setVelocity(vx,vy);
    });
  }

  _kickBall(player) {
    const dx=this.ball.x-player.x, dy=this.ball.y-player.y;
    const dist=Math.sqrt(dx*dx+dy*dy)||1;
    const power=600;
    this.ball.setVelocity(dx/dist*power+player.body.velocity.x*0.5, dy/dist*power+player.body.velocity.y*0.5);
    this.cameras.main.shake(40,0.003);
  }

  _goal(team) {
    if(this.gameOver||this._scoringCooldown) return;
    this._scoringCooldown=true;
    this.scores[team]++;
    this.scoreText.setText(`${this.scores[0]}  :  ${this.scores[1]}`);
    this.cameras.main.flash(300, 255,255,255);
    const { width:W,height:H }=this.cameras.main;
    const goal=this.add.text(W/2,H/2,'GOAL!',{font:'bold 80px Arial',color:'#f1c40f',stroke:'#d35400',strokeThickness:6}).setOrigin(0.5).setDepth(20);
    this.tweens.add({targets:goal,scaleX:1.4,scaleY:1.4,alpha:0,duration:1200,onComplete:()=>goal.destroy()});
    this.ball.setPosition(W/2,H/2).setVelocity(0,0);
    this.time.delayedCall(1500,()=>this._scoringCooldown=false);
  }

  _endGame() {
    this.gameOver=true;
    const { width:W,height:H }=this.cameras.main;
    const msg=this.scores[0]>this.scores[1]?'RED WINS!':
               this.scores[1]>this.scores[0]?'BLUE WINS!':'DRAW!';
    this.add.rectangle(W/2,H/2,500,200,0x1a0533,0.95).setDepth(20);
    this.add.text(W/2,H/2-30,msg,{font:'bold 48px Arial',color:'#f1c40f'}).setOrigin(0.5).setDepth(21);
    this.add.text(W/2,H/2+10,`${this.scores[0]} - ${this.scores[1]}`,{font:'32px Arial',color:'#fff'}).setOrigin(0.5).setDepth(21);
    const btn=this.add.rectangle(W/2,H/2+70,200,44,0x8e44ad).setInteractive({useHandCursor:true}).setDepth(21);
    this.add.text(W/2,H/2+70,'BACK TO MENU',{font:'bold 18px Arial',color:'#fff'}).setOrigin(0.5).setDepth(22);
    btn.on('pointerdown',()=>this.scene.start('MainMenu'));
  }
}
