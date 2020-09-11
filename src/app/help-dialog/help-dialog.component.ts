import { Component, Inject, Optional,  OnInit } from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {IProfileModel,DEFAULT_PROFILE} from 's-n-m-lib';

@Component({
  selector: 'app-help-dialog',
  templateUrl: './help-dialog.component.html',
  styleUrls: ['./help-dialog.component.css']
})
export class HelpDialogComponent implements OnInit {

  constructor(
          public dialogRef: MatDialogRef<HelpDialogComponent>,
          @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {  }

  ngOnInit() {
  }

  closeDialog(){ 
      this.dialogRef.close({event:'close'});
  }
}
