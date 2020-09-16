import { Component, OnInit, Input,ViewChild, ElementRef, Renderer2 } from '@angular/core';
import {AngularPageVisibilityStateEnum, AngularPageVisibilityService} from 'angular-page-visibility';
import {Observable,Subject} from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import {ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';

import {PositionsEnum, PlayerPositionsEnum, CardsEnum, MoveTypesEnum, GameStatesEnum} from 's-n-m-lib';
import {SMUtils, IProfileModel, IPlayerModel,IMoveModel,Move, ICardModel, Card} from 's-n-m-lib';
import {Options} from '../classes/options';
import {Game} from '../classes/games';
import {SelectedCard} from '../classes/selected-card';

import {GameService} from '../services/game.service';
import {MoveService} from '../services/move.service';
import {DealerService} from '../services/dealer.service';
import {PlayerService} from '../services/player.service';
import {ProfileService} from '../services/profile.service';
import {WsService} from '../services/ws.service';
import {Animations,DEFAULT_DURATIONS} from './animation';
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: 'app-play-area',
  templateUrl: './play-area.component.html',
  styleUrls: ['./play-area.component.css'],
  animations:Animations
})
export class PlayAreaComponent implements OnInit {
  pE=PositionsEnum;
  pPE=PlayerPositionsEnum;
  cE=CardsEnum;
  mtE=MoveTypesEnum;
  players$:Observable<IPlayerModel[]>;
  profile:IProfileModel;
  game:Game;
  from:SelectedCard=new SelectedCard(-1,-1);
  to:SelectedCard=new SelectedCard(-1,-1);
  moves:IMoveModel[]=[];
  message="";
  players:IPlayerModel[];
  pageVisible:boolean=true;
  
  //animation control
  NO_MOVE={top:-1,left:-1};
  fromRect=this.NO_MOVE;
  toRect=this.NO_MOVE;
  animTrigger="from";
  m:IMoveModel=new Move();
  animating:boolean=false;
  
  activeGameUuid: string;
  subscribedToMoveSvc:boolean=false;
  $onMoves;

  APO=()=>{return this.game.activePlayer*this.pPE.PLAYER_2}; /*ACTIVE PLAYER OFFSET */
  
  constructor(private pageVisSvc: AngularPageVisibilityService,
              private router: Router,
              private route: ActivatedRoute,
              private gameSvc:GameService, 
              private moveSvc:MoveService, 
              private dealerSvc:DealerService, 
              private playerSvc:PlayerService,  
              private profileSvc:ProfileService, 
              private renderer:Renderer2,
              private wsSvc:WsService) { 
      console.log(`PlayAreaComponent: constructor`);
  }

