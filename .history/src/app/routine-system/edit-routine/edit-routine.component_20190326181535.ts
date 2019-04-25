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
  teachers;
  org_rooms;
  stream;
  SubjectComponent;
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
      this.stream = params.stream;
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
      org_id: this.org_id,
      stream: this.stream
    };
    console.log(data);

    this.http
      .post(`${environment.apiUrl}routine/getdayroutine`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        this.dayRoutine = data.data;
        this.dayRoutine.forEach(element => {});
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
        // console.log(data);

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
                dept_id: ele.dept_id,
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
              dept_id: ele.dept_id,
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
            this.showloader = false;
          }
        });
        //
        this.subjectlist = this.subjectlist.filter(
          item => item.class_id == this.dept
        );
        console.log(this.subjectlist);
        this.getTeachers(this.subjectlist[0].dept_id);
      });
  }

  getTeachers(dept_id) {
    // console.log(e);
    this.showloader = true;
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    let apidata = {
      dept_id: this.dept,
      org_id: this.org_id
    };

    this.http
      .post(`${environment.apiUrl}staff/teacher-search`, apidata, options)
      .map(res => res.json())
      .subscribe(data => {
        this.showloader = false;
        console.log(data);
        if (data.data) {
          this.teachers = data.data;
          this.getallRooms();
          this.http
            .post(
              `${environment.apiUrl}coursecat/getsubcource`,
              apidata,
              options
            )
            .map(res => res.json())
            .subscribe(data => {
              // console.log("subjst",data);
              this.SubjectComponent = data.data;
            });
        }
      });
  }
  getallRooms() {
    // this.showloader = true;
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    let data = {
      org_id: this.org_id
    };
    this.http
      .post(`${environment.apiUrl}room/getall`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        this.org_rooms = data.data;
      });
  }

  update(i, id) {
    // console.log(id);
    let data = {
      id,
      cc_name: this.dayRoutine[i].rutinedetails[0].cc_name,
      room_id: this.dayRoutine[i].rutinedetails[0].room.id,
      teacher_id: this.dayRoutine[i].rutinedetails[0].teacher.id
    };
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    this.http
      .post(`${environment.apiUrl}routine/updateroutine`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        if (!data.error && data.data) {
          this.notification.showNotification(
            "top",
            "right",
            "success",
            "Routine data Added."
          );
        } else {
          this.notification.showNotification(
            "top",
            "right",
            "warning",
            "Something Went Wrong."
          );
        }
      });
  }
}
