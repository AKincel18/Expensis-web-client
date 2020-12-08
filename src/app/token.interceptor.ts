import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { observable, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      req.url.includes('register') ||
      req.url.includes('auth') ||
      req.url.includes('refresh')
    ) {
      return next.handle(req);
    }
    const authReq = req.clone(
      this.authService.accessToken
        ? {
            headers: req.headers.set(
              'authorization',
              'Token ' + this.authService.accessToken
            ),
          }
        : {}
    );
    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error.status != 401) {
          throw error;
        }

        const refreshToken = this.authService.refreshToken;
        const jwtHelper = new JwtHelperService();
        if (jwtHelper.isTokenExpired(refreshToken)) {
          this.authService.logout();
          throw error;
        }

        return this.authService.loginByRefreshToken().pipe(
          switchMap((response) => {
            const authReqRep = req.clone({
              headers: req.headers.set(
                'authorization',
                'Token ' + this.authService.accessToken
              ),
            });
            return next.handle(authReqRep);
          })
        );
      })
    );
  }
}
