import { Injectable } from "@angular/core";
import { AttendanceModel, LoginUser, User } from "../models/User";
import { AuthenticationService } from "../core/auth/authentication.service";
import { filter, Observable, of } from "rxjs";
import { CommonService } from "./common.service";
import * as userPermissionData from ".././../assets/user-permission.json";

@Injectable({
    providedIn: 'root'
})
export class DataBaseService {
    users: User[];
    currentUser: User;
    currentUserIndex: number;
    setting: any = {
        value: {},
        isUpdate: true
    };
    getUsers: any = {
        isUpdate: true,
        value: []
    }
    userPermission: any;
    userPermissionTemp: any = userPermissionData;
    constructor(
        private authService: AuthenticationService,
        private commonService: CommonService,
    ) {
        this.authService.currentUser.subscribe((user: User) => {
            this.currentUser = user;
        })
    }

    addAttendance(req: AttendanceModel): Observable<any> {
        try {
            if (!this.currentUser?.attendence || !this.currentUser?.attendence?.length) {
                this.currentUser.attendence = []
            }
            if (this.currentUserIndex) {
                req.userId = this.users?.[this.currentUserIndex]?.id
                this.users?.[this.currentUserIndex]?.attendence.push(req);
                this.usersUpdate();
                return of({ status: 200, message: "Added Succesfully" })
            } else {
                req.userId = this.currentUser?.id;
                this.currentUser?.attendence.push(req)
                this.updateUser(this.currentUser);
                this.getUser();

                return of({ status: 200, message: "Added Succesfully" })
            }
        } catch (error) {

        }
    }
    getAttendanceListbyId(id: string) {
        try {
            let user = this.getUserById(id)
            return user?.attendence || []
        } catch (error) {

        }
    }


    addUser(newUser: any) {
        try {
            if (this.currentUser) {
                let user = this.getUserBtEmail(newUser.email);
                if (user) {
                    return
                }
                // return 
                newUser.id = this.commonService.generateCryptoId()
                newUser.managerId = this.currentUser.id
                if (!this.users) {
                    this.users = [];
                    this.users.push(this.currentUser)
                }
                this.users.push(newUser);
                this.updateUser(this.currentUser);
                this.getUsers.isUpdate = true;
                this.usersUpdate();
            }
        } catch (error) {

        }

    }

    updateUser(req: User, formValue?: any) {
        try {
            if (req.id) {
                if (formValue) {
                    Object.assign(req, formValue)
                }
                let index = this.getUserIndexById(req.id)
                this.users[index] = req;
                this.usersUpdate();
                this.getUsers.isUpdate = true;
            } else {
                this.getUser()
            }
        } catch (error) {

        }
    }

    getUser() {
        try {
            if (this.users?.length) {
                this.currentUserIndex = this.users.findIndex((user: User) => user.id === this.currentUser?.id)
            } else {
                this.addUser(this.currentUser);
            }
        } catch (error) {

        }
    }

    usersUpdate() {
        try {
            localStorage.setItem("ams_users", JSON.stringify(this.users));
        } catch (error) {

        }
    }

    setSetting(value: any) {
        try {
            localStorage.setItem("ams_setting", JSON.stringify(value));
            this.setting.isUpdate = true;
        } catch (error) {

        }
    }

    getSetting() {
        try {
            if (this.setting.isUpdate) {
                let ams_setting = localStorage.getItem("ams_setting");
                if (ams_setting) {
                    this.setting.value = JSON.parse(ams_setting);
                    this.filterSetting()
                }
                this.setting.isUpdate = false;
            }
            return this.setting.value;
        } catch (error) {

        }
    }

    getAllUsers() {
        try {
            if (this.getUsers.isUpdate || !this.users || !this.users?.length) {
                let usersDB = localStorage.getItem("ams_users")
                this.users = JSON.parse(usersDB);
                this.getUsers.isUpdate = false;
            }
            return this.users
        } catch (error) {

        }
    }
    getAllUsersForSuperAdmin() {
        try {
            if (this.getUsers.isUpdate || !this.users || !this.users?.length) {
                let usersDB = localStorage.getItem("ams_users")
                if (usersDB) {
                    this.users = JSON.parse(usersDB) || [];
                    this.users = this.users.filter((user: User) => user.role !== 'superadmin')
                }
                this.getUsers.isUpdate = false;
            }
            return this.users || [];
        } catch (error) {

        }
    }

