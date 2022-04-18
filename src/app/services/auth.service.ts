import { Injectable } from '@angular/core';
import {AuthTypesEnum} from '../classes/auth.enums';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import {Auth} from 'aws-amplify';
import * as common from './service.common';
import {HttpClient,HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private _authStatus: AuthTypesEnum = AuthTypesEnum.UNAUTHENTICATED;
    
    constructor(private http:HttpClient){
    }

    setAuthStatus(status:AuthTypesEnum){
        this._authStatus=status;
    }
    getAuthStatus():AuthTypesEnum{
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
    }

    public async whoAmI():Promise<string>{
        if(this.getAuthStatus()==AuthTypesEnum.AUTHENTICATED){
            return new Promise<string>((resolve,reject) => {
                const url = `${common.endpoint}/whoami`;
                this.getAccessJwtToken()
                .then(token=>{
                    // console.log(`token:\n${token}`);
                    const headers= new HttpHeaders().set('Authorization', token);
                    const http$ = this.http.get<string>(url,{headers:headers});
                    http$.subscribe(uuid=>{
                        resolve(uuid);
                    },
                    err=>{
                        console.error(`whoAmI.http.get:${JSON.stringify(err)}`);
                        
                    });
                })
                .catch(err=>{
                    reject(err);
                });
            });
        }
    }
}
