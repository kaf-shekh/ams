import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../service/authentication.service';
import { User } from '../../model/user';
import { Router } from '@angular/router';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  loggedInUser: User;

  constructor(private authenticationService: AuthenticationService,private router:Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with basic auth credential
    if (this.loggedInUser === undefined || this.loggedInUser === null) {
      this.authenticationService.currentUser.subscribe(user => {
        this.loggedInUser = user;
      });
    }
    if (this.loggedInUser && this.loggedInUser.token) {
      request = request.clone({
        setHeaders: {
          authorization: `Bearer ${this.loggedInUser.token}`,
          user: `${this.loggedInUser}`
        }
      });
    }
    if (!this.loggedInUser) {
      let url = request.url;
      if (!(url.includes('login')  || url.includes('register')) ) {
        this.router.navigate(['/'])
      }
    }

    return next.handle(request);
  }
}
