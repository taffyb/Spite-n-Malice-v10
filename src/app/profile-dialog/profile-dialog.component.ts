import { Component, Inject, Optional,  OnInit } from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {IProfileModel,DEFAULT_PROFILE} from 's-n-m-lib';
//import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.css']
})
export class ProfileDialogComponent implements OnInit {
  _profile:IProfileModel=DEFAULT_PROFILE;
  profile:IProfileModel;
  
  constructor(
          public dialogRef: MatDialogRef<ProfileDialogComponent>,
          @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { 
      if(data && data.profile){
          this._profile=data.profile;
          this.profile=data.profile;
      }
      console.log(`onOpen:${JSON.stringify(data.profile)}`);
  }

  ngOnInit() {
  }
  onSubmit() {

  }
  disableSlider(slider:string):boolean{
      let disable:boolean = false;
      if(!this.profile.animation.animateYN){
          disable=true;
      }else{
          if(!this.profile.animation.animate[slider+'YN']){
              disable=true;
          }
      }
      return disable;
  }
  closeDialog(save:boolean){ 
      if(save){
          this.dialogRef.close({event:'close',data:this.profile});
      }else{
          this.dialogRef.close({event:'close'});
      }
  }
}
