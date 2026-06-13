import Phaser from 'phaser';

const GRID=48, COLS=26, ROWS=14;
const PLAYER_STARTS=[[1,1],[COLS-2,1],[1,ROWS-2],[COLS-2,ROWS-2]];
const COLORS=[0xe74c3c,0x3498db,0x2ecc71,0xf1c40f];

export default class BombGameScene extends Phaser.Scene {
  constructor(){ super('BombGame'); }
  init(data){ this.playerCount=data?.players||2; this.gameOver=false; }

  create(){
    const {width:W,height:H}=this.cameras.main;
    this.add.rectangle(0,0,W,H,0x1b5e20).setOrigin(0);

    // Map: 0=empty,1=wall(indestructible),2=breakable
    this.mapData=[];
    for(let r=0;r<ROWS;r++){
      this.mapData[r]=[];
      for(let c=0;c<COLS;c++){
        const edge=r===0||r===ROWS-1||c===0||c===COLS-1;
        const pillar=r%2===0&&c%2===0;
        this.mapData[r][c]=edge||pillar?1:0;
      }
    }
    // Fill random breakables
    for(let r=1;r<ROWS-1;r++)
      for(let c=1;c<COLS-1;c++){
        if(this.mapData[r][c]!==0) continue;
        const corner=PLAYER_STARTS.some(([pc,pr])=>Math.abs(c-pc)<=1&&Math.abs(r-pr)<=1);
        if(!corner&&Math.random()<0.55) this.mapData[r][c]=2;
      }

    // Draw map
    this.wallObjects=[];
    this.breakObjects={};
    for(let r=0;r<ROWS;r++)
      for(let c=0;c<COLS;c++){
        const x=c*GRID+GRID/2, y=r*GRID+GRID/2;
        if(this.mapData[r][c]===1){
          const w=this.add.rectangle(x,y,GRID-2,GRID-2,0x4e342e).setStrokeStyle(1,0x3e2723);
          this.physics.add.existing(w,true);
          this.wallObjects.push(w);
        } else if(this.mapData[r][c]===2){
          const b=this.add.rectangle(x,y,GRID-4,GRID-4,0x8d6e63).setStrokeStyle(1,0x795548);
          this.physics.add.existing(b,true);
          this.breakObjects[`${r},${c}`]=b;
        }
      }

    // Players
    this.players=[];
    this.alive=[...Array(this.playerCount)].map(()=>true);
    for(let i=0;i<this.playerCount;i++){
      const [gc,gr]=PLAYER_STARTS[i];
      const p=this.physics.add.rectangle(gc*GRID+GRID/2,gr*GRID+GRID/2,GRID-10,GRID-10,COLORS[i]);
      p.setDepth(2);
      p.body.setCollideWorldBounds(true);
      this.wallObjects.forEach(w=>this.physics.add.collider(p,w));
      this.players.push(p);
    }
    for(let a=0;a<this.players.length;a++)
      for(let b=a+1;b<this.players.length;b++)
        this.physics.add.collider(this.players[a],this.players[b]);

    // Bombs group
    this.bombs=[];
    this.blastTiles=this.add.group();

    // HUD
    this.aliveText=this.add.text(W/2,14,`${this.playerCount} players`,{font:'bold 18px Arial',color:'#fff'}).setOrigin(0.5).setDepth(10);

    // Input
    this.keys=this.input.keyboard.addKeys('W,A,S,D,SPACE,UP,DOWN,LEFT,RIGHT,I,J,K,L,H,T,G,F');
    this.enterKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  update(){
    if(this.gameOver) return;
    const speed=180;
    this.players.forEach((p,i)=>{
      if(!this.alive[i]) return;
      let vx=0,vy=0;
      if(i===0){
        if(this.keys.A?.isDown) vx=-speed;
        else if(this.keys.D?.isDown) vx=speed;
        if(this.keys.W?.isDown) vy=-speed;
        else if(this.keys.S?.isDown) vy=speed;
        if(Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) this._placeBomb(i);
      } else if(i===1){
        if(this.keys.LEFT?.isDown) vx=-speed;
        else if(this.keys.RIGHT?.isDown) vx=speed;
        if(this.keys.UP?.isDown) vy=-speed;
        else if(this.keys.DOWN?.isDown) vy=speed;
        if(Phaser.Input.Keyboard.JustDown(this.enterKey)) this._placeBomb(i);
      } else if(i===2){
        if(this.keys.J?.isDown) vx=-speed;
        else if(this.keys.L?.isDown) vx=speed;
        if(this.keys.I?.isDown) vy=-speed;
        else if(this.keys.K?.isDown) vy=speed;
        if(Phaser.Input.Keyboard.JustDown(this.keys.H)) this._placeBomb(i);
      } else if(i===3){
        if(this.keys.T?.isDown) vx=-speed;
        else if(this.keys.G?.isDown) vx=speed;
        if(Phaser.Input.Keyboard.JustDown(this.keys.F)) this._placeBomb(i);
      }
      p.body.setVelocity(vx,vy);
    });
  }

  _placeBomb(ownerIdx){
    const p=this.players[ownerIdx];
    const gc=Math.round((p.x-GRID/2)/GRID), gr=Math.round((p.y-GRID/2)/GRID);
    const key=`bomb_${gc}_${gr}`;
    if(this.bombs.find(b=>b.key===key)) return;
    const bx=gc*GRID+GRID/2, by=gr*GRID+GRID/2;
    const bomb=this.add.circle(bx,by,GRID/2-6,0x212121).setDepth(3);
    const fuse=this.add.circle(bx+8,by-8,5,0xff6b35).setDepth(4);
    const bombObj={key,gc,gr,bomb,fuse,owner:ownerIdx};
    this.bombs.push(bombObj);
    this.tweens.add({targets:fuse,scale:0,duration:2500,onComplete:()=>this._explode(bombObj)});
    this.tweens.add({targets:bomb,scale:1.1,duration:300,yoyo:true,repeat:3});
  }

  _explode(bombObj){
    if(!bombObj.bomb.active) return;
    this.bombs=this.bombs.filter(b=>b!==bombObj);
    bombObj.bomb.destroy(); bombObj.fuse.destroy();
    const {gc,gr}=bombObj;
    const range=3;
    const tiles=[[gc,gr]];
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{
      for(let i=1;i<=range;i++){
        const nc=gc+dx*i, nr=gr+dy*i;
        if(nr<0||nr>=ROWS||nc<0||nc>=COLS) break;
        if(this.mapData[nr][nc]===1) break;
        tiles.push([nc,nr]);
        if(this.mapData[nr][nc]===2){ this._breakTile(nc,nr); break; }
      }
    });
    tiles.forEach(([c,r])=>{
      const x=c*GRID+GRID/2,y=r*GRID+GRID/2;
      const ex=this.add.circle(x,y,GRID/2-2,0xff4500,0.9).setDepth(5);
      this.time.delayedCall(500,()=>ex.destroy());
      this.players.forEach((p,i)=>{
        if(!this.alive[i]) return;
        if(Math.abs(p.x-x)<GRID-5&&Math.abs(p.y-y)<GRID-5) this._killPlayer(i);
      });
    });
    this.cameras.main.shake(100,0.008);
  }

