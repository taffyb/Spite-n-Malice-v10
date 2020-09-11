// dialog-modal-example.component.ts
import { Component, Inject, Optional, OnInit } from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
 
@Component({
  selector: 'modal-dialog',
  templateUrl: './modal-dialog.html',
  styleUrls: ['./modal-dialog.css']
})
export class ModalDialog implements OnInit {
 
  message:string;
  placeholder:string;
  title:string;
  fromDialog:string="";
  dialogOptions:number;
  showOk:boolean;
  showClose:boolean;
  showCancel:boolean;
  showYesNo:boolean;
  showQuestionIcon:boolean;
  showWarningIcon:boolean;
  showInfoIcon:boolean;
  isInputBox:boolean;

  dialogOptionsEnum=DialogOptions;
 
  constructor(
    public dialogRef: MatDialogRef<ModalDialog>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.title=data.title;
      this.message = data.message;
      this.placeholder=data.placeholder;
      this.showClose=((data.dialogOptions&DialogOptions.CLOSE)==DialogOptions.CLOSE);
      this.showOk=((data.dialogOptions&DialogOptions.OK)==DialogOptions.OK);
      this.showCancel=((data.dialogOptions&DialogOptions.CANCEL)==DialogOptions.CANCEL);
      this.showYesNo=((data.dialogOptions&DialogOptions.YES_NO)==DialogOptions.YES_NO);
      this.showWarningIcon=((data.dialogOptions&DialogOptions.WARNING)==DialogOptions.WARNING);
      this.showQuestionIcon=((data.dialogOptions&DialogOptions.QUESTION)==DialogOptions.QUESTION);
      this.showInfoIcon=((data.dialogOptions&DialogOptions.INFO)==DialogOptions.INFO);
      this.isInputBox=((data.dialogOptions&DialogOptions.INPUT)==DialogOptions.INPUT);

      dialogRef.disableClose=((data.dialogOptions&DialogOptions.MANDATORY)==DialogOptions.MANDATORY);
      
    }
 
  ngOnInit() {
  }
  closeDialog(option:DialogOptions){ 
    if(this.isInputBox){
        this.dialogRef.close({event:'close',data:{option:option,input:this.fromDialog}}); 
    }else{
        this.dialogRef.close({event:'close',data:{option:option}}); 
    }
  }
}

export enum DialogOptions{
    OK=1,
    CLOSE=2,
    CANCEL=4,
    YES_NO=8,
    QUESTION=16,
    INFO=32,
    WARNING=64,
    MANDATORY=128,
    INPUT=256
}