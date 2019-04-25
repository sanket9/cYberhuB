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
  FormArray,
} from "@angular/forms";
import { NotificationService } from "../services/notification.service";

import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"]
})
export class UserProfileComponent implements OnInit {
  userDetail: any;
  showloader: boolean = false;
  public Editor: ClassicEditor;
  userdetailsFrm: FormGroup;
  schooldetailsFrm: FormGroup;
  f_name: FormControl;
  l_name: FormControl;
  phone: FormControl;
  email: FormControl;
  adhar: FormControl;
  qualification: FormControl;
  username: FormControl;
  showInfoEditSection: boolean = false;
  showOrgInfo: boolean = true;

  orgInfo: any;

  // userdetailsForm;
  constructor(
    public router: Router,
    public http: Http,
    public SessionStore: SessionStorageService,
    public notification: NotificationService
  ) {}

  ngOnInit() {
    this.getdetails();
    // if (this.userDetail.stafftmaster) {
    //   this.createFormControl();
    //   this.createFormGroup();
    // }
    // this.createFormControl();
    // this.createFormGroup();
  }

  // createFormControl() {
  //   this.f_name = new FormControl(// { value: this.userDetail["staffmaster"].f_name, disabled: true },
  //     this.userDetail.stafftmaster.f_name,
  //     // "aaa",
  //     [Validators.required]);
  //   this.l_name = new FormControl("", [Validators.required]);
  //   this.phone = new FormControl("", [Validators.required]);
  //   this.email = new FormControl("", [Validators.required]);
  //   this.qualification = new FormControl("", [Validators.required]);
  //   this.adhar = new FormControl("", [Validators.required]);
  //   this.username = new FormControl("", [Validators.required]);
  // }

  createFormGroup() {
    this.userdetailsFrm = new FormGroup({
      f_name: new FormControl( // { value: this.userDetail["staffmaster"].f_name, disabled: true },
        this.userDetail.stafftmaster.f_name,
        // "aaa",
        [Validators.required]
      ),
      l_name: new FormControl(this.userDetail.stafftmaster.l_name, [
        Validators.required
      ]),
      phone: new FormControl(this.userDetail.phone, [Validators.required]),
      email: new FormControl(this.userDetail.stafftmaster.email, [
        Validators.required
      ]),
      qualification: new FormControl(
        this.userDetail.stafftmaster.qualification
      ),
      adhar: new FormControl(this.userDetail.stafftmaster.adhar),
      username: new FormControl(
        {
          value: this.userDetail.username,
          disabled: true
        },
        [Validators.required]
      )
    });

    this.schooldetailsFrm = new FormGroup({
      schcool_name: new FormControl(
        {
          value: this.userDetail.stafftmaster.orgmaster.org_name,
          disabled: true
        },
        [Validators.required]
      ),
      collg_phone: new FormControl(
        this.userDetail.stafftmaster.orgmaster.phone_no,
        [Validators.required]
      ),
      collg_web: new FormControl(
        this.userDetail.stafftmaster.orgmaster.website,
        [Validators.required]
      ),

      collg_email: new FormControl(
        this.userDetail.stafftmaster.orgmaster.email,
        [Validators.required]
      ),

      collg_landmark: new FormControl(
        this.userDetail.stafftmaster.orgmaster.landmark,
        [Validators.required]
      ),

      collg_city: new FormControl(
        this.userDetail.stafftmaster.orgmaster.org_city,
        [Validators.required]
      ),

      collg_country: new FormControl(
        this.userDetail.stafftmaster.orgmaster.org_country,
        [Validators.required]
      ),

      collg_pin: new FormControl(this.userDetail.stafftmaster.orgmaster.pin, [
        Validators.required
      ]),

      collg_reg: new FormControl(
        {
          value: this.userDetail.stafftmaster.orgmaster.org_reg,
          disabled: true
        },
        [Validators.required]
      )

      // affi_name
      // collg_affi: new FormControl(
      //   this.userDetail.stafftmaster.orgmaster.affi_name,
      //   [
      //     Validators.required
      //   ]
      // ),
    });
  }

  async getdetails() {
    this.showloader = true;
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    var status = this.SessionStore.retrieve("user-data");
    let data = { id: status[0].id, user_type_id: status[0].user_type_id };

    this.http
      .post(`${environment.apiUrl}user/user-details`, data, options)
      .map(res => res.json())
      .subscribe(async data => {
        this.showloader = false;
        console.log("college details : ", data.data[0]);
        if (data.data[0]) {
          this.userDetail = await data.data[0];
          if (this.userDetail) {
            // this.createFormControl();
            this.orgInfo = this.userDetail.stafftmaster.orgmaster.org_about;
            this.createFormGroup();
          }
        }
      });
  }

  editProfile(values) {
    console.log(values);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    var status = this.SessionStore.retrieve("user-data");
    values.org_id = status[0].org_code;
    this.http
      .post(`${environment.apiUrl}staff/updatestaff`, values, options)
      .map(res => res.json())
      .subscribe(data => {
        this.showloader = false;
        if (data.status == 0) {
          this.notification.showNotification(
            "top",
            "right",
            "success",
            "Student data Added SuccessFuly"
          );
        }
      });
    
  }
  editOrg(values) {
    // console.log(values);
    this.showloader = true;
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    var status = this.SessionStore.retrieve("user-data");
    values.org_id = status[0].org_code;
    this.http
      .post(`${environment.apiUrl}org/edit`, values, options)
      .map(res => res.json())
      .subscribe(data => {
        this.showloader = false;
        if (data.status == 0) {
          this.notification.showNotification(
            "top",
            "right",
            "success",
            "Student data Added SuccessFuly"
          );
        }
      });
  }

  editOrgInfo() {
    this.showInfoEditSection = true;
    this.showOrgInfo = false;
  }
}
