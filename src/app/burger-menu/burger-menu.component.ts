import { Component, OnInit,Input,Output, EventEmitter } from '@angular/core';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';
import { MatDialog } from '@angular/material';
import {IProfileModel, DEFAULT_PROFILE, IPlayerModel} from 's-n-m-lib';
import {ProfileService} from '../services/profile.service';

@Component({
  selector: 'app-burger-menu',
  templateUrl: './burger-menu.component.html',
  styleUrls: ['./burger-menu.component.css']
})
export class BurgerMenuComponent implements OnInit {
  @Input()player:IPlayerModel;
  @Input()profile= DEFAULT_PROFILE;
    
  constructor(public dialog: MatDialog,private profileSvc:ProfileService) { }

  ngOnInit() {
  }

  onSettings(){
      console.log(`Settings clicked profile:${JSON.stringify(this.profile)}`);
      
      const dialogRef = this.dialog.open(ProfileDialogComponent, {
          backdropClass:'custom-dialog-backdrop-class',
          panelClass:'custom-dialog-panel-class',
          data: {profile:this.profile}
        });
      
      dialogRef.afterClosed().subscribe(async result => {
          if(result.data){
              //merge profile
              this.profile={...this.profile, ...result.data};  
              console.log(`afterClose: ${JSON.stringify(this.profile)}`);
              this.profileSvc.saveProfile(this.player.uuid,this.profile);
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
}
