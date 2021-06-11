import { Injectable } from '@angular/core';
import {Subject } from 'rxjs';
import {AuthService} from './auth.service';
const WS_ENDPOINT = "wss://24gu6qsupj.execute-api.eu-west-2.amazonaws.com/dev";

interface BodyData{
  action:string,
  data:any
}

@Injectable({
  providedIn: 'root'
})
export class WsService {

  private socket:WebSocket;
  private observers:any={};

  constructor(private authSvc:AuthService) {
  }
  on(action:string,observer:Subject<any>){
    if(!this.observers[action]){
      this.observers[action]=[];
    }
    this.observers[action].push(observer);
  }
  send<T>(action:string,data:T){
    const bodyData:BodyData={
      action:action,
      data:data
    }
    this.socket.send(JSON.stringify(bodyData));
    console.log(`Send ${JSON.stringify(bodyData,null,2)}`);
    
  }
  async connect(){
    const self=this;
    const token= await this.authSvc.getAccessJwtToken();
    if(!this.socket){
      const wsUrl= WS_ENDPOINT+'?token='+token;
      // console.log(`wsURL ${wsUrl}`);
      
      this.socket = new WebSocket(wsUrl); 
    }
    
    this.socket.onopen = function(e) {
      console.log(`[ws-open] Connection established`);
    };
    this.socket.onmessage = function(event) {
      console.log(`[ws-message] Data received from server: ${event.data}`);
      let bodyData:BodyData = JSON.parse(event.data);
      if(self.observers[bodyData.action]){
        self.observers[bodyData.action].forEach(observer => {
          observer.next(bodyData.data);          
        });
      }else{
        console.warn(`Unhandled Action:${bodyData.action}\nData:${JSON.stringify(bodyData.data,null,2)}`);
      }      
    };
    this.socket.onclose = function(event) {
      if (event.wasClean) {
        console.log(`[ws-close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log(`[ws-close] Connection died\n${JSON.stringify(event)}`);
      }
    };
    this.socket.onerror = function(error:ErrorEvent) {
      console.log(`[ws-error] ${error.message}`);
    };
  }
  disconnect(){
    this.socket.close();
    this.socket = null;
  }
}
