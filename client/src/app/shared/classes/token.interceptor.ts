import { Injectable } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { AuthService } from '../services/auth.service'
import { catchError } from 'rxjs/operators'
import { Router } from '@angular/router'

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authS: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authS.isAuthenticated()) {
      req = req.clone({
        setHeaders: {
          Authorization: this.authS.getToken(),
        },
      })
    }
    return next
      .handle(req)
      .pipe(catchError((error: HttpErrorResponse) => this.handleAuthError(error)))
  }
  private handleAuthError(error: HttpErrorResponse): Observable<any> {
    if (error.status === 401) {
      this.router.navigate(['/login'], {
        queryParams: { sessionExpired: true },
      })
      this.authS.logOut()
    }
    return throwError(error)
  }
}
