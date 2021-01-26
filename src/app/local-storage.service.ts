import { Injectable } from '@angular/core';
import { User } from './classes/user';

const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';
const USER = 'user';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public static getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  public static setAccessToken(accessToken: string) {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
  }

  public static getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN);

  }

  public static setRefreshToken(refreshToken: string) {
    localStorage.setItem(REFRESH_TOKEN, refreshToken);

  }

  public static getUser(): User {
    var user = JSON.parse(localStorage.getItem(USER)) as User;
    user.date_joined = new Date(user.date_joined);
    return user;
  }

  public static setUser(user: User) {
    localStorage.setItem(USER, JSON.stringify(user));
  }
}
