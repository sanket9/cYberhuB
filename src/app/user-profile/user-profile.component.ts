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
import { MatTableDataSource, MatPaginator } from "@angular/material";

import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"]
})
export class UserProfileComponent implements OnInit {
  userDetail: any;
  showloader: boolean = false;
  public Editor = ClassicEditor;
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
  user_type_id
  // userdetailsForm;
  displayedColumns = [
    "id",
    "title",
    // "image",
    "affi_type",
    "actions"
  ];
  dataSource = new MatTableDataSource<Element>();
  affi_name: any;
  affi_type: any;

  constructor(
    public router: Router,
    public http: Http,
    public SessionStore: SessionStorageService,
    public notification: NotificationService
  ) {}

  ngOnInit() {
    this.getdetails();
    this.listaffiliates();
    // console.log(this.Editor);
    
    // if (this.userDetail.stafftmaster) {
    //   this.createFormControl();
    //   this.createFormGroup();
    // }
    // this.createFormControl();
    // this.createFormGroup();

    this.user_type_id = this.SessionStore.retrieve("user-data")[0].user_type_id;
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
      name: new FormControl( // { value: this.userDetail["staffmaster"].f_name, disabled: true },
        this.userDetail.stafftmaster.name,
        // "aaa",
        [Validators.required]
      ),
      // l_name: new FormControl(this.userDetail.stafftmaster.l_name, [
      //   Validators.required
      // ]),
      phone: new FormControl(this.userDetail.phone, [Validators.required]),
      email: new FormControl(this.userDetail.stafftmaster.email, [
        Validators.required
      ]),
      qualification: new FormControl(
        this.userDetail.stafftmaster.qualification
      ),
      adhar: new FormControl({ value: this.userDetail.stafftmaster.adhar_no, disabled: true },[Validators.required]),
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
        // this.userDetail.stafftmaster.orgmaster.org_country,
        "India",
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
        // console.log("college details : ", data.data[0]);
        if (data.data[0]) {
          this.userDetail = await data.data[0];
          if (this.userDetail) {
            // this.createFormControl();
            this.orgInfo = this.userDetail.stafftmaster.orgmaster.org_about;
            this.getOrgdetails();
            this.createFormGroup();
          }
        }
      });
  }

  getOrgdetails () {
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    var status = this.SessionStore.retrieve("user-data");
    let data = { org_id: status[0].org_code};

    this.http
      .post(`${environment.apiUrl}org/getdetail`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        // this.showloader = false;
        if (data.data) {

          // console.log(data.data[0].affileats);
          this.dataSource.data = data.data[0].affileats;
          
        }
      });
  }

  editProfile() {
    // console.log(values);
    let values = this.userdetailsFrm.getRawValue()
    console.log();
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    var status = this.SessionStore.retrieve("user-data");
    values.id = status[0].master_id;
    this.http
      .post(`${environment.apiUrl}staff/webupdate`, values, options)
      .map(res => res.json())
      .subscribe(data => {
        this.showloader = false;
        if (data.data) {
          this.notification.showNotification(
            "top",
            "right",
            "success",
            "Profile data Added SuccessFuly"
          );
        }
      });
    
  }
  editOrg() {
    // console.log(values);
    let values = this.schooldetailsFrm.getRawValue();
    this.showloader = true;
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    var status = this.SessionStore.retrieve("user-data");
    values.org_id = status[0].org_code;
    values.org_info = this.orgInfo
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
            "Institution data Updated SuccessFuly"
          );
          this.getdetails();
        }
      });
  }

  editOrgInfo() {
    this.showInfoEditSection = true;
    this.showOrgInfo = false;
  }

  listaffiliates() {
    this.showloader = true;
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    var status = this.SessionStore.retrieve("user-data");
    let data = {
      org_id: status[0].org_code
    }
    this.http
    .post(`${environment.apiUrl}org/affi/list`, data, options)
    .map(res => res.json())
    .subscribe(data => {
      this.showloader = false
      this.dataSource.data = data.data
    })

  }

  addaffiliates() {
    this.showloader = true
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    var status = this.SessionStore.retrieve("user-data");
    let data = {
      org_id: status[0].org_code,
      name: this.affi_name,
      type: this.affi_type 
    }
    this.http
    .post(`${environment.apiUrl}org/affi/add`, data, options)
    .map(res => res.json())
    .subscribe(data => {
      this.showloader = false;
      this.affi_name = '';
      this.affi_type = '';
      this.listaffiliates();
    })


  }

  deleteaffiliates(id) {
    if (confirm('Do you want to delete it ? ')) {
      this.showloader = true
      var headers = new Headers();
      headers.append("Content-Type", "application/json");
      let options = new RequestOptions({ headers: headers });
      var status = this.SessionStore.retrieve("user-data");
      let data = {
       id
      }
      this.http
      .post(`${environment.apiUrl}org/affi/delete`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        this.showloader = false;
        this.listaffiliates();
      })
      
    }


  }
}
export interface Element {
  id: number;
  title: string;
  // image: string;
  affi_type: string;

}