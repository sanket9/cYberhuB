import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, RequestOptions,Headers } from "@angular/http";
import { environment } from "../../environments/environment.prod";
import { FormControl, FormGroup, NgForm, Validators, FormGroupDirective } from "@angular/forms";
import { ErrorStateMatcher } from '@angular/material/core';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

import "rxjs/add/operator/map";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  username: FormControl;
  password: FormControl;
  showErrors: boolean = false;
  constructor(public router: Router, public http: Http,
    public localStore: LocalStorageService,
    public SessionStore: SessionStorageService
    ) {      
      var status = this.SessionStore.retrieve('user-data');      
      if(status){
        this.router.navigate(["dashboard"]);
      }
      
  } 

  ngOnInit() {
    this.createFormControl();
    this.createFormGroup();
  }
  createFormControl() {
    this.username = new FormControl("", [Validators.required]);
    this.password = new FormControl("", [Validators.required]);
  }
  createFormGroup() {
    this.loginForm = new FormGroup({
      username: this.username,
      password: this.password
    });
    // console.log(this.loginForm);
    
  }
  loginBtn() {
    this.showErrors = false;
    this._markAsDirty(this.loginForm);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    let data = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };
    this.http
      .post(`${environment.apiUrl}/user/login`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        if (data.data.length == 0) {
          this.showErrors = true;
        } else if (data.data.length > 0){
          this.router.navigate(["dashboard"]);
          this.SessionStore.store('user-data', data.data)
        }
      });
    // this.router.navigate(["dashboard"]);
  }

  private _markAsDirty(group: FormGroup) {
    group.markAsDirty();
    for (let i in group.controls) {
      group.controls[i].markAsDirty();
    }
  }
}