  _breakTile(c,r){
    const key=`${r},${c}`;
    const tile=this.breakObjects[key];
    if(tile){ tile.destroy(); delete this.breakObjects[key]; this.mapData[r][c]=0; }
  }

  _killPlayer(i){
    if(!this.alive[i]) return;
    this.alive[i]=false;
    this.tweens.add({targets:this.players[i],alpha:0,scale:2,duration:400,onComplete:()=>this.players[i].setVisible(false)});
    const count=this.alive.filter(Boolean).length;
    this.aliveText.setText(`${count} player${count!==1?'s':''} remaining`);
    this._checkWin();
  }

  _checkWin(){
    const aliveIdxs=this.alive.map((a,i)=>a?i:-1).filter(i=>i>=0);
    if(aliveIdxs.length<=1){
      this.gameOver=true;
      const {width:W,height:H}=this.cameras.main;
      const msg=aliveIdxs.length===1?`P${aliveIdxs[0]+1} WINS!`:'DRAW!';
      this.add.rectangle(W/2,H/2,500,200,0x1a0533,0.95).setDepth(20);
      this.add.text(W/2,H/2-30,msg,{font:'bold 48px Arial',color:'#f1c40f'}).setOrigin(0.5).setDepth(21);
      const btn=this.add.rectangle(W/2,H/2+50,200,44,0x8e44ad).setInteractive({useHandCursor:true}).setDepth(21);
      this.add.text(W/2,H/2+50,'BACK TO MENU',{font:'bold 18px Arial',color:'#fff'}).setOrigin(0.5).setDepth(22);
      btn.on('pointerdown',()=>this.scene.start('MainMenu'));
    }
  }
}
