import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Http, RequestOptions, Headers } from '@angular/http';
import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
import { environment } from "../../environments/environment.prod";
import {
  FormControl,
  FormGroup,
  NgForm,
  Validators,
  FormGroupDirective,
  FormArray
} from "@angular/forms";
@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"]
})
export class UserProfileComponent implements OnInit {
  userDetail: any;
  showloader: boolean = false;
  userdetailsForm: FormGroup;
  f_name: FormControl;
  l_name: FormControl;
  phone: FormControl;
  email: FormControl;
  adhar: FormControl;
  qualification: FormControl;
  username: FormControl;

  // userdetailsForm;
  constructor(
    public router: Router,
    public http: Http,
    public SessionStore: SessionStorageService
  ) {}

  ngOnInit() {
    this.getdetails();
    this.createFormControl();
    this.createFormGroup();
  }

  createFormControl() {
    this.f_name = new FormControl(
      // { value: this.userDetail["staffmaster"].f_name, disabled: true },
      // { value: this.userDetail.stafftmaster.f_name, disabled: true },
      "",
      [Validators.required]
    );
    this.l_name = new FormControl("", [Validators.required]);
    this.phone = new FormControl("", [Validators.required]);
    this.email = new FormControl("", [Validators.required]);
    this.qualification = new FormControl("", [Validators.required]);
    this.adhar = new FormControl("", [Validators.required]);
    this.username = new FormControl("", [Validators.required]);
  }

  createFormGroup() {
    this.userdetailsForm = new FormGroup({
      f_name: this.f_name,
      l_name: this.l_name,
      phone: this.phone,
      email: this.email,
      qualification: this.qualification,
      adhar: this.adhar,
      username: this.username
    });
  }

  getdetails() {
    this.showloader = true;
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    var status = this.SessionStore.retrieve("user-data");
    let data = { id: status[0].id, user_type_id: status[0].user_type_id };

    this.http
      .post(`${environment.apiUrl}user/user-details`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        console.log("from get details : ", data.data[0]);
        if (data.data) {
          this.userDetail = data.data[0];
          console.log(this.userDetail.stafftmaster.l_name);
        }
      });
  }
}
