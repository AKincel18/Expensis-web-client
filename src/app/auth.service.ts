import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegisterRequest } from './classes/register-request';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from './classes/user';
import { tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { environment } from '../environments/environment';
import { EndpointPaths } from './endpoint-paths';
import { LocalStorageService as LocalStorage } from './local-storage.service';
import { Utils } from './utils/utils';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn = false;
  private user: User;
  accessToken: string;
  refreshToken: string;
  redirectUrl: string;

  private initService() {
    if (LocalStorage.getAccessToken()) {
      this.isLoggedIn = true;
      this.accessToken = LocalStorage.getAccessToken();
      this.refreshToken = LocalStorage.getRefreshToken();
      this.user = LocalStorage.getUser();
    }
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.initService();
  }

  private loginByToken(response: {
    access_token: string;
    refresh_token: string;
    user: User;
  }) {
    this.accessToken = response.access_token;
    this.user = response.user;
    this.refreshToken = response.refresh_token;
    this.isLoggedIn = true;
    LocalStorage.setAccessToken(this.accessToken);
    LocalStorage.setRefreshToken(this.refreshToken);
    LocalStorage.setUser(response.user)
  }

  public checkLogin() {
    return this.isLoggedIn;
  }

  public login(email: string, password: string) {
    this.http
      .post(environment.apiUrl + EndpointPaths.AUTH, {
        email: email,
        password: password,
      })
      .subscribe(
        (res) => {
          this.loginByToken(res as any);
          if (this.redirectUrl) {
            this.router.navigate([this.redirectUrl]);
            this.redirectUrl = '';
          } else {
            this.router.navigate(['/app']);
          }
        },
        (err: HttpErrorResponse) => {
          this.snackBar.open(err.error.detail, null, {
            duration: 5000,
          });
        }
      );
  }

  public logout() {
    this.accessToken = null;
    this.user = null;
    this.isLoggedIn = false;
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  loginByRefreshToken() {
    return this.http
      .post(environment.apiUrl + EndpointPaths.REFRESH, {
        refresh_token: this.refreshToken,
      })
      .pipe(
        tap((response) => {
          const { access_token } = response as any;
          this.accessToken = access_token;
          LocalStorage.setAccessToken(this.accessToken);
        })
      );
  }

  register(registerForm: RegisterRequest, changeIdxCbk: () => void, controls: FormGroup["controls"]) {
    
    registerForm.birth_date = Utils.parseDate(registerForm.birth_date);    
    registerForm.username = registerForm.email;
    this.http
      .post(environment.apiUrl + EndpointPaths.USERS, registerForm)
      .subscribe(
        (res) => {
        this.snackBar.open('Registered succesfully!', null, {
          duration: 5000,
        });
        changeIdxCbk();
        this.clearFields(controls);
      },
        (err: HttpErrorResponse) =>  {
            let msgError = Utils.getFirstError(err.error);
            this.snackBar.open(msgError, null, {
              duration: 5000,
            });        }
      );
  }

  private clearFields(controls: FormGroup["controls"]) {
    controls["email"].reset();
    controls["password"].reset();
    controls["cofirmationPassword"].reset();
    controls["birth_date"].reset();
    controls["gender"].reset();
    controls["income_range"].reset();
    controls["monthly_limit"].reset();
    controls["allow_data_collection"].reset();
  }
}
