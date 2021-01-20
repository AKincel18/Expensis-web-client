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
    return JSON.parse(localStorage.getItem(USER)) as User;

  }

  public static setUser(user: User) {
    localStorage.setItem(USER, JSON.stringify(user));
  }
}
