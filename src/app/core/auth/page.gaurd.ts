import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { User } from '../../models/User';
import { DataBaseService } from 'src/app/services/data-base.service';


@Injectable({ providedIn: 'root' })
export class PageGuard implements CanActivate {
  currentUser: User | undefined;
  pagePermission: any;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService, private dataBaseSerice: DataBaseService
  ) {
    this.authenticationService.currentUser.subscribe(user => this.currentUser = user);
    this.pagePermission = this.dataBaseSerice.getUserPermission()
    console.log(this.pagePermission)
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (this.pagePermission[route.url[0]?.path][this.currentUser.role]) {
      return true
    } else {

      if (this.currentUser === null || this.currentUser == undefined) {
        this.router.navigate(['/login']);
        return false;
      }
      this.router.navigate(['/dashboard']);
      return false
    }

    // not logged in so redirect to login page with the return url
    // this.router.navigate(['/'], { queryParams: { returnUrl: state.url } }); // skipLocationChange: true,
    // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