    updateUserById(id: string, user: User) {
        try {
            if (this.users?.length) {
                let index = this.getUserIndexById(id)
                if (index) {
                    this.users[index] = user;
                    this.usersUpdate()
                    this.getUsers.isUpdate = true;
                }
            } else {
                this.addUser(this.currentUser);
            }
        } catch (error) {

        }

    }
    getUserById(id: string) {
        try {
            if (!this.users?.length) {
                this.getAllUsers();
            }
            let index = this.getUserIndexById(id)
            let user = this.users[index];
            return user
        } catch (error) {

        }

    }

    getUserIndexById(id: string) {
        try {
            if (this.users) {
                return this.users.findIndex((user: User) => user.id === id)
            } else {
                this.users = this.getAllUsers();
                this.getUserIndexById(id)
            }
        } catch (error) {

        }
    }

    getUserBtEmail(email: string) {
        try {
            if (this.users?.length) {
                return this.users.find((user: User) => user?.email === email)

            } else {
                return
            }
        } catch (error) {

        }

    }

    filterSetting() {
        try {
            if (this.setting.value.role) {
                if (this.currentUser.role === 'superadmin') {
                    this.setting.value.role = this.setting.value.role.filter((role: any) => role.value !== 'superadmin')
                } else if (this.currentUser.role === 'manager') {
                    this.setting.value.role = this.setting.value.role.filter((role: any) => role.value !== 'superadmin' && role.value !== 'manager')
                }

            }
        } catch (error) {

        }
    }
    getUserByManagerId(id: string) {
        try {
            if (!this.users?.length) {
                this.getAllUsers()
            }
            return this.users.filter((user: User) => user.managerId === id)
        } catch (error) {

        }

    }
    addAtendancebyId(attendance: any) {
        try {
            let attendances = this.getAllattendanceList();
            let userAttendance = this.getAttendacebyId(attendance.userId);
            let alreadyAttendToday = false;
            //Uncommet After Testing
            // if (userAttendance) {
            //     alreadyAttendToday = this.commonService.compareDate(new Date(), userAttendance[userAttendance.length - 1].date)
            // }
            if (alreadyAttendToday) {
                return of({ status: 200, message: "Atendance already marked !!!" })
            }
            attendances.push(attendance);
            this.updateAttendanceList(attendances);
            return of({ status: 200, message: "Added Succesfully" })
        } catch (error) {

        }


    }
    getAttendacebyId(id: string) {
        try {
            if (this.currentUser.role !== 'superadmin') {
                let user = this.getUserById(id)
                if ((this.currentUser.id !== id && user.managerId != this.currentUser.id)) {
                    return [];
                }
            }
            let attendances = this.getAllattendanceList() || [];
            if (attendances) {
                attendances = attendances.filter((attendance: any) => attendance.userId === id)
            }
            return attendances
        } catch (error) {

        }
    }
    getAllattendanceList() {
        try {
            let attendanceList = localStorage.getItem("ams_attendance_list")
            let attendances = attendanceList ? JSON.parse(attendanceList) : [];
            return attendances
        } catch (error) {

        }

    }
    updateAttendanceList(attendances: any) {
        try {
            localStorage.setItem("ams_attendance_list", JSON.stringify(attendances));
        } catch (error) {

        }
    }

    getUserPermission() {
        try {
            if (!this.userPermission) {
                let permission = this.getPermission()
                if (false) {
                    this.userPermission = permission;
                } else {
                    console.log(this.userPermissionTemp)
                    let jsonPermission: any = userPermissionData;
                    console.log(jsonPermission)
                    this.updatetUserPermission(jsonPermission?.default);
                    let permission = this.getPermission()
                    if (permission) {
                        this.userPermission = permission;
                    }
                }
            }
            return this.userPermission
        } catch (error) {

        }

    }
    getPermission() {
        try {
            let permission = localStorage.getItem("ams_user_permission");
            if (permission) {
                permission = JSON.parse(permission);
            }
            return permission
        } catch (error) {

        }
    }
    updatetUserPermission(permission: any) {
        try {
            localStorage.setItem("ams_user_permission", JSON.stringify(permission));
            this.userPermission = {};
        } catch (error) {
        }
    }

    login(req: any) {
        let users = this.getAllUsers();
        let userData = users.find((user: User) => user.email === req.email && user.password === req.password);
        return userData
    }
}