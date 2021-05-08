import { Component, OnInit,Input,Output, EventEmitter } from '@angular/core';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Card, DEFAULT_PROFILE, ICardModel, IPlayerModel, Move, PositionsEnum} from 's-n-m-lib';
import { ProfileService} from '../services/profile.service';
import { PlayerService} from '../services/player.service';
import { GameService} from '../services/game.service';
import { Auth } from 'aws-amplify';
import { Router, NavigationStart } from '@angular/router';
import { environment} from '../../environments/environment';
import { Game } from '../classes/games';

@Component({
  selector: 'app-burger-menu',
  templateUrl: './burger-menu.component.html',
  styleUrls: ['./burger-menu.component.css']
})
export class BurgerMenuComponent implements OnInit {
  @Input()player:IPlayerModel;
  profile;
  debugging:boolean = ('debugging' in environment);
    
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private profileSvc:ProfileService,
    private gameSvc:GameService,
    private playerSvc:PlayerService) { }

  ngOnInit() {
  }

  onSettings(){
    this.profile=this.profileSvc.getActiveProfile()
      console.log(`Settings clicked profile:${JSON.stringify(this.profile)}`);
      
      const dialogRef = this.dialog.open(ProfileDialogComponent, {
          backdropClass:'custom-dialog-backdrop-class',
          panelClass:'custom-dialog-panel-class',
          data: {profile:this.profile}
        });
      
      dialogRef.afterClosed().subscribe(async result => {
          if(result.data){
              //merge profile
              this.profile={... this.profile, ...result.data};  
              console.log(`afterClose: ${JSON.stringify(this.profile)}`);
              this.profileSvc.saveProfile('12345',this.profile);
          }
      });
  }
  onHelp(){
      console.log(`Help clicked`);
      
      const dialogRef = this.dialog.open(HelpDialogComponent, {
          backdropClass:'custom-dialog-backdrop-class',
          panelClass:'custom-dialog-panel-class'
        });
  }
  onShowCards(){
    let gameUuid = prompt("Enter GameUUID");
    this.gameSvc.getGame$(gameUuid).subscribe({
      next:(game)=>{
        let out:string="["
        for(let pos:number=PositionsEnum.PLAYER_PILE;pos<=PositionsEnum.RECYCLE;pos++){
          out+="[";
          for(let c:number=0;c<game.cards[pos].length;c++){
            out+=game.cards[pos][c].cardNo;
            if(c<game.cards[pos].length-1){
              out+=",";
            }
          }
          out+="]";
          if(pos<PositionsEnum.RECYCLE){
            out+=",\n";
          }
        }
        out+="]";
        console.log(`${out}`);
      },
      error:(err)=>{console.error(`${err}`)}
    });
  }
  onSetCards(){
    const gameUUID:string = prompt("enter Game UUID");
    const cardsStr:string =prompt("enter cards array");
    console.log(cardsStr);
    
    const inArr:number[][] =JSON.parse(cardsStr);
    const cards:ICardModel[][]=[];

    for(let pos:number=PositionsEnum.PLAYER_PILE;pos<=PositionsEnum.RECYCLE;pos++){
      cards.push([]);
      for(let c:number=0;c<inArr[pos].length;c++){
        cards[pos].push(new Card(inArr[pos][c],pos));
      }
    }
    console.log(`${JSON.stringify(cards)}`);
    this.gameSvc.setGame(gameUUID,cards);
  }
  onSignOut(){
    this.playerSvc.signOut();
    Auth.signOut()
    .then(()=>{      
      this.router.navigate(['/welcome']);
    })
    .catch(()=>console.error(`sign out error`));
    
  }
}
