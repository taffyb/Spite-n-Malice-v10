import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {AuthTypesEnum} from '../classes/auth.enums';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession
} from 'amazon-cognito-identity-js'; 

import { User } from '../classes/user.model';

const POOL_DATA = {
  UserPoolId: 'eu-west-2_iLbYEutKH',
  ClientId: 'lnvfm1csfmoh6a1urnaie4f5l'
};

const userPool = new CognitoUserPool(POOL_DATA);
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authIsLoading = new BehaviorSubject<boolean>(false);
  authDidFail = new BehaviorSubject<boolean>(false);
  authStatusChanged = new Subject<AuthTypesEnum>();
  registeredUser: CognitoUser;

  authType: AuthTypesEnum;
  constructor(private router:Router){
  }

  signUp(username: string, email: string, password: string): void {
    this.authIsLoading.next(true);
    const user: User = {
      username: username,
      email: email,
      password: password
    };
    const attrList: CognitoUserAttribute[] = [];
    const emailAttribute = {
      Name: 'email',
      Value: user.email
    };
    attrList.push(new CognitoUserAttribute(emailAttribute));
    userPool.signUp(user.username, user.password, attrList, null, (err, result) => {
      if (err) {
        this.authDidFail.next(true);
        this.authIsLoading.next(false);
        return;
      }
      this.authDidFail.next(false);
      this.authIsLoading.next(false);
      this.registeredUser = result.user;
    });
    return;
  }

  confirmUser(username: string, code: string) {
    this.authIsLoading.next(true);
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitUser = new CognitoUser(userData);
    cognitUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        this.authDidFail.next(true);
        this.authIsLoading.next(false);
        return;
      }
      this.authDidFail.next(false);
      this.authIsLoading.next(false);
      this.router.navigate(['/']);
    });
  }

  signIn(username: string, password: string): void {
    this.authIsLoading.next(true);
    const authData = {
      Username: username,
      Password: password
    };
    const authDetails = new AuthenticationDetails(authData);
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    const that = this;
    cognitoUser.authenticateUser(authDetails, {
      onSuccess (result: CognitoUserSession) {
        that.authStatusChanged.next(AuthTypesEnum.AUTHENTICATED);
        that.authDidFail.next(false);
        that.authIsLoading.next(false);
        console.log(result);
      },
      onFailure(err) {
        that.authDidFail.next(true);
        that.authIsLoading.next(false);
        console.log(err);
      }
    });
    this.authStatusChanged.next(AuthTypesEnum.AUTHENTICATED); // create user with cognito data
    return;
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
