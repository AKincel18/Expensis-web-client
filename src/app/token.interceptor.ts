import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { EndpointPaths } from './endpoint-paths';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      req.url.includes(EndpointPaths.AUTH) ||
      req.url.includes(EndpointPaths.REFRESH)
    ) {
      return next.handle(req);
    }
    const authReq = req.clone(
      this.authService.accessToken
        ? {
          headers: req.headers.set(
            'Authorization',
            'Bearer ' + this.authService.accessToken
          )
        }
        : {}
    );
    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error.status != 403) {
          throw error;
        }

        const refreshToken = this.authService.refreshToken;
        const jwtHelper = new JwtHelperService();
        if (jwtHelper.isTokenExpired(refreshToken)) {
          this.authService.logout();
          throw error;
        }

        return this.authService.loginByRefreshToken().pipe(
          retry(1),
          switchMap(() => {
            const authReqRep = req.clone({
              headers: req.headers.set(
                'Authorization',
                'Bearer ' + this.authService.accessToken
              ),
            });
            return next.handle(authReqRep);
          }),
          catchError(this.handleRefreshError)
        );
      })
    );
  }

  handleRefreshError(error) {
    const refreshToken = this.authService.refreshToken;
    const jwtHelper = new JwtHelperService();
    if (jwtHelper.isTokenExpired(refreshToken)) {
      this.authService.logout();
      throw error;
    }
    return throwError(error.status);
  }
}
