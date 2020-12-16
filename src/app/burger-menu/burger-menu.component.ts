import { Component, OnInit,Input,Output, EventEmitter } from '@angular/core';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {IProfileModel, DEFAULT_PROFILE, IPlayerModel} from 's-n-m-lib';
import {ProfileService} from '../services/profile.service';
import {PlayerService} from '../services/player.service';
import { Auth } from 'aws-amplify';
import {Router, NavigationStart } from '@angular/router';


@Component({
  selector: 'app-burger-menu',
  templateUrl: './burger-menu.component.html',
  styleUrls: ['./burger-menu.component.css']
})
export class BurgerMenuComponent implements OnInit {
  @Input()player:IPlayerModel;
  @Input()profile= DEFAULT_PROFILE;
    
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private profileSvc:ProfileService,
    private playerSvc:PlayerService) { }

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
  // async function signOut() {
  //   try {
  //       await Auth.signOut();
  //   } catch (error) {
  //       console.log('error signing out: ', error);
  //   }
  // }
  onSignOut(){
    this.playerSvc.signOut();
    Auth.signOut()
    .then(()=>{
      
      this.router.navigate(['/welcome']);
    })
    .catch(()=>console.error(`sign out error`));
    
  }
}