  ngOnInit() {
    this.pageVisSvc.$onPageVisibilityChange.subscribe(( visibilityState: AngularPageVisibilityStateEnum ) => {
        if ( visibilityState === AngularPageVisibilityStateEnum.VISIBLE ) {
          console.log( 'OnInit => visibilityChange => visible' );
        } else if (visibilityState === AngularPageVisibilityStateEnum.HIDDEN) {
          console.log( 'OnInit => visibilityChange => hidden' );
        } else if (visibilityState === AngularPageVisibilityStateEnum.PRERENDER) {
          console.log( 'OnInit => visibilityChange => prerender' );
        } else if (visibilityState === AngularPageVisibilityStateEnum.UNLOADED) {
          console.log( 'OnInit => visibilityChange => unloaded' );
        }
      } );
    //     moveSvc.init();
    this.route.params.subscribe(async (val) => {
        const gameUuid = val.gameUuid;
        this.activeGameUuid = gameUuid;
        console.log(`***** route change [${this.activeGameUuid}] subscribed:${this.$onMoves?true:false}`);
        if(gameUuid){
            try{
                this.game = await this.gameSvc.getGame$(gameUuid).toPromise(); 
                this.players$=this.playerSvc.getPlayers$([this.game.player1Uuid,this.game.player2Uuid]).pipe(
                    tap((players)=>{
                        this.players=players;
                    }));
                this.profile = this.profileSvc.getActiveProfile(); 
                this.game.onStateChange$().subscribe({
                    next:async (gameState)=>{
                        this.gameSvc.updateGameState(this.game.toModel());
                        switch(gameState){
                        case GameStatesEnum.GAME_OVER:
                            let players  = await this.playerSvc.getPlayers$([this.game.player1Uuid,this.game.player2Uuid]).toPromise();
                            this.message = `Congratulations ${players[this.game.activePlayer].name} you are the Winner.`;
                            break;
                        case GameStatesEnum.DRAW:
                            this.message = `There are no cards left. We will have to call this a draw.`;
                            break;
                        }},
                    error:(err)=>{
                        console.error(`Error onStateChange ${JSON.stringify(err)}`);
                    },
                    complete:()=>{}
                });
                const activePlayer:IPlayerModel= this.playerSvc.getActivePlayer();
//                  wsSvc.joinGame(activePlayer.uuid,this.game.uuid);
//                  this.game.getCards(this.pE.PLAYER_PILE).splice(0,this.game.getCards(this.pE.PLAYER_PILE).length);
//                  this.game.getCards(this.pE.PLAYER_PILE).push(new Card(this.cE.ACE,this.pE.PLAYER_PILE));
//                  this.game.getCards(this.pE.PLAYER_HAND_1).splice(0,this.game.getCards(this.pE.PLAYER_HAND_1).length);
//                  this.game.getCards(this.pE.PLAYER_HAND_1).push(new Card(this.cE.ACE,this.pE.PLAYER_HAND_1));
//                  this.game.getCards(this.pE.PLAYER_HAND_1+10).splice(0,this.game.getCards(this.pE.PLAYER_HAND_1).length);
//                  this.game.getCards(this.pE.DECK).splice(1,this.game.getCards(this.pE.DECK).length);
//                  this.game.getCards(this.pE.PLAYER_HAND_1).push(new Card(this.cE.ACE,this.pE.PLAYER_HAND_1));

            }catch(err){
                console.error(`catch block ${err} ${JSON.stringify(err)}`);
                this.router.navigate(['/']);
            }
        }
    });
    console.log(`***** initialise play-area [${this.activeGameUuid}]`);

    this.$onMoves=this.moveSvc.$onMoves
    this.$onMoves.subscribe((ms)=>{
        console.log(`moveSvc subscription [${ms.gameUuid}] [${ms.moves.length}] `);
        if(ms.gameUuid==this.activeGameUuid){
            this.performMoves(ms.gameUuid,ms.moves);
        }
    });
  }
  performMoves(gameUuid: string, moves: IMoveModel[]) {
      if(!this.animating){
          this.animTrigger='from';
      }
      if(this.game && gameUuid == this.game.uuid){      //only act on moves for this game
          
          this.moves.push(... moves);
          this.nextMove();
      }
  }
  nextMove(){
      let m:IMoveModel;
      if(this.moves.length>0 && this.pageVisible){
          m = this.moves.splice(0,1)[0]
          if(this.profile.animation.animateYN){
              let animate:boolean=true;
              switch(m.type){
                  case this.mtE.PLAYER:                      
                      if(m.from>=this.pE.PLAYER_PILE && m.from<=this.pE.PLAYER_STACK_4){
                          animate = this.profile.animation.animate.playerYN;
                      }else{
                          animate = this.profile.animation.animate.opponentYN;
                      }
                      break;
                  case this.mtE.DEALER:
                      animate = this.profile.animation.animate.dealerYN;
                      break;
                  case this.mtE.RECYCLE:
                      animate = this.profile.animation.animate.recycleYN;
                      break;
              }
              if(animate){
                  this.startAnimation(m);
              }else{
                  this.performMove(m);
              }    
          }else{
               this.performMove(m);
          }
      }
  }
  animationDuration(m:IMoveModel):number{
      let duration:number;
      if(m.type == this.mtE.REMOTE){
         duration = DEFAULT_DURATIONS['DEALER'];
      }else{
         duration= DEFAULT_DURATIONS[this.mtE[m.type]];
      }
      switch(m.type){
          case this.mtE.PLAYER:
              if(m.playerUuid==this.playerSvc.getActivePlayer().uuid){
                  duration = duration*this.profile.animation.animate.player;
              }else{
                  duration = duration*this.profile.animation.animate.opponent;
              }
              break;
          case this.mtE.REMOTE:
          case this.mtE.DEALER:
              duration = duration*this.profile.animation.animate.dealer;
              break;
          case this.mtE.RECYCLE:
              duration = duration*this.profile.animation.animate.recycle;
              break;
      }
      return duration;
  }
  startAnimation(m:IMoveModel){
      if(!this.animating){
          this.fromRect=this.pos2ClientRec(m.from);
          this.toRect=this.pos2ClientRec(m.to);
          this.m=m;       
          
          setTimeout(()=>{ 
              //wrap in time out to allow page to render animation card into position before start to move it.
              this.animating=true;
              this.animTrigger='to';
          },1); 
      }else{
          setTimeout(()=>{ // If we are already animating then wait for the animation duration  before trying to start a new animation
              this.nextMove();
          },this.animationDuration(this.m));
      }
  }
  animDone(evt){
      let movingPlayerUuid = this.m.playerUuid;
      
      if(evt.fromState=='from'){
        // move the card
        this.animating=false;
        console.log(`play-area.performMove WITH ANIMATION`);
        this.game.performMove(this.m);
        if(this.m.type==this.mtE.PLAYER){
            if(this.m.isDiscard){
                this.m=new Move();
                this.animTrigger='from';
                this.game.switchPlayer();
                if(this.game.local || this.playerSvc.getActivePlayer().uuid==movingPlayerUuid){
                    this.dealerSvc.fillHand(this.game.activePlayer, this.game);
                }
                this.gameSvc.updateGame(this.game.toModel());
            }else{
                if(this.game.cardsInHand()==0){
                    this.m=new Move();
                    this.animTrigger='from';
                    if(this.game.local || this.playerSvc.getActivePlayer().uuid==movingPlayerUuid){
                        this.dealerSvc.fillHand(this.game.activePlayer, this.game);
                    }
                    this.gameSvc.updateGame(this.game.toModel());
                }else{
                    let to = this.m.to;
                    let c = this.m.card;
                    this.m=new Move();
                    this.animTrigger='from';
                    //IF just added a KING to a Game Stack, move to recycle
                    if(to>=this.pE.STACK_1 && 
                       to<=this.pE.STACK_4 && 
                       (SMUtils.getTopOfStack(this.game.getCards(to))== this.cE.KING)
                      ){
                        if(this.game.local || this.playerSvc.getActivePlayer().uuid==movingPlayerUuid){
                            this.moveSvc.moveToRecycle(this.game,to);
                        }
                    }
                }            
            }
        }else{
            this.m=new Move();
            this.animTrigger='from';
        }
        setTimeout(()=>{
            this.nextMove();
        },100);
      }
  }
 
