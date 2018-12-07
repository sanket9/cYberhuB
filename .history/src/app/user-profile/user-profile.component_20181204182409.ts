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
  createFormControl() {}
  createFormGroup() {}
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
        console.log(data);
        if (data.data) {
          this.userDetail = data.data;
        }
      });
  }
}
