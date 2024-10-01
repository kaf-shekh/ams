import { Component, TemplateRef } from '@angular/core';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import { User } from 'src/app/models/User';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DataBaseService } from 'src/app/services/data-base.service';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css']
})
export class StaffListComponent {
  modalRef?: BsModalRef;
  currentUser: User | undefined;
  staff: any = []
  empDetails: User;
  isAdd: boolean = true;
  constructor(private authService: AuthenticationService, private modalService: BsModalService, private databaseServie: DataBaseService) {
    this.authService.currentUser.subscribe((user: User) => {
      this.currentUser = user;
      console.log(this.currentUser);
      this.getUser()

    })
  }

  openModal(template: TemplateRef<void>, modeAdd: boolean, emp?: User) {
    try {
      this.isAdd = modeAdd;
      if (!this.isAdd) {
        this.empDetails = emp;
      }
      this.modalRef = this.modalService.show(template, {
        ignoreBackdropClick: true
      });
    } catch (error) {

    }
  }

  closeModal(fetchUser: boolean) {
    if (fetchUser) {
      this.getUser();
    }
    this.modalRef?.hide();
  }

  getUser() {
    try {
      if (this.currentUser?.role === 'superadmin') {
        this.staff = this.databaseServie.getAllUsersForSuperAdmin();
      } else if (this.currentUser?.role === 'manager') {
        this.staff = this.databaseServie.getUserByManagerId(this.currentUser?.id);
      }
    } catch (error) {

    }
  }

}
