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
  compponents: any;
  constructor(
    public router: Router,
    public http: Http,
    public SessionStore: SessionStorageService
  ) {}

  ngOnInit() {
    this.org_code = this.SessionStore.retrieve("user-data")[0].org_code;
    this.getshift();
    this.getClassList();
    this.subjectFrm = new FormGroup({
      subject: new FormArray([])
    });
    this.getcourcecat();
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
            let frm_data = new FormGroup({
              class_id: new FormControl(
                data.data[index].subject_name,
                [Validators.required]
              ),
              component_id: new FormControl("", [
                Validators.required
              ])
            })
            //console.log(this.subjectFrm.value);
            let subs = this.subjectFrm.get("subject");
            (subs as FormArray).push(frm_data);
            //this.subjectsArry.push(frm_data);
          }
          
        }

        console.log(this.subjectFrm.value)
        
      });
  }

  getcourcecat(){
     this.showloader = true;
    let header = new Headers();
    header.set("Content-Type", "application/json");

    let data = { org_id: this.org_code};

    this.http
      .post(`${environment.apiUrl}coursecat/getall`, data)
      .map(res => res.json())
      .subscribe(data => {
        this.showloader = false;
        console.log(data);
        let arry = [];
        data.data.forEach(ele => {
          if (ele.parent_id == 0){
            let data = {
              id: ele.id,
              name: ele.name,
              short: ele.short_name,
              subs: []
            };
            arry.push(data);
          } else if (ele.parent_id !== 0) {
            let data = { id: ele.id, name: ele.name, short: ele.short_name };
            let pr_id = ele.parent_id;
            arry.filter(itm => {
              if (itm.id == pr_id) {
                itm.subs.push(data);
              }
            });
          }
        });
        // 
        this.compponents = arry;
        console.log(arry);
        
      });
  }
}