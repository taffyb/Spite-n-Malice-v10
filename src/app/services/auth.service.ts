import { Injectable } from '@angular/core';
import {MyAuthTypesEnum} from '../classes/auth.enums';
// import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyAuthService {
    private _authStatus: MyAuthTypesEnum = MyAuthTypesEnum.UNAUTHENTICATED;

    constructor(){
    }

    setAuthStatus(status:MyAuthTypesEnum){
        this._authStatus=status;
    }
    getAuthStatus():MyAuthTypesEnum{
        return this._authStatus;
    }
}
