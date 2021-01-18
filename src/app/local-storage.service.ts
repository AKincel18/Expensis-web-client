import { Injectable } from '@angular/core';

const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';
const DATE_JOINED = 'dateJoined';

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

  public static getDateJoined() {
    return localStorage.getItem(DATE_JOINED);

  }

  public static setDateJoined(dateJoined: string) {
    localStorage.setItem(DATE_JOINED, dateJoined);

  }
}
