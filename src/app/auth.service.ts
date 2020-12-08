import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginRequest } from './classes/login-request';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegisterRequest } from './classes/register-request';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from './classes/user';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn = false;
  private loginRequest: LoginRequest;
  private user: User;
  accessToken: string;
  refreshToken: string;
  redirectUrl: string;

  private initService() {
    if (localStorage.getItem('accessToken')) {
      const token = localStorage.getItem('accessToken');
      //this.loginByToken(token);
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
    const helper = new JwtHelperService();
    this.accessToken = response.access_token;
    this.user = response.user;
    this.refreshToken = response.refresh_token;
    this.isLoggedIn = true;
    localStorage.setItem('accessToken', this.accessToken);
    localStorage.setItem('refreshToken', this.refreshToken);
  }

  public checkLogin() {
    return this.isLoggedIn;
  }

  public login(email: string, password: string) {
    this.http
      .post('http://localhost:8000/auth/', {
        email: email,
        password: password,
      })
      .subscribe((res) => {
        this.loginByToken(res as any);
        if (this.redirectUrl) {
          this.router.navigate([this.redirectUrl]);
          this.redirectUrl = '';
        } else {
          this.router.navigate(['/app']);
        }
      });
  }

  public logout() {
    this.accessToken = null;
    this.user = null;
    this.isLoggedIn = false;
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  loginByRefreshToken() {
    return this.http
      .post('http://localhost:8000/refresh/', {
        refresh_token: this.refreshToken,
      })
      .pipe(
        tap((response) => {
          const { access_token } = response as any;
          this.accessToken = access_token;
          localStorage.setItem('accessToken', this.accessToken);
        })
      );
  }

  register(registerForm: RegisterRequest, changeIdxCbk: () => void) {
    const dateString = `${registerForm.birth_date.getFullYear()}-${registerForm.birth_date.getMonth()}-${registerForm.birth_date.getDate()}`;
    registerForm.birth_date = dateString as any;
    registerForm.username = registerForm.email;
    this.http
      .post('http://localhost:8000/users/', registerForm)
      .subscribe((res) => {
        this.snackBar.open('Registered succesfully!', null, {
          duration: 5000,
        });
        changeIdxCbk();
      });
  }

  getUserData() {
    return this.user;
  }

  getToken() {
    return this.accessToken;
  }
}
