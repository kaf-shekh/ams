import { Component } from '@angular/core';
import * as userPermissionData from "../assets/user-permission.json";
import * as setting from "../assets/migration/setting.json";
import * as users from "../assets/migration/user.json";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ams';
  constructor() {
    let permission = localStorage.getItem("ams_user_permission");
    let ams_setting = localStorage.getItem("ams_setting");
    let usersDB = localStorage.getItem("ams_users");
    let attendanceList = localStorage.getItem("ams_attendance_list");

    if (!permission) {
      let user_permission: any = userPermissionData
      localStorage.setItem("ams_user_permission", JSON.stringify(user_permission?.default));
    }

    if (!ams_setting) {
      let app_setting: any = setting;
      localStorage.setItem("ams_setting", JSON.stringify(app_setting.default));
    }

    if (usersDB) {
      let ams_users: any = users;
      localStorage.setItem("ams_users", JSON.stringify(ams_users.default));
    }


  }
}
