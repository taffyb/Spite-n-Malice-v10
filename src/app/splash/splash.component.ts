import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import {Observable, of} from 'rxjs';
import { ModalDialog, DialogOptions } from '../modal-dialog/modal-dialog';
import {IPlayerModel, IGameModel, IProfileModel} from 's-n-m-lib';
import {PlayerService} from '../services/player.service';
import {ProfileService} from '../services/profile.service';
import {GameService} from '../services/game.service';
import {MyAuthService} from '../services/auth.service';
import {MyAuthTypesEnum} from '../classes/auth.enums';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit {
  @Output()onLogin:EventEmitter<IPlayerModel> = new EventEmitter<IPlayerModel>();
  
  constructor(
    private router: Router,
    private playerSvc:PlayerService,
    private myAuthSvc:MyAuthService,
    private profileSvc:ProfileService,
    private gameSvc:GameService,
    public dialog: MatDialog) 
  { }

  ngOnInit() {
  }
  
  // openDialog(message:string,options:number): void {
  //     const dialogRef = this.dialog.open(ModalDialog, {
  //       width: '300px',
  //       backdropClass:'custom-dialog-backdrop-class',
  //       panelClass:'custom-dialog-panel-class',
  //       data: {message: message,
  //              dialogOptions:options
  //             }
  //     });
   
  //     dialogRef.afterClosed().subscribe(async (result) => {
  //       let name = result.data.input;
  //       if(result.data.option == DialogOptions.OK && name.length>0){
  //           console.log(`login Dialog name:${name}`);
  //           this.playerSvc.getPlayerByName$(name).subscribe((player)=>{
  //             this.router.navigate([`/home`]);
  //           });
  //       }
  //     });
  // }
  login(){

    Auth.currentAuthenticatedUser()
    .then(user =>{ 
        this.myAuthSvc.setAuthStatus(MyAuthTypesEnum.AUTHENTICATED);
        this.playerSvc.setActivePlayer(user.username);
        this.router.navigate([`/home`]);
    })
    .catch(err => {
      console.log(err);
      this.myAuthSvc.setAuthStatus(MyAuthTypesEnum.UNAUTHENTICATED);
      this.router.navigate([`/login`]);
    });
              
  }
  async guestEntry(){
    this.myAuthSvc.setAuthStatus(MyAuthTypesEnum.GUEST);
    const player = await this.playerSvc.getPlayerByName$("Player1").toPromise();
    const profile$:Observable<IProfileModel> = this.profileSvc.getDefaultProfile$();
    const game:IGameModel = this.gameSvc.newGame("game",player.uuid,"222222",true); 
    this.router.navigate([`/play-area/${game.uuid}`]);
  }

}
