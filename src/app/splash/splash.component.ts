import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ModalDialog, DialogOptions } from '../modal-dialog/modal-dialog';
import {IPlayerModel} from 's-n-m-lib';
import {PlayerService} from '../services/player.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit {
  @Output()onLogin:EventEmitter<IPlayerModel> = new EventEmitter<IPlayerModel>();
  @Output()onGuestEntry:EventEmitter<boolean> = new EventEmitter<boolean>();
  
  constructor(
          private playerSvc:PlayerService,
          public dialog: MatDialog) { }

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
  enterAsGuest(){
      this.onGuestEntry.emit(true); 
  }
}
