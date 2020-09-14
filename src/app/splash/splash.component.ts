import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import {Observable, of} from 'rxjs';
import { ModalDialog, DialogOptions } from '../modal-dialog/modal-dialog';
import {IPlayerModel, IGameModel, IProfileModel} from 's-n-m-lib';
import {PlayerService} from '../services/player.service';
import {ProfileService} from '../services/profile.service';
import {GameService} from '../services/game.service';
import {AuthService} from '../services/auth.service';
import {AuthTypesEnum} from '../enums';

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
    private profileSvc:ProfileService,
    private gameSvc:GameService,
    private authSvc:AuthService,
    public dialog: MatDialog) 
  { }

  ngOnInit() {
  }
  
  openDialog(message:string,options:number): void {
      const dialogRef = this.dialog.open(ModalDialog, {
        width: '300px',
        backdropClass:'custom-dialog-backdrop-class',
        panelClass:'custom-dialog-panel-class',
        data: {message: message,
               dialogOptions:options
              }
      });
   
      dialogRef.afterClosed().subscribe(async (result) => {
        let name = result.data.input;
        if(result.data.option == DialogOptions.OK && name.length>0){
            console.log(`login Dialog name:${name}`);
            let player:IPlayerModel = await this.playerSvc.getPlayerByName$(name).toPromise();
            this.onLogin.emit(player); 
        }
      });
  }
  login(){
      let msg:string = "Please Enter Username";
      let options:number = DialogOptions.OK+
                           DialogOptions.CANCEL+
                           DialogOptions.MANDATORY+
                           DialogOptions.INPUT;
      this.openDialog(msg,options);        
  }
  async guestEntry(){
    this.authSvc.setAuthType(AuthTypesEnum.GUEST);
    const player = await this.playerSvc.getPlayerByName$("Player1").toPromise();
    const profile$:Observable<IProfileModel> = this.profileSvc.getDefaultProfile$();
    const game:IGameModel = this.gameSvc.newGame("game",player.uuid,"222222",true); 
    this.router.navigate([`/play-area/${game.uuid}`]);
  }
}
