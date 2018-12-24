import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NgForm,
  Validators,
  FormGroupDirective,
  FormArray
} from "@angular/forms";
import { Http, RequestOptions, Headers } from "@angular/http";
import { environment } from "../../../environments/environment.prod";
import { Router, ActivatedRoute } from "@angular/router";
import { NotificationService } from "../../services/notification.service";
import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
@Component({
  selector: "app-edit-routine",
  templateUrl: "./edit-routine.component.html",
  styleUrls: ["./edit-routine.component.scss"]
})
export class EditRoutineComponent implements OnInit {
  editRoutine: FormGroup;
  day: string;
  sem: string;
  dept: string;
  year: string;
  org_id: string;
  showloader: boolean = false;
  dayRoutine: any;
  subjectlist;
  constructor(
    private _route: ActivatedRoute,
    public http: Http,
    public notification: NotificationService,
    public router: Router,
    public activeroute: ActivatedRoute,
    public SessionStore: SessionStorageService
  ) {}

  ngOnInit() {
    this._route.queryParams.subscribe(params => {
      this.day = params.day;
      this.sem = params.sem;
      this.year = params.year;
      this.dept = params.dept;
    });
    var status = this.SessionStore.retrieve("user-data");
    this.org_id = status[0].org_code;
    this.getdayRoutine();
    this.allcoursesubject();
  }
  getdayRoutine() {
    this.showloader = true;
    var status = this.SessionStore.retrieve("user-data");
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    let data = {
      day: this.day,
      sem: this.sem,
      year: this.year,
      dept_id: this.dept,
      org_id: this.org_id
    };
    console.log(data);

    this.http
      .post(`${environment.apiUrl}routine/getdayroutine`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        this.dayRoutine = data.data;
        this.filtercoursesubject(Number(this.dept));
        this.showloader = false;
      });
  }

  allcoursesubject() {
    let header = new Headers();
    header.set("Content-Type", "application/json");
    let data = { org_id: this.org_id };
    // this.checkshift = [];
    this.http
      .post(`${environment.apiUrl}subject/getall`, data)
      .map(res => res.json())
      .subscribe(data => {
        this.showloader = false;
        console.log(data);

        // this.orgShiftLists = data.data;
        this.subjectlist = [];
        data.data.forEach(ele => {
          if (this.subjectlist.length > 0) {
            var filterData = this.subjectlist.filter(item => {
              return item.class_id == ele.class_id;
            });

            // console.log('filter data : ', filterData);

            if (filterData.length > 0) {
              // console.log("match found", filterData);
              let i = this.subjectlist.indexOf(filterData[0]);
              this.subjectlist.splice(i, 1);

              filterData[0].subjectname.push({
                sub_name: ele.subject_name,
                id: ele.id,
                course_cat: ele.subcourse[0]
              });
              this.subjectlist.push(filterData[0]);
            } else {
              let data = {
                id: ele.id,
                shift: ele.class.org_shift.shifts.name,
                class_id: ele.class_id,
                class: ele.class.section.sec_name,
                subjectname: [
                  {
                    sub_name: ele.subject_name,
                    id: ele.id,
                    course_cat: ele.subcourse[0]
                  }
                ]
              };

              this.subjectlist.push(data);
            }
          } else {
            let data = {
              id: ele.id,
              shift: ele.class.org_shift.shifts.name,
              class_id: ele.class_id,
              class: ele.class.section.sec_name,
              subjectname: [
                {
                  sub_name: ele.subject_name,
                  id: ele.id,
                  course_cat: ele.subcourse[0]
                }
              ]
            };

            this.subjectlist.push(data);
          }
        });
        // 
        this.subjectlist = this.subjectlist.filter(item => item.class_id == this.dept);
        console.log(this.subjectlist);
      });
  }
  filtercoursesubject(dept_id: number){
    
    console.log(this.subjectlist);
    
  }
}
