import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { User } from 'src/app/models/User';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  currentUser: User | undefined;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(user => this.currentUser = user);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean {
    // logged in so return true
    if (this.currentUser!==null) {
      return true;
    }
    if (this.currentUser ===null || this.currentUser == undefined) {
      this.router.navigate(['/login']);
      return false;
    }

    if (state.url.includes('login')) {
      return false;
    }
    return false;
  }
}
