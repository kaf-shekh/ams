import { Component, Input, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import { AttendanceModel, User } from 'src/app/models/User';
import { CommonService } from 'src/app/services/common.service';
import { DataBaseService } from 'src/app/services/data-base.service';

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.css']
})
export class AttendanceListComponent {

  // @Input() attendenceList: AttendanceModel[] | undefined;
  attendenceList: AttendanceModel[] | undefined = [];
  id: string = ""
  modalRef?: BsModalRef;
  popupData: any;
  currentUser: User;
  currentDate = new Date()
  allowAttendance: boolean = false;
  constructor(private modalService: BsModalService, private route: ActivatedRoute, private dataBaseService: DataBaseService, private authService: AuthenticationService, private commonService: CommonService) {
    this.authService.currentUser.subscribe((user) => this.currentUser = user);
    this.route.queryParams.subscribe(params => {
      this.id = params.id;
      if (this.id) {
        this.getuserAttendelist(this.id);
      }
    });
  }

  checkForAttendance() {
    try {
      if (this.currentUser?.id === this.id && this.attendenceList?.length > 0) {
        let date1 = new Date();
        let date2 = new Date(this.attendenceList[this.attendenceList.length - 1].date);
        this.allowAttendance = !this.commonService.compareDate(date1, date2);
      }
    } catch (error) {

    }
  }
  openModal(template: TemplateRef<void>, data?: any) {
    if (data) {
      this.popupData = data;
    }
    this.modalRef = this.modalService.show(template, {
      ignoreBackdropClick: true,

    });
  }

  closeModal() {
    this.modalRef?.hide();
  }
  getuserAttendelist(id: string) {
    try {
      this.attendenceList = this.dataBaseService.getAttendacebyId(id);
      this.checkForAttendance()
    } catch (error) {

    }
  }
}
