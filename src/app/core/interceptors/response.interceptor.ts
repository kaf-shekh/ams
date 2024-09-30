import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AuthenticationService } from '../../service/authentication.service';

// tslint:disable-next-line: ban-types
declare let gtag: Function; // Declare ga as a function

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(request)
    return next.handle(request).pipe(
      // retry(1),
      catchError(err => {

        // const error = err.error.message || err.statusText;

        // // Sending data to google analytics service

        // gtag('send', 'exception', {
        //   exDescription: error,
        //   exFatal: false
        // });
        if (err?.error?.auth == false && err?.error?.message === "Token Expired") {
          this.authService.logout();
        }
        console.log(err)

        return throwError(err);
      }));
  }
}
