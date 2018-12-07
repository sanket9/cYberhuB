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
  subjectFrm: FormGroup;
  subjectsArry: FormArray;
  org_code;
  orgClassSectionList;
  orgShiftLists;
  sortArray;
  classlist = [];
  showloader: boolean = false;
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
    this.showloader = true
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
        this.showloader = false;
        this.orgShiftLists = data.data;
      });
  }
  getClassList() {
    this.showloader = true;
    let header = new Headers();
    header.set("Content-Type", "application/json");

    let data = {
      org_id: this.org_code
    };

    this.http
      .post(`${environment.apiUrl}classsection/getall`, data)
      .map(res => res.json())
      .subscribe(data => {
        this.showloader = false;
        this.orgClassSectionList = data.data;
      });
  }
  onChooseShift(e) {
    this.classlist = [];
    // console.log(e);
    this.sortArray = this.orgClassSectionList.filter(
      itm => itm.org_shift.id == e.value
    );
    this.sortArray.forEach(element => {
      if (this.classlist.indexOf(element.class.class_name) < 0) {
        this.classlist.push(element.class.class_name);
      }
    });
    // console.log(this.classlist);
  }
  onChooseClass(e) {
    // console.log(this.sortArray);

    this.sortArray = this.sortArray.filter(
      itm => itm.class.class_name === e.value
    );
  }
  onChooseClassStream(e) {
    // console.log(e);
    this.showloader = true;
    let header = new Headers();
    header.set("Content-Type", "application/json");

    let data = { org_id: this.org_code, class_id: e.value };

    this.http
      .post(`${environment.apiUrl}subject/getbyClass`, data)
      .map(res => res.json())
      .subscribe(data => {
        this.showloader = false;
        console.log(data);
        if(data.data)
        {
          for (let index = 0; index < data.data.length; index++) {
            this.subjectsArry = new FormArray([
              new FormGroup({
                class_id: new FormControl(
                  data.data[index].subject_name,
                  [Validators.required]
                ),
                component_id: new FormControl("", [
                  Validators.required
                ])
              })
            ]);
            
          }
          this.subjectFrm = new FormGroup({
            subject: this.subjectsArry
          });
        }

        console.log(this.subjectFrm.value)
        
      });
  }
}
