import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import { User } from 'src/app/models/User';
import { DataBaseService } from 'src/app/services/data-base.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isAuthenticated: any;
  currentUser: any;
  pagePermission: any;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private dataBaseSerice: DataBaseService
  ) {
    this.auth.currentUser.subscribe(currentUser => this.currentUser = currentUser);
    this.pagePermission = this.dataBaseSerice.getUserPermission()
  }

  logout() {
    this.auth.logout();
  }


}
