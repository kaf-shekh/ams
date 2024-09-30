import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as data from '../../../assets/add-user-form.json'
import { FormControlObject } from 'src/app/models/Forms';
import { DataBaseService } from 'src/app/services/data-base.service';
import { User } from 'src/app/models/User';
import { retry } from 'rxjs/operators';
import { RegexPatters } from 'src/app/core/patern/regex-patterns';

@Component({
  selector: 'app-add-update-staff',
  templateUrl: './add-update-staff.component.html',
  styleUrls: ['./add-update-staff.component.css']
})

export class AddUpdateStaffComponent implements OnInit {
  formGroup: FormGroup = this.fb.group({})
  form: FormControlObject[] = (data as any).default;
  isSubmitted: boolean = false;

  @Input() empDetail: any;
  @Input() isAdd: any;
  @Output() complete = new EventEmitter<boolean>();
  constructor(private fb: FormBuilder,
    private databaseService: DataBaseService
  ) {

    this.updateList()
  }

  ngOnInit() {
    this.createForm(this.form);
    if (!this.isAdd) {
      this.formGroup.patchValue(this.empDetail)
    }
  }
  private createForm(controls: FormControlObject[]): void {
    try {
      for (let control of controls) {
        control.hidden = false
        const newFormControl = new FormControl();
        if (control.option.required) {
          newFormControl.setValidators(Validators.required);
        }
        if (control.option.pattern && control.key == 'email') {
            newFormControl.setValidators(Validators.pattern(RegexPatters.email));
        }
        newFormControl.updateValueAndValidity()

        this.formGroup.addControl(control.key, newFormControl)
        if (!this.isAdd) {
          if (control.key === 'userName') {
            this.formGroup.controls[control.key].disable()

          } else if (control.key === 'password') {
            control.hidden = true
          }
        }
      }
    } catch (error) {

    }
  }
  submit() {
    try {
      this.isSubmitted=true
      if (this.formGroup.invalid) {
        return
      }

      if (!this.isAdd) {
        if (this.formGroup.value.userName) {
          this.formGroup.controls['userName'].enable()
        }
        let req = this.empDetail

        this.databaseService.updateUser(this.empDetail, this.formGroup.value)
      } else {
        this.databaseService.addUser(this.formGroup.value);
      }
      this.isSubmitted = false;

      this.cancle(true)
    } catch (error) {

    }

  }
  cancle(transaction: boolean = false) {
    this.complete.emit(transaction);
    // this.formGroup.reset();
  }

  updateList() {
    try {
      let list = this.databaseService.getSetting();
      for (let ele of this.form) {
        if (ele?.option?.list && list[ele.key]) {
          ele.option.list = list[ele.key]
        }

      }
    } catch (error) {

    }
  }

}
