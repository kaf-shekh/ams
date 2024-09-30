import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
    password: ['', Validators.required]
  })
  show: boolean = false;
  isSubmitted: any = false;
  error:string;
  constructor(
    private auth: AuthenticationService,
    private fb: FormBuilder,
  ) {

  }

  ngOnInit() {
    this.initializeForm();
  }

  login() {
    this.isSubmitted=true;
    if (this.formGroup.invalid) {
      return
    }

    this.auth.login(this.formGroup.value).subscribe((res:any)=> {
      if (res.status !== 'success') {
        this.error = res.message
      }
    });
  }

  initializeForm() {
    this.formGroup = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    })
  }
}
