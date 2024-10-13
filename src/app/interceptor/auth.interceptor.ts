import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';

/* service */
import { BackendService } from '../services/backend/backend.service';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private tokenService: BackendService, private router: Router) { }

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let authReq: any = request;
    const token = this.tokenService.getToken();

    if (token != null) {
      authReq = this.addTokenHeader(request, token);
    }
    return next.handle(authReq).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && !authReq.url.includes('login') && error.status === 401) {
        return this.handle401Error(authReq, next);
      } else {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          this.router.navigate(["/not-found"]);
        }
      }
      return throwError(error);
    }));

  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this.tokenService.getToken();

      if (token) {
        return this.tokenService.refreshToken(token).pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.tokenService.removeItem('pm_token');
            this.tokenService.addItem('pm_token', token.token);
            this.refreshTokenSubject.next(token.token);

            return next.handle(this.addTokenHeader(request, token.token));
          }),
          catchError((err) => {
            this.isRefreshing = false;

            this.tokenService.logout();
            return throwError(err);
          })
        );
      }
    }
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
  }
}
