import { Injectable } from '@angular/core';
import {AuthTypesEnum} from '../classes/auth.enums';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession
} from 'amazon-cognito-identity-js'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authType: number;
  authStatusChanged: Subject<number> = new Subject<number>();
  constructor(){
  }

  setAuthType(authType: AuthTypesEnum){
    this.authType = authType;
    this.authStatusChanged.next(authType);
  }
  isAuthenticated(): Observable<boolean> {
    // const user = this.getAuthenticatedUser();
    const obs = Observable.create((observer) => {
      observer.next(this.authType === AuthTypesEnum.AUTHENTICATED);
      observer.complete();
    });
    return obs;
  }

  initAuth() {
    this.isAuthenticated().subscribe(
      (auth) => this.authStatusChanged.next(AuthTypesEnum.UNAUTHENTICATED)
    );
  }
}
