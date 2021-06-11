import { Injectable } from '@angular/core';
import {MyAuthTypesEnum} from '../classes/auth.enums';
// import { Subject, Observable, BehaviorSubject } from 'rxjs';
import {Auth} from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private _authStatus: MyAuthTypesEnum = MyAuthTypesEnum.UNAUTHENTICATED;

    constructor(){
    }

    getAuthToken(){
        const token = Auth.Credentials.get;        
    }
    setAuthStatus(status:MyAuthTypesEnum){
        this._authStatus=status;
    }
    getAuthStatus():MyAuthTypesEnum{
        return this._authStatus;
    }

    public getAccessJwtToken = ():Promise<string> => {
        return new Promise(async (resolve,reject)=>{
            const user = await Auth.currentAuthenticatedUser();
            const key:string=`CognitoIdentityServiceProvider.${user.pool.clientId}.${user.username}.idToken`;
            const token = user.storage[key]; 
            // console.log(`AuthService.token:\n${token}`); 
            resolve(token);
        });
      }; 
}
