import Phaser from 'phaser';
import { socketManager } from '../systems/SocketManager.js';
import { authManager } from '../systems/AuthManager.js';

export default class LobbyScene extends Phaser.Scene {
  constructor() { super('Lobby'); }

  init(data) {
    this.gameType = data.gameType;
    this.players  = data.players;
    this.roomData = null;
    this.isHost   = false;
  }

  create() {
    const { width:W, height:H } = this.cameras.main;
    this.add.rectangle(0,0,W,H,0x1a0533).setOrigin(0);
    this.add.text(W/2,60,'ONLINE LOBBY',{font:'bold 40px Arial',color:'#fff'}).setOrigin(0.5);

    socketManager.connect();

    // Room code input area
    this.add.text(W/2,160,'Create a new room or join with code:',{font:'18px Arial',color:'#c39bd3'}).setOrigin(0.5);
    this.roomCodeText = this.add.text(W/2,220,'',{font:'bold 48px Arial',color:'#f1c40f'}).setOrigin(0.5);
    this.statusText   = this.add.text(W/2,280,'',{font:'16px Arial',color:'#2ecc71'}).setOrigin(0.5);

    const createBtn = this._makeBtn(W/2-140,360,'CREATE ROOM',0x8e44ad,200);
    createBtn.on('pointerdown',()=>{
      socketManager.createRoom(this.gameType, this.players, authManager.displayName, localStorage.getItem('selectedSkin'));
      this.isHost = true;
    });

    // Player slots
    this.playerSlots = [];
    for(let i=0;i<4;i++){
      const x = W/2 - 280 + i*190, y = 480;
      const slot = this.add.rectangle(x,y,170,100,0x2d0b5e).setStrokeStyle(2,i===0?0x8e44ad:0x444444);
      const lbl  = this.add.text(x,y,`P${i+1}\nwaiting...`,{font:'16px Arial',color:'#555',align:'center'}).setOrigin(0.5);
      this.playerSlots.push({slot,lbl});
    }

    this.readyBtn = this._makeBtn(W/2,590,'READY',0x27ae60,160);
    this.readyBtn.on('pointerdown',()=>socketManager.ready());

    this._makeBtn(80,H-36,'BACK',0x6c3483,120).on('pointerdown',()=>{
      socketManager.disconnect(); this.scene.start('GameSelect',{players:this.players});
    });

    // Socket listeners
    socketManager.on('room_created', ({roomId,room})=>{
      this.roomCodeText.setText(`CODE: ${roomId}`);
      this.statusText.setText('Share this code with friends!');
      this._updateSlots(room.players);
    });
    socketManager.on('room_updated', (room)=>this._updateSlots(room.players));
    socketManager.on('game_start', (data)=>{
      const key = {battle_royale:'BattleRoyale',soccer:'Soccer',tank_battle:'TankBattle',bomb_game:'BombGame',platformer_race:'PlatformerRace'}[this.gameType]||'BattleRoyale';
      this.scene.start(key,{...data,online:true});
    });
  }

  _updateSlots(players) {
    this.playerSlots.forEach((s,i)=>{
      const p = players[i];
      s.lbl.setText(p ? `${p.name}\n${p.skinId}\n${p.ready?'READY':'...'}`:`P${i+1}\nwaiting...`);
      s.slot.setStrokeStyle(2, p ? 0x8e44ad : 0x444444);
    });
  }

  _makeBtn(x,y,label,color,w=180){
    const btn=this.add.rectangle(x,y,w,44,color).setInteractive({useHandCursor:true});
    this.add.text(x,y,label,{font:'bold 18px Arial',color:'#fff'}).setOrigin(0.5);
    btn.on('pointerover',()=>btn.setAlpha(0.8)); btn.on('pointerout',()=>btn.setAlpha(1));
    return btn;
  }
}
