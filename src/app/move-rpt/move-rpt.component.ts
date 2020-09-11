import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import {Observable,of} from 'rxjs';
import {ActivatedRoute, Router } from '@angular/router';
import {MoveService} from '../services/move.service';
import {GameService} from '../services/game.service';
import {IReport} from '../classes/reports';
import {BasicReport} from '../classes/basic.report';
import {IMoveModel, CardsEnum, MoveTypesEnum,PositionsEnum} from 's-n-m-lib';

@Component({
  selector: 'app-move-rpt',
  templateUrl: './move-rpt.component.html',
  styleUrls: ['./move-rpt.component.css']
})
export class MoveRptComponent implements OnInit {    
  @ViewChild('canvas', {read: ElementRef,static:true})   
  private canvas: ElementRef;
  @Input()report:IReport = new BasicReport;
  moves$:Observable<IMoveModel[]>;
  stats$:Observable<{moves:number[],jokers:number[],turns:number[]}>;
  
  constructor(
          private router: Router,
          private route: ActivatedRoute, 
          private moveSvc:MoveService, 
          private gameSvc:GameService) {
      route.params.subscribe(async (val) => {
          const gameUuid = val.gameUuid;
          if(gameUuid){
              try{
                  const game = await gameSvc.getGame$(gameUuid).toPromise(); 
                  let players = {};
                  players[game.player1Uuid]=0;
                  players[game.player2Uuid]=1;
                  this.moves$= this.moveSvc.getMoves$(gameUuid);
                  this.moves$.subscribe(
                      {
                         next: (moves:IMoveModel[])=>{
                             const stats={
                                     moves:[0,0],
                                     jokers:[0,0],
                                     turns:[0,0]
                                    }
                             moves.forEach((m:IMoveModel)=>{
//                                 console.log(`Move Id: ${m.id} ${MoveTypesEnum[m.type]} ${m.isDiscard}== ${m.isDiscard===true}`);
                                 if(m.type == MoveTypesEnum.PLAYER){
                                     if(String(m.isDiscard)=='true'){
//                                         console.log(`Discard Move: playerUuid:${m.playerUuid} playerNo:${players[m.playerUuid]} `);
                                         stats.turns[players[m.playerUuid]]+=1;
                                     }
                                     stats.moves[players[m.playerUuid]]+=1;
                                     if((m.to>=PositionsEnum.STACK_1 && m.to<=PositionsEnum.STACK_1) && m.card==CardsEnum.JOKER){
                                         stats.jokers[players[m.playerUuid]]+=1;
                                     }
                                 }
                             });
                             console.log(`${JSON.stringify(stats)}`);
                             this.stats$=of(stats);
                             this.report.renderCanvas(this.canvas,moves,game);
                         },
                         error:(err)=>{}
                      }
                  );
              }catch(err){
                  console.error(`catch block ${err} ${JSON.stringify(err)}`);
                  this.router.navigate(['/']);
              }
          }
      });
  }

  ngOnInit() {
  }

  private calculateStats(gameUuid:string){
      
  }
}
