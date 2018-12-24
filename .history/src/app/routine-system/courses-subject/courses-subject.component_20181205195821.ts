import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Http, RequestOptions, Headers } from "@angular/http";
import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
import { environment } from "../../../environments/environment.prod";
import {
  FormControl,
  FormGroup,
  NgForm,
  Validators,
  FormGroupDirective,
  FormArray
} from "@angular/forms";
@Component({
  selector: "app-courses-subject",
  templateUrl: "./courses-subject.component.html",
  styleUrls: ["./courses-subject.component.scss"]
})
export class CoursesSubjectComponent implements OnInit {
  userdetailsFrm: FormGroup;
  org_code;
  orgClassSectionList;
  orgShiftLists;
  sortArray;
  classlist = [];
  constructor(
    public router: Router,
    public http: Http,
    public SessionStore: SessionStorageService
  ) {}

  ngOnInit() {
    this.org_code = this.SessionStore.retrieve("user-data")[0].org_code;
    this.getshift();
    this.getClassList();
  }

  getshift() {
    let header = new Headers();
    header.set("Content-Type", "application/json");
    let data = {
      org_id: this.org_code
    };
    // this.checkshift = [];
    this.http
      .post(`${environment.apiUrl}shift/orgshiftlist`, data)
      .map(res => res.json())
      .subscribe(data => {
        this.orgShiftLists = data.data;
      });
  }
  getClassList() {
    let header = new Headers();
    header.set("Content-Type", "application/json");

    let data = {
      org_id: this.org_code
    };

    this.http
      .post(`${environment.apiUrl}classsection/getall`, data)
      .map(res => res.json())
      .subscribe(data => {
        this.orgClassSectionList = data.data;
        
      });
  }
  onChooseShift(e) {
    console.log(e);
    this.sortArray = this.orgClassSectionList.filter(itm => itm.org_shift.id == e.value);
    this.sortArray.forEach(element => {
      if (element.indexOf(element.class.class_name) < 0){
        this.classlist.push(element.class.class_name);
      }
    });
    console.log(this.classlist);
  }
}