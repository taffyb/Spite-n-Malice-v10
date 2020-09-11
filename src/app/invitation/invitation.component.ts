import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import {IInvitationMessage} from 's-n-m-lib';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.css']
})
export class InvitationComponent implements OnInit {
  @Input()invite:IInvitationMessage;
  @Output()onAccept:EventEmitter<IInvitationMessage>=new EventEmitter<IInvitationMessage>();
  @Output()onDecline:EventEmitter<IInvitationMessage>=new EventEmitter<IInvitationMessage>();
  
  constructor() { }

  ngOnInit() {
  }
  
  accept(){
      this.onAccept.emit(this.invite);
  }
  decline(){
      this.onDecline.emit(this.invite);
  }
}
