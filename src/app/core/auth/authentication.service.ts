import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LoginUser, User } from 'src/app/models/User';

import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<User>;
  private users: User[];
  user: User;
  userData: User | undefined;
  userExist = false;

  constructor(
    private router: Router) {

    this.user = JSON.parse(localStorage.getItem("_ud") || "null");
    this.users = JSON.parse(localStorage.getItem("ams_users") || "null");
    if (this.users === null) {
      this.users = [];
    }
    if (this.user === null) {
      this.currentUserSubject = new BehaviorSubject<any>(null);
    } else {
      this.currentUserSubject = new BehaviorSubject<any>(this.user);
    }
    this.currentUser = this.currentUserSubject.asObservable();
    this.currentUser.subscribe(data => this.user = data);
  }

  setUser(current: User) {
    if (current === null) {
      return;
    }
    var user: User = {
      id: current.id,
      userName: current.userName,
      role: current.role,
      attendence: current?.attendence,
      shift: current.shift,
      workingTime: current.workingTime,
      workingDays: current.workingDays
    }
    this.users.push(user);
    localStorage.setItem("_ud", JSON.stringify(user));
    this.currentUserSubject.next(current);
  }

  logout() {
    localStorage.removeItem('_ud');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
  login(req: LoginUser) {
    try {
      let users = JSON.parse(localStorage.getItem("ams_users") || "[]");
      let userData = users.find((user: User) => user.email === req.email && user.password === req.password);
      if (userData) {
        this.setUserData(userData);
        this.router.navigate(['dashboard'])
        return of({status:'success', message:"Welcome !!"})
      } else {
        return of({status:'failed', message:"User details not matched."})
      }
    } catch (error) {

    }
  }

  setUserData(user: User) {
    if (user) {
      localStorage.setItem("_ud", JSON.stringify(user));
      this.currentUserSubject.next(user);
    }
  }
}