 /**
  * Called when not animating
  * @param m
  */
  performMove(m:IMoveModel){
      let movingPlayerGuid = m.playerUuid;
      console.log(`play-area.performMove NO ANIMATION`);
      this.game.performMove(m);
      if(m.type==this.mtE.PLAYER){
          if(m.isDiscard){
              this.m=new Move();
              this.game.switchPlayer();
              this.dealerSvc.fillHand(this.game.activePlayer, this.game);
              this.gameSvc.updateGame(this.game.toModel());
          }else{
              if(this.game.cardsInHand()==0){
                  this.m=new Move();
                  this.dealerSvc.fillHand(this.game.activePlayer, this.game);
                  this.gameSvc.updateGame(this.game.toModel());
              }else{
                  let to = m.to;
                  let c = m.card;
                  this.m=new Move();
                  //IF just added a KING to a Game Stack, move to recycle
                  if(to>=this.pE.STACK_1 && 
                     to<=this.pE.STACK_4 &&  
                     (SMUtils.getTopOfStack(this.game.getCards(to))== this.cE.KING)
                  ){
                    console.log(`On Recycle this.player ${this.profileSvc.playerGuid}== ${movingPlayerGuid}`);
                    this.moveSvc.moveToRecycle(this.game,to);
                }
              }            
          }
      }
      this.nextMove();
  }
  async select(selectedCard: SelectedCard){
      if(this.from.cardNo==-1){
          this.from= selectedCard;
      }else{
          if(this.from.position==selectedCard.position){
              this.from = new SelectedCard(-1,-1);
              this.to = new SelectedCard(-1,-1);
          }else{
              this.to = selectedCard;
              let move = new Move();
              move.from=this.from.position;
              move.card=this.from.cardNo;
              move.to=this.to.position;
              move.type = MoveTypesEnum.PLAYER;
              move.isDiscard=this.isDiscard(this.to.position);
              const players = await this.players$.toPromise();
              this.moveSvc.addMove(this.game,players[this.game.activePlayer].uuid, move);
              
              //reset selected Positions
              this.from = new SelectedCard(-1,-1);
              this.to = new SelectedCard(-1,-1);
          }
      }
  }
  getOptions(position:number):Options{
      const opt:Options=new Options();
      let isActivePlayerSelectable:boolean=false;
      let cardAtPosition:Card;
  
      if(this.game.local){
          isActivePlayerSelectable=true;
      }else{
          const activePlayer = this.playerSvc.getActivePlayer();
          isActivePlayerSelectable= (this.players[this.game.activePlayer].uuid===activePlayer.uuid);
      }
  
      opt.selected=(this.from.position==position);
      if([this.pE.DECK,this.pE.RECYCLE].includes(position)){
          opt.showCardFace=false;
      }
  
      //if there is no card at this position and it is the centre stack or active player's stack
      if(this.game.getCards(position).length==0){
         switch(position){
             case this.pE.PLAYER_PILE+(this.APO()):
                 //Pile can't be empty while game in play
                 break;
             case this.pE.PLAYER_HAND_1+(this.APO()):
             case this.pE.PLAYER_HAND_2+(this.APO()):
             case this.pE.PLAYER_HAND_3+(this.APO()):
             case this.pE.PLAYER_HAND_4+(this.APO()):
             case this.pE.PLAYER_HAND_5+(this.APO()):
                //the player can't place cards in their hand
                 break;
             case this.pE.PLAYER_STACK_1+(this.APO()):
             case this.pE.PLAYER_STACK_2+(this.APO()):
             case this.pE.PLAYER_STACK_3+(this.APO()):
             case this.pE.PLAYER_STACK_4+(this.APO()):                 
                 //can be a target as long as there is a from position
                 opt.selectableTo=true && (this.from.cardNo!=-1);
                 break;
             case this.pE.STACK_1:
             case this.pE.STACK_2:
             case this.pE.STACK_3:
             case this.pE.STACK_4:
                 opt.selectableTo= ([this.cE.ACE,this.cE.JOKER].includes(SMUtils.toFaceNumber(this.from.cardNo)));
          }
      }else{
          cardAtPosition=this.game.getCards(position)[this.game.getCards(position).length-1];
          
          switch(position){
              case this.pE.PLAYER_PILE+(this.APO()):
              case this.pE.PLAYER_HAND_1+(this.APO()):
              case this.pE.PLAYER_HAND_2+(this.APO()):
              case this.pE.PLAYER_HAND_3+(this.APO()):
              case this.pE.PLAYER_HAND_4+(this.APO()):
              case this.pE.PLAYER_HAND_5+(this.APO()):
                  if(isActivePlayerSelectable){
                      if(this.from.position>-1){ //a card is selected
                          if(this.from.position==position){
                              opt.selected=true;
                              opt.selectableFrom=true;
                          }
                      }else{
                          opt.selectableFrom=true;
                      }
                  }
                  break;
              case this.pE.PLAYER_STACK_1+(this.APO()):
              case this.pE.PLAYER_STACK_2+(this.APO()):
              case this.pE.PLAYER_STACK_3+(this.APO()):
              case this.pE.PLAYER_STACK_4+(this.APO()): 
                  if(isActivePlayerSelectable){
                      if(this.from.position>-1){ //a card is selected
                          if(this.from.position==position){
                              opt.selected=true;
                              opt.selectableFrom=true;
                          }      
                          if(this.from.position!=position && 
                             this.canDiscard() && 
                             this.from.position!=this.pE.PLAYER_PILE+(this.APO())){
                              opt.selectableTo=true;
                          }
                      }else{
                          opt.selectableFrom=true;
                      }
                  }
                  opt.canDiscard=this.canDiscard();
                  break;
              case this.pE.STACK_1:
              case this.pE.STACK_2:
              case this.pE.STACK_3:
              case this.pE.STACK_4:
                let topOfPile=SMUtils.getFaceNumber(this.game.getCards(position),this.game.getCards(position).length-1);

                opt.selectableTo= (topOfPile==(SMUtils.toFaceNumber(this.from.cardNo)-1) ||
                SMUtils.toFaceNumber(this.from.cardNo)==this.cE.JOKER);
           }
      }
      if(this.game.state==GameStatesEnum.GAME_OVER){
          opt.selectableFrom=false;
      }
      return opt;
  }
  isDiscard(position:number):boolean{
      if(position >= this.pE.PLAYER_STACK_1+(this.APO()) && position <=this.pE.PLAYER_STACK_4+(this.APO())){
          return (this.game.getCards(position).length>=1);
      }else{
          return false;
      }
          
  }
  canDiscard():boolean{
      let canDiscard:boolean;
      const stackSelected=()=>
          { if(this.from.position<0){
                  return false;
            }else{
                  return (this.pE.PLAYER_STACK_1+(this.APO())<=this.from.position &&
                     this.pE.PLAYER_STACK_4+(this.APO())>=this.from.position);
            }
          };
      for(let i=0;i<4;i++){
          //check that each active player stack has at least 1 card 
      canDiscard= this.game.getCards(this.pE.PLAYER_STACK_1+i+(this.pPE.PLAYER_2*this.game.activePlayer)).length>0;
          if(!canDiscard){break;}
      }
      return canDiscard && !stackSelected();
  }
  
  pos2ClientRec(pos:number):{top:number,left:number}{
      let id:string = `#pos${pos}`;
      const clientRect=document.querySelector( id).getBoundingClientRect();
      return {top:clientRect.top,left:clientRect.left};
  }
  playAgain(){
      const g:Game = this.gameSvc.newGame("new", this.game.player1Uuid, this.game.player2Uuid,this.game.local);
      this.message="";
      this.game = g;
      const url:string = `/play-area/${g.uuid}`;
      console.log(`route to new game: ${url}`);
      this.router.navigate([url]);
  }
  isActivePlayer(pIdx:number):boolean{
      let isActivePlayer:boolean=false;
      if(this.game.local){
          isActivePlayer =(pIdx==this.game.activePlayer);
      }else{
          isActivePlayer =(pIdx==this.game.activePlayer) && 
                          (this.players[pIdx].uuid == this.playerSvc.getActivePlayer().uuid);
      }
      return isActivePlayer;
  }
}
