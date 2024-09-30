import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import { User } from 'src/app/models/User';
import { DataBaseService } from 'src/app/services/data-base.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  pages: any;
  pageName: any = [];
  currentUser: User | undefined;
  constructor(
    private dataBaseService: DataBaseService,
    private authenticationService: AuthenticationService,

  ) {
    this.authenticationService.currentUser.subscribe(user => this.currentUser = user);
    this.pages = this.dataBaseService.getUserPermission()
    let role = this.currentUser.role;
    for (const key in this.pages) {
      console.log(key);
      if (key !== 'dashboard' && this.pages[key][role]) {
        this.pageName.push(key)

      }
    }
  }
}
