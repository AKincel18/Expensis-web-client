import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginRequest } from './classes/login-request';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegisterRequest } from './classes/register-request';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from './classes/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn = false;
  private loginRequest: LoginRequest;
  private user: User;
  private token: string;
  redirectUrl: string;

  private initService() {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      this.loginByToken(token);
    }
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.initService();
  }

  private loginByToken(token: string) {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    this.token = token;
    this.user = decodedToken;
    this.isLoggedIn = true;
    localStorage.setItem('token', token);
  }

  public checkLogin() {
    return this.isLoggedIn;
  }

  public login(email: string, password: string) {
    this.http
      .post(
        'http://localhost:5001/api/token',
        {
          Email: email,
          Password: password,
        },
        {
          responseType: 'text',
        }
      )
      .subscribe((res) => {
        this.loginByToken(res);
        if (this.redirectUrl) {
          this.router.navigate([this.redirectUrl]);
          this.redirectUrl = '';
        } else {
          this.router.navigate(['/app/my-movies']);
        }
      });
  }

  public logout() {
    this.token = null;
    this.user = null;
    this.isLoggedIn = false;
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
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
    return this.token;
  }
}
