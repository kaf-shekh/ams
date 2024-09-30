import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormControlObject } from 'src/app/models/Forms';
import { CommonService } from 'src/app/services/common.service';
import { DataBaseService } from 'src/app/services/data-base.service';
import * as formJson from "../../../assets/setting-form.json"
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent {

  isSubmitted: any;
  formValue: any = {}
  formData = [
    {
      key: 'role',
      placeholder: "Enter Role",
      error: "Enter valid value",
      pattern: '^[A-Za-z ]*$',
      ex: "Manager, Staff"
    },
    {
      key: 'shift',
      placeholder: "Enter Shift",
      error: "Enter valid value",
      pattern: '^[A-Za-z ]*$',
      ex: " Day, Night"


    },
    {
      key: 'workingTime',
      placeholder: "Enter Working Time",
      error: "Enter valid value",
      pattern: '^[A-Za-z0-9 -:]*$',
      ex: "10:00 am - 6:00 pm"

    },
    {
      key: 'workingDays',
      placeholder: "Enter Working Days",
      error: "Enter valid value",
      pattern: '^[A-Za-z -]*$',
      ex: "Mon-Fri"
    }
  ]

  formGroup: FormGroup = this.fb.group({});


  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private dataBaseService: DataBaseService
  ) {

    let jsonForm:any = formJson;
    this.createForm(jsonForm?.default ||this.formData)
    let data = this.dataBaseService.getSetting()
    this.formValue = data || {};

  }
  ngOnInIt() {
    this.createForm(this.formData)
  }
  private createForm(controls: any): void {

    for (let control of controls) {
      const newFormControl = new FormControl();
      if (control.pattern) {
        newFormControl.setValidators([Validators.pattern(control.pattern)]);
        newFormControl.updateValueAndValidity();
      }
      this.formGroup.addControl(control.key, newFormControl)
    }
  }

  pushValue(formControlName: string, value: any) {
    if (value.trim() === "") {
      return
    }
    let uuid = this.commonService.generateCryptoId(16);
    let fieldValue: any = {
      id: uuid,
      name: value.trim().replace(/\s+/g, ' '),
      value: value.replace(/\s+/g, '').toLowerCase()
    }
    if (this.formValue[formControlName]) {
      this.formValue[formControlName].push(fieldValue);
    } else {
      this.formValue[formControlName] = [];
      this.formValue[formControlName].push(fieldValue);
    }
    this.formGroup.controls[formControlName].reset();
  }

  cancle() {
    this.router.navigate(['dashboard'])
  }
  submit() {
    if (this.formValue) {
      this.dataBaseService.setSetting(this.formValue)
    }
  }
  removeArrayValue(index: number, formfield: string) {
    this.formValue[formfield]?.splice(index, 1)
  }

}
